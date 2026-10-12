import { handleRequest } from './worker.mjs';

// The Supabase gateway verifies the project's JWT (verify_jwt=true).
// The frontend anon JWT is a public project credential, not a visitor identity.
export function createSupabaseHandler(readEnv, fetcher = fetch) {
  return async request => {
    const origin = request.headers.get('Origin');
    const cors = origin === 'https://patrickdfg.github.io' ? {
      'Access-Control-Allow-Origin': origin, 'Vary': 'Origin',
      'Access-Control-Allow-Headers': 'authorization,apikey,content-type,x-saju-client',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
    } : {};
    const reply = (body, status) => Response.json(body, { status, headers: { ...cors, 'Cache-Control': 'no-store' } });
    if (origin && origin !== 'https://patrickdfg.github.io') return reply({ error: 'origin' }, 403);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    const path = new URL(request.url).pathname;
    if (!/\/saju-ai(?:\/health)?$/.test(path)) return reply({ error: 'not_found' }, 404);
    const health = path.endsWith('/health');
    if (health && request.method !== 'GET') return reply({ error: 'method' }, 405);
    const client = request.headers.get('X-Saju-Client') || '';
    if (!health && !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(client)) return reply({ error: 'client' }, 400);
    const url = readEnv('SUPABASE_URL'), service = readEnv('SUPABASE_SERVICE_ROLE_KEY');
    const budget = url && service ? {
      idFromName: name => name,
      get: () => ({ fetch: async (_url, options) => {
        const { client: hashedClient } = JSON.parse(options.body);
        const result = await fetcher(url + '/rest/v1/rpc/saju_reserve_generation', {
          method: 'POST', headers: { apikey: service, Authorization: 'Bearer ' + service, 'Content-Type': 'application/json' },
          body: JSON.stringify({ p_client: hashedClient }), signal: AbortSignal.timeout(10000)
        });
        if (!result.ok) { await result.body?.cancel(); return new Response(null, { status: 503 }); }
        const allowed = await result.json();
        if (allowed === true) return new Response(null, { status: 200 });
        return new Response(null, { status: allowed === false ? 429 : 503 });
      } })
    } : null;
    const env = { GEMINI_API_KEY: readEnv('SAJU_GEMINI_API_KEY'), GEMINI_MODEL: readEnv('SAJU_GEMINI_MODEL') || 'gemini-3.5-flash-lite', ALLOWED_ORIGIN: 'https://patrickdfg.github.io', SAJU_BUDGET: budget };
    const proxy = new Request('https://saju.internal/' + (health ? 'health' : 'api/saju'), {
      method: request.method, headers: request.headers,
      ...(!['GET','HEAD'].includes(request.method) ? { body: request.body, duplex: 'half' } : {})
    });
    try {
      const response = await handleRequest(proxy, env, fetcher, health ? null : client);
      const headers = new Headers(response.headers);
      for (const [key, value] of Object.entries(cors)) headers.set(key, value);
      return new Response(response.body, { status: response.status, headers });
    } catch { return reply({ error: 'service_unavailable' }, 503); }
  };
}
