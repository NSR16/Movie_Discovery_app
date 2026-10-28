# 🎬 MovieStream

A modern, responsive movie discovery application built with **React, TypeScript, and the TMDB API**. MovieStream features debounced search, dynamic routing, a persistent watchlist, and a server-side API proxy to keep TMDB credentials out of the frontend.

## 🚀 Features

- **Popular Movies:** Discover popular movies using data from TMDB.
- **Live Search:** Search for movies with debouncing to reduce unnecessary API requests.
- **Movie Details:** View individual movie details through dynamic routes.
- **Watchlist:** Save movies to your browser's `localStorage`. Your watchlist persists across page reloads and browser sessions.
- **Dynamic Routing:** Navigate between the home page, movie details, and watchlist.
- **Server-Side API Proxy:** Uses a Vercel serverless function to communicate with TMDB without exposing the TMDB API key in client-side code.
- **Responsive Design:** A cinematic dark-mode interface designed for mobile and desktop.
- **TypeScript:** Type-safe components and API interactions.

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Routing:** React Router DOM
- **API:** The Movie Database (TMDB)
- **Backend / API Proxy:** Vercel Serverless Functions
- **Styling:** CSS3
- **Persistence:** Browser `localStorage`
- **Deployment:** Vercel

## 📁 Project Structure

```text
my-ts-app/
├── api/
│   └── movies.ts        # Serverless TMDB proxy
├── src/
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Movie fetching and watchlist hooks
│   ├── pages/           # Application pages
│   └── ...              # App, styles, and supporting files
├── .env.example         # Example environment configuration, if present
├── vite.config.ts       # Local development API proxy
├── vercel.json          # Vercel configuration
└── package.json
```

## 📦 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/NSR16/Movie_Discovery_app.git
cd Movie_Discovery_app/my-ts-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `my-ts-app` directory and add your TMDB API key:

```env
TMDB_API_KEY=your_tmdb_api_key_here
```

Obtain your API credentials from [TMDB](https://www.themoviedb.org/).

**Important:** Keep `TMDB_API_KEY` private. Do not commit your `.env` file or expose this key through a `VITE_`-prefixed frontend environment variable.

### 4. Start the development server

```bash
npm run dev
```

Vite starts the frontend development server. The local development proxy configured in `vite.config.ts` forwards `/api/movies` requests to TMDB using the server-side API key.

## 🔌 API Proxy

The application uses the `/api/movies` endpoint instead of making TMDB requests directly from the browser.

The Vercel serverless function in `api/movies.ts` supports these request types:

| Request | Purpose |
|---|---|
| `/api/movies?type=popular` | Fetch popular movies |
| `/api/movies?search=batman&page=1` | Search for movies |
| `/api/movies?id=550` | Fetch details for a movie |

The function validates the request parameters, uses `TMDB_API_KEY` on the server, and returns the TMDB response to the frontend.

In local development, `vite.config.ts` provides the corresponding proxy behavior.

## 🚀 Deployment

MovieStream is deployed on Vercel:

**[Live Demo](https://movie-discovery-app-two.vercel.app/)**

To deploy your own instance:

1. Import the GitHub repository into Vercel.
2. Set the project root directory to `my-ts-app`.
3. Add `TMDB_API_KEY` under the appropriate Vercel environment variables for **Production** and **Preview**.
4. Deploy the project.

Vercel automatically creates deployments when changes are pushed to the connected GitHub repository. The `main` branch is used for production, while the `proxy` branch can be used for preview deployments.

## 💡 What I Learned

- **Custom Hooks:** Separated movie fetching, search, details, and watchlist logic from UI components.
- **Debounced Search:** Reduced unnecessary API requests while users type.
- **Parallel Fetching:** Used `Promise.all` to fetch multiple movie details for the watchlist.
- **Persistent State:** Used `localStorage` to preserve the watchlist across browser sessions.
- **Dynamic Routing:** Implemented movie-specific routes and fixed navigation from the watchlist to movie details.
- **Serverless Architecture:** Built a server-side TMDB proxy to keep API credentials out of the frontend.
- **Deployment Workflow:** Used GitHub branches and Vercel Preview and Production deployments to test changes before releasing them.

---

Made with React, TypeScript, and TMDB.
