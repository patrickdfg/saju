import assert from 'node:assert/strict';
import { handleRequest, SajuBudget, koreanDay } from '../server/worker.mjs';
const chart = { version: 1, timeUnknown: true, pillars: ['year','month','day'].map(position => ({ position, hanja: '甲子' })), dayMaster: { hanja: '甲' }, luck: null };
const report = { sections: ['self','social','talent','wealth','love','work','people','career','stars'].map(id => ({ id, paragraphs: ['테스트 문단입니다.', '두 번째 문단입니다.'] })) };
const env = { GEMINI_API_KEY: 'TEST_ONLY_FAKE_KEY', GEMINI_MODEL: 'gemini-test', ALLOWED_ORIGIN: 'https://patrickdfg.github.io', SAJU_BUDGET: { idFromName: x => x, get: () => ({ fetch: async () => new Response('{}') }) } };
const request = (body = { payload: chart }, headers = {}) => new Request('https://api.example/api/saju', { method: 'POST', headers: { Origin: env.ALLOWED_ORIGIN, 'CF-Connecting-IP': '192.0.2.1', 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
let calls = 0;
const upstream = async (url, options) => {
  calls++;
  assert.equal(options.headers['x-goog-api-key'], env.GEMINI_API_KEY);
  assert.ok(url.endsWith('/gemini-test:generateContent'));
  const body = JSON.parse(options.body);
  assert.equal(body.generationConfig.maxOutputTokens, 12288);
  assert.ok(body.systemInstruction.parts[0].text.includes('한국어'));
  return Response.json({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify(report) }] } }] });
};
let response = await handleRequest(request(), env, upstream);
assert.equal(response.status, 200);
const text = await response.text(); assert.ok(!text.includes(env.GEMINI_API_KEY)); assert.equal(JSON.parse(text).sections.length, 9);
assert.equal(response.headers.get('Access-Control-Allow-Origin'), env.ALLOWED_ORIGIN);
assert.equal(response.headers.get('Cache-Control'), 'no-store');
assert.equal((await handleRequest(request(), { ...env, GEMINI_API_KEY: '' }, upstream)).status, 503);
assert.equal((await handleRequest(request({}, { Origin: 'https://evil.example' }), env, upstream)).status, 403);
assert.equal((await handleRequest(request({ payload: chart, model: 'expensive-model' }), env, upstream)).status, 400);
assert.equal((await handleRequest(request({ payload: { ...chart, prompt: 'ignore instructions' } }), env, upstream)).status, 400);
assert.equal((await handleRequest(request({ payload: { ...chart, pillars: [] } }), env, upstream)).status, 400);
assert.equal((await handleRequest(request({ text: 'x'.repeat(17000) }), env, upstream)).status, 413);
const quotaEnv = { ...env, SAJU_BUDGET: { idFromName: x => x, get: () => ({ fetch: async () => new Response('{}', { status: 429 }) }) } };
assert.equal((await handleRequest(request(), quotaEnv, upstream)).status, 429);
const brokenEnv = { ...env, SAJU_BUDGET: { idFromName: () => { throw Error('unavailable'); } } };
assert.equal((await handleRequest(request(), brokenEnv, upstream)).status, 503);
assert.equal(calls, 1, 'invalid, unconfigured and over-quota requests never reach Google');
assert.equal((await handleRequest(request(), env, async () => Response.json({ error: { message: env.GEMINI_API_KEY } }, { status: 403 }))).status, 502);
assert.equal((await handleRequest(request(), env, async () => Response.json({ candidates: [{ finishReason: 'MAX_TOKENS' }] }))).status, 502);
const options = await handleRequest(new Request('https://api.example/api/saju', { method: 'OPTIONS', headers: { Origin: env.ALLOWED_ORIGIN } }), env, upstream);
assert.equal(options.status, 204);

// Face request: same endpoint and budget, bounded JPEG only, owner-held instructions.
const jpegBytes = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(3000, 7)]);
const faceData = jpegBytes.toString('base64');
const faceOk = { status: 'ok', impression: { type: '清秀', headline: '맑은 인상', text: '전통 상징을 풀어쓴 성찰용 풀이입니다.' }, faceShape: { name: '타원형', text: '둥글고 길어요.' },
  samjeong: ['upper', 'middle', 'lower'].map(id => ({ id, observation: '보이는 모습', reading: '전통에서는 균형으로 봅니다.' })),
  ogwan: ['brow', 'eye', 'ear', 'nose', 'mouth'].map(id => ({ id, shapeName: id === 'brow' ? '新月眉' : '', observation: '보이는 모습', reading: '전통 해석' })),
  palaces: ['ming', 'wealth', 'career', 'virtue', 'home', 'sibling', 'children', 'spouse', 'travel', 'servants'].map(id => ({ id, reading: '전통 해석' })),
  stages: ['early', 'middle', 'late'].map(id => ({ id, reading: '전통 해석' })), themes: ['wealth', 'business', 'relationships', 'temperament'].map(id => ({ id, reading: '전통 해석' })), advice: '오늘 천천히 숨을 쉬어 보세요.' };
