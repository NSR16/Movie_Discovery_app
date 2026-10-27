import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const tmdbApiKey = process.env.TMDB_API_KEY;

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  if (!tmdbApiKey) {
    return res.status(500).json({ error: 'TMDB_API_KEY is not configured on the server.' });
  }

  const { id, type, search, page } = req.query;
  const allowedKeys = new Set(['id', 'type', 'search', 'page']);
  if (Object.keys(req.query).some((key) => !allowedKeys.has(key))) {
    return res.status(400).json({ error: 'Unsupported query parameter.' });
  }

  const hasId = id !== undefined;
  const hasType = type !== undefined;
  const hasSearch = search !== undefined;
  if (Number(hasId) + Number(hasType) + Number(hasSearch) !== 1) {
    return res.status(400).json({ error: 'Provide exactly one of id, type=popular, or search.' });
  }

  let tmdbPath: string;
  const tmdbParams = new URLSearchParams();
  if (hasId) {
    if (Array.isArray(id) || !/^\d+$/.test(String(id)) || Number(id) < 1 || page !== undefined) {
      return res.status(400).json({ error: 'Invalid movie id request.' });
    }
    tmdbPath = `/movie/${id}`;
  } else if (hasType) {
    if (Array.isArray(type) || type !== 'popular') {
      return res.status(400).json({ error: 'Invalid movie type request.' });
    }
    tmdbPath = '/movie/popular';
  } else {
    if (Array.isArray(search) || !String(search).trim()) {
      return res.status(400).json({ error: 'A non-empty search query is required.' });
    }
    tmdbPath = '/search/movie';
    tmdbParams.set('query', String(search));
  }

  if (page !== undefined) {
    if (hasId || Array.isArray(page) || !/^[1-9]\d*$/.test(String(page))) {
      return res.status(400).json({ error: 'Invalid page number.' });
    }
    tmdbParams.set('page', String(page));
  }

  try {
    tmdbParams.set('api_key', tmdbApiKey);
    const response = await fetch(`https://api.themoviedb.org/3${tmdbPath}?${tmdbParams}`);
    
    if (!response.ok) {
      return res.status(response.status).json({ error: `TMDB responded with status ${response.status}.` });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch {
    return res.status(502).json({ error: 'Unable to reach TMDB.' });
  }
}
