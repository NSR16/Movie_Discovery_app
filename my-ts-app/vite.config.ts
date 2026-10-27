import { defineConfig, loadEnv, type ProxyOptions } from 'vite';
import react from '@vitejs/plugin-react';

const SAFE_EXCEPTION_NAMES = new Set([
  'Error',
  'TypeError',
  'SyntaxError',
  'RangeError',
  'AbortError',
  'TimeoutError',
  'FetchError',
]);

const SAFE_SYSTEM_CODES = new Set([
  'EAI_AGAIN',
  'ECONNABORTED',
  'ECONNREFUSED',
  'ECONNRESET',
  'EHOSTUNREACH',
  'ENETUNREACH',
  'ENOTFOUND',
  'ETIMEDOUT',
  'EPIPE',
  'UND_ERR_BODY_TIMEOUT',
  'UND_ERR_CONNECT_TIMEOUT',
  'UND_ERR_HEADERS_TIMEOUT',
  'UND_ERR_SOCKET',
]);

const getSafeExceptionName = (error: unknown) =>
  error instanceof Error && SAFE_EXCEPTION_NAMES.has(error.name) ? error.name : 'UnknownError';

const getSafeSystemCode = (error: unknown) => {
  let candidate: unknown = error;

  for (let depth = 0; depth < 3 && candidate && typeof candidate === 'object'; depth += 1) {
    const details = candidate as { code?: unknown; cause?: unknown };
    if (typeof details.code === 'string' && SAFE_SYSTEM_CODES.has(details.code)) {
      return details.code;
    }
    candidate = details.cause;
  }

  return undefined;
};

const logProxyFailure = (stage: 'fetch' | 'response_body' | 'request_setup', error: unknown, httpStatus?: number) => {
  console.error('TMDB proxy failure', {
    stage,
    exceptionName: getSafeExceptionName(error),
    ...(getSafeSystemCode(error) ? { systemCode: getSafeSystemCode(error) } : {}),
    ...(httpStatus === undefined ? {} : { httpStatus }),
  });
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.TMDB_API_KEY;

  const proxyRequest: NonNullable<ProxyOptions['bypass']> = async (req, res) => {
    if (!res) return;

    const fail = (status: number, message: string) => {
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: message }));
      return req.url || '/';
    };

    if (req.method !== 'GET') return fail(405, 'Method not allowed.');
    if (!apiKey) return fail(500, 'TMDB_API_KEY is not configured on the server.');

    try {
      const incomingUrl = new URL(req.url || '', 'http://localhost');
      const params = incomingUrl.searchParams;
      const ids = params.getAll('id');
      const types = params.getAll('type');
      const searches = params.getAll('search');
      const allowedKeys = new Set(['id', 'type', 'search', 'page']);

      if ([...params.keys()].some((key) => !allowedKeys.has(key))) {
        return fail(400, 'Unsupported query parameter.');
      }

      const hasId = ids.length > 0;
      const hasType = types.length > 0;
      const hasSearch = searches.length > 0;
      if (Number(hasId) + Number(hasType) + Number(hasSearch) !== 1) {
        return fail(400, 'Provide exactly one of id, type=popular, or search.');
      }

      let tmdbPath: string;
      const tmdbParams = new URLSearchParams();
      if (hasId) {
        if (ids.length !== 1 || !/^\d+$/.test(ids[0]) || Number(ids[0]) < 1 || params.has('page')) {
          return fail(400, 'Invalid movie id request.');
        }
        tmdbPath = `/movie/${ids[0]}`;
      } else if (hasType) {
        if (types.length !== 1 || types[0] !== 'popular' || params.has('search')) {
          return fail(400, 'Invalid movie type request.');
        }
        tmdbPath = '/movie/popular';
        const page = params.get('page');
        if (page !== null) {
          if (!/^[1-9]\d*$/.test(page)) return fail(400, 'Invalid page number.');
          tmdbParams.set('page', page);
        }
      } else {
        if (searches.length !== 1 || !searches[0].trim()) {
          return fail(400, 'A non-empty search query is required.');
        }
        tmdbPath = '/search/movie';
        tmdbParams.set('query', searches[0]);
        const page = params.get('page');
        if (page !== null) {
          if (!/^[1-9]\d*$/.test(page)) return fail(400, 'Invalid page number.');
          tmdbParams.set('page', page);
        }
      }

      tmdbParams.set('api_key', apiKey);
      let tmdbResponse: Response;
      try {
        tmdbResponse = await fetch(`https://api.themoviedb.org/3${tmdbPath}?${tmdbParams}`);
      } catch (error) {
        logProxyFailure('fetch', error);
        return fail(502, 'Unable to reach TMDB.');
      }

      console.info('TMDB proxy upstream response', {
        stage: 'upstream_response',
        httpStatus: tmdbResponse.status,
      });

      if (!tmdbResponse.ok) {
        return fail(tmdbResponse.status, `TMDB responded with status ${tmdbResponse.status}.`);
      }

      let body: string;
      try {
        body = await tmdbResponse.text();
      } catch (error) {
        logProxyFailure('response_body', error, tmdbResponse.status);
        return fail(502, 'Unable to reach TMDB.');
      }

      res.writeHead(tmdbResponse.status, {
        'Content-Type': tmdbResponse.headers.get('content-type') || 'application/json',
      });
      res.end(body);
      return req.url || '/';
    } catch (error) {
      logProxyFailure('request_setup', error);
      return fail(502, 'Unable to reach TMDB.');
    }
  };

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/movies': {
          target: 'https://api.themoviedb.org/3',
          changeOrigin: true,
          bypass: proxyRequest,
        }
      }
    }
  };
});