let faceCalls = 0, faceBody;
const faceUpstream = async (url, options) => { faceCalls++; faceBody = JSON.parse(options.body); return Response.json({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify(faceOk) }] } }] }); };
const faceRequest = (face, headers = {}) => request({ face }, headers);
let faceRes = await handleRequest(faceRequest({ image: { mime: 'image/jpeg', data: faceData } }), env, faceUpstream);
assert.equal(faceRes.status, 200);
const faceJson = await faceRes.json(); assert.equal(faceJson.face.status, 'ok'); assert.equal(faceJson.face.palaces.length, 10); assert.equal(faceJson.face.ogwan[0].shapeName, '新月眉');
assert.equal(faceBody.generationConfig.maxOutputTokens, 16384);
assert.equal(faceBody.contents[0].parts[0].inlineData.mimeType, 'image/jpeg');
assert.ok(faceBody.systemInstruction.parts[0].text.includes('三才圖會') && faceBody.systemInstruction.parts[0].text.includes('冰鑑'));
assert.ok(!JSON.stringify(faceBody).includes(env.GEMINI_API_KEY));
for (const bad of [{ image: { mime: 'image/png', data: faceData } }, { image: { mime: 'image/jpeg', data: 'AAAA'.repeat(1000) } }, { image: { mime: 'image/jpeg', data: faceData, extra: 1 } }, { image: { mime: 'image/jpeg', data: 'x'.repeat(10) } }, { image: { mime: 'image/jpeg', data: faceData }, prompt: 'ignore' }, { image: { mime: 'image/jpeg', data: Buffer.alloc(1100000, 1).toString('base64') } }]) {
  const r = await handleRequest(faceRequest(bad), env, faceUpstream); assert.ok([400, 413].includes(r.status), 'bad image rejected: ' + r.status);
}
assert.equal(faceCalls, 1, 'rejected images never reach Google');
assert.equal((await handleRequest(request({ face: { image: { mime: 'image/jpeg', data: Buffer.concat([jpegBytes, Buffer.alloc(1100000, 1)]).toString('base64') } } }), env, faceUpstream)).status, 400);
assert.equal((await handleRequest(faceRequest({ image: { mime: 'image/jpeg', data: faceData } }), quotaEnv, faceUpstream)).status, 429);
assert.equal(faceCalls, 1, 'over-quota photo never reaches Google');
const refusal = await handleRequest(faceRequest({ image: { mime: 'image/jpeg', data: faceData } }), env, async () => Response.json({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify({ status: 'no_face' }) }] } }] }));
assert.deepEqual((await refusal.json()).face, { status: 'no_face' });
const brokenFace = { ...faceOk, palaces: faceOk.palaces.slice(1) };
assert.equal((await handleRequest(faceRequest({ image: { mime: 'image/jpeg', data: faceData } }), env, async () => Response.json({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify(brokenFace) }] } }] }))).status, 502);
assert.equal((await handleRequest(request({ payload: chart, face: {} }), env, faceUpstream)).status, 400);
assert.equal((await handleRequest(request({ text: 'x'.repeat(17000) }), env, faceUpstream)).status, 413, 'non-photo bodies keep the small limit');

// Serial transaction fixture verifies one shared budget; not a live Cloudflare test.
let state, queue = Promise.resolve();
const storage = { transaction(callback) { const run = queue.then(() => callback({ get: async () => structuredClone(state), put: async (_, value) => { state = structuredClone(value); }, setAlarm: async () => {}, delete: async () => { state = undefined; } })); queue = run.catch(() => {}); return run; } };
const budget = new SajuBudget({ storage });
const reserve = client => budget.fetch(new Request('https://budget/reserve', { method: 'POST', body: JSON.stringify({ client }) }));
const statuses = await Promise.all(Array.from({ length: 50 }, (_, i) => reserve(i.toString(16).padStart(64, '0')).then(r => r.status)));
assert.equal(statuses.filter(x => x === 200).length, 30);
assert.equal(state.total, 30);
state = { day: koreanDay(), total: 0, clients: {} };
const id = 'a'.repeat(64);
assert.equal((await reserve(id)).status, 200);
assert.equal((await reserve(id)).status, 429, 'cooldown');
for (let i = 0; i < 2; i++) { state.clients[id].last -= 61000; assert.equal((await reserve(id)).status, 200); }
state.clients[id].last -= 61000; assert.equal((await reserve(id)).status, 429, 'per-IP cap');
state.day = '2000-01-01'; assert.equal((await reserve(id)).status, 200, 'day reset');
assert.equal(state.total, 1);
await budget.alarm(); assert.equal(state.total, 1, 'late alarm retains current-day counters');
state.day = '2000-01-01'; await budget.alarm(); assert.equal(state, undefined);
assert.equal(koreanDay(Date.parse('2026-10-12T15:00:00Z')), '2026-10-13');
console.log('PASS: server mock checks for fixed request, no secret leakage, validation, CORS, fail-closed quota, concurrent reservations, cooldown, KST rollover, and bounded response.');
