import { GEMINI_SAJU_INSTRUCTION, geminiReportSchema, SECTION_IDS } from './report.mjs';
import { FACE_INSTRUCTION, geminiFaceSchema, normalizeFaceReport, validateFacePayload } from './face.mjs';

const MAX_BODY = 16000;
const MAX_FACE_BODY = 1500000;
// 화면 안내용 값이다. 실제 한도는 supabase/saju-quota.sql의 saju_reserve_generation과 같아야 한다.
export const LIMITS = { daily: 1000, perIP: 50, cooldown: 10000 };
const json = (value, status = 200, extra = {}) => new Response(JSON.stringify(value), {
  status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra }
});
export const koreanDay = (now = Date.now()) => new Date(now + 9 * 3600000).toISOString().slice(0, 10);

async function boundedText(body, limit) {
  if (!body) throw Error('body');
  const reader = body.getReader(), chunks = []; let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) { await reader.cancel(); throw Error('large'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const all = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { all.set(chunk, offset); offset += chunk.length; }
  return new TextDecoder().decode(all);
}

export function validatePayload(p) {
  const keys = ['version','dayMaster','timeUnknown','pillars','elementCounts','yinYang','relations','voidBranches','luck','selectedStars','limitations'];
  if (!p || typeof p !== 'object' || Array.isArray(p) || Object.keys(p).some(k => !keys.includes(k))) return false;
  if (p.version !== 1 || typeof p.timeUnknown !== 'boolean' || !Array.isArray(p.pillars) || p.pillars.length !== (p.timeUnknown ? 3 : 4)) return false;
  const positions = p.pillars.map(c => c?.position);
  if (new Set(positions).size !== positions.length || !['year','month','day'].every(k => positions.includes(k)) || positions.some(k => !['year','month','day','hour'].includes(k))) return false;
  if (p.timeUnknown && (positions.includes('hour') || p.luck !== null)) return false;
  const stems = '甲乙丙丁戊己庚辛壬癸', branches = '子丑寅卯辰巳午未申酉戌亥';
  if (p.pillars.some(c => typeof c.hanja !== 'string' || c.hanja.length !== 2 || !stems.includes(c.hanja[0]) || !branches.includes(c.hanja[1]) || stems.indexOf(c.hanja[0]) % 2 !== branches.indexOf(c.hanja[1]) % 2)) return false;
  if (p.dayMaster?.hanja !== p.pillars.find(c => c.position === 'day').hanja[0]) return false;
  // Bounded data only; no caller-controlled prompt, model, generation options, URL, or key.
  let nodes = 0;
  function safe(value, depth = 0) {
    if (++nodes > 1000 || depth > 8) return false;
    if (value === null || typeof value === 'boolean') return true;
    if (typeof value === 'number') return Number.isFinite(value) && Math.abs(value) <= 10000;
    if (typeof value === 'string') return value.length <= 300 && !/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(value);
    if (Array.isArray(value)) return value.length <= 40 && value.every(x => safe(x, depth + 1));
    if (typeof value === 'object') return Object.entries(value).every(([k,v]) => /^[A-Za-z가-힣]{1,30}$/.test(k) && !['constructor','prototype','__proto__'].includes(k) && safe(v, depth + 1));
    return false;
  }
  return safe(p);
}

export function normalizeReport(result) {
  if (result.promptFeedback?.blockReason || result.candidates?.[0]?.finishReason !== 'STOP') throw Error('incomplete');
  const text = (result.candidates[0].content?.parts || []).filter(p => !p.thought && typeof p.text === 'string').map(p => p.text).join('\n');
  if (!text || text.length > 40000) throw Error('format');
  const report = JSON.parse(text);
  if (!Array.isArray(report.sections) || report.sections.length !== 9) throw Error('format');
  return SECTION_IDS.map(id => {
    const found = report.sections.filter(s => s.id === id);
    if (found.length !== 1 || !Array.isArray(found[0].paragraphs) || found[0].paragraphs.length < 2 || found[0].paragraphs.length > 5 || found[0].paragraphs.some(p => typeof p !== 'string' || !p.trim() || p.length > 3000)) throw Error('format');
    return { id, paragraphs: found[0].paragraphs };
  });
}

export async function handleRequest(request, env, upstream = fetch, clientIdentity = null) {
  const origin = request.headers.get('Origin'), allowed = env.ALLOWED_ORIGIN;
  const cors = origin === allowed ? { 'Access-Control-Allow-Origin': allowed, 'Vary': 'Origin' } : {};
  const reply = (body, status = 200, headers = {}) => json(body, status, { ...cors, ...headers });
  const path = new URL(request.url).pathname;
  if (path !== '/api/saju' && path !== '/health') return reply({ error: 'not_found' }, 404);
  const configured = Boolean(env.GEMINI_API_KEY?.trim() && env.SAJU_BUDGET && /^gemini-[a-zA-Z0-9.-]{1,90}$/.test(env.GEMINI_MODEL || '') && allowed === 'https://patrickdfg.github.io');
  if (path === '/health' && request.method === 'GET') return reply({ ready: configured, limits: { daily: LIMITS.daily, perIP: LIMITS.perIP } }, configured ? 200 : 503);
  if (!allowed || origin !== allowed) return reply({ error: 'origin' }, 403);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...cors, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '600' } });
  if (path !== '/api/saju' || request.method !== 'POST') return reply({ error: 'method' }, 405);
  if (!configured) return reply({ error: 'not_configured' }, 503);
  if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get('Content-Type') || '')) return reply({ error: 'content_type' }, 400);
  let input, bodyText;
  try { bodyText = await boundedText(request.body, MAX_FACE_BODY); }
  catch (e) { return reply({ error: 'invalid_body' }, e.message === 'large' ? 413 : 400); }
  // Only photo requests may exceed the small chart limit.
  try { input = JSON.parse(bodyText); }
  catch { return reply({ error: 'invalid_body' }, bodyText.length > MAX_BODY ? 413 : 400); }
  const isFace = Boolean(input) && typeof input === 'object' && !Array.isArray(input) && Object.keys(input).length === 1 && Object.hasOwn(input, 'face');
  if (!isFace && bodyText.length > MAX_BODY) return reply({ error: 'invalid_body' }, 413);
  if (isFace ? !validateFacePayload(input.face) : (!input || Object.keys(input).length !== 1 || !validatePayload(input.payload))) return reply({ error: isFace ? 'invalid_image' : 'invalid_chart' }, 400);
  // The Supabase adapter supplies the browser identifier; never trust a body field.
  const ip = clientIdentity;
  if (!ip) return reply({ error: 'client_unknown' }, 503);
  try {
    const hmac = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.GEMINI_API_KEY), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const signed = await crypto.subtle.sign('HMAC', hmac, new TextEncoder().encode(koreanDay() + ':' + ip));
    const client = Array.from(new Uint8Array(signed), b => b.toString(16).padStart(2, '0')).join('');
    const budget = env.SAJU_BUDGET.get(env.SAJU_BUDGET.idFromName('global-budget'));
    const reservation = await budget.fetch('https://budget.internal/reserve', { method: 'POST', body: JSON.stringify({ client }) });
    if (reservation.status === 429) return reply({ error: 'daily_limit' }, 429, { 'Retry-After': '60' });
    if (!reservation.ok) return reply({ error: 'budget_unavailable' }, 503);
  } catch { return reply({ error: 'budget_unavailable' }, 503); }
  const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 80000);
  try {
    const response = await upstream('https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(env.GEMINI_MODEL) + ':generateContent', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY }, signal: controller.signal,
      body: JSON.stringify(isFace
        ? { systemInstruction: { parts: [{ text: FACE_INSTRUCTION }] }, contents: [{ role: 'user', parts: [{ inlineData: { mimeType: 'image/jpeg', data: input.face.image.data } }, { text: '위 사진을 지침에 따라 풀이해 주세요.' }] }], generationConfig: { maxOutputTokens: 16384, responseMimeType: 'application/json', responseSchema: geminiFaceSchema() } }
        : { systemInstruction: { parts: [{ text: GEMINI_SAJU_INSTRUCTION }] }, contents: [{ role: 'user', parts: [{ text: JSON.stringify(input.payload) }] }], generationConfig: { maxOutputTokens: 12288, responseMimeType: 'application/json', responseSchema: geminiReportSchema() } })
    });
    if (!response.ok) { await response.body?.cancel(); return reply({ error: 'upstream_unavailable', status: response.status }, 502); }
    const result = JSON.parse(await boundedText(response.body, 256000));
    if (isFace) return reply({ face: normalizeFaceReport(result), model: env.GEMINI_MODEL });
    return reply({ sections: normalizeReport(result), model: env.GEMINI_MODEL });
  } catch (e) { return reply({ error: 'generation_failed', reason: ['incomplete', 'format'].includes(e?.message) ? e.message : 'error' }, 502); }
  finally { clearTimeout(timeout); }
}
