# MovieStream

MovieStream is a React, TypeScript, and Vite movie discovery app backed by the TMDB API. The browser requests the app's `/api/movies` endpoint; a server-side proxy adds the TMDB API key and requests TMDB. The credential is kept out of browser code.

## Features

- Discover popular movies
- Search movies with a short debounce
- View movie details
- Save a watchlist in browser local storage

## Environment setup

Create a `.env` file in this project directory for local development:

```dotenv
TMDB_API_KEY=your_tmdb_api_key
```

Use the TMDB v3 API key. Do not prefix this variable with `VITE_`: Vite exposes `VITE_` variables to browser code. The Vite development proxy reads `TMDB_API_KEY` on the server, and the Vercel function reads the same variable from the Vercel project's server-side environment variables. Configure it for each Vercel environment you use (Preview and Production as needed).

## Run locally

```bash
npm install
npm run dev
```

The local Vite proxy and the Vercel function support these requests:

- `/api/movies?type=popular` for popular movies
- `/api/movies?search=movie%20name&page=1` for movie search
- `/api/movies?id=123` for movie details

## Build

```bash
npm run build
```

Vercel's project Root Directory should be `my-ts-app` when deploying from the repository root, so the `api` function directory is at the project root. Configure the `TMDB_API_KEY` environment variable in Vercel; never put the credential in frontend code or a `VITE_` variable.