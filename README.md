# 🎬 MovieStream

A modern, responsive movie discovery application built with **React**, **TypeScript**, and the **TMDB API**. This project demonstrates intermediate frontend concepts like custom hooks, debounced search, and persistent local storage.

## 🚀 Features
* **Live Search:** Real-time movie searching with debouncing to optimize API calls.
* **Watchlist:** Save your favorite movies to your browser's local storage.
* **Dynamic Routing:** Seamless navigation between Home, Search, and Detail pages.
* **Responsive Design:** A cinematic "Dark Mode" UI that works on mobile and desktop.
* **TypeScript:** Strictly typed components and API responses for better developer experience.

## 🛠️ Tech Stack
* **Framework:** React 18 (Vite)
* **Language:** TypeScript
* **Routing:** React Router DOM
* **API:** The Movie Database (TMDB)
* **Styling:** CSS3 (Modular CSS)

## 📦 Installation & Setup
1. **Clone the repository:**
   ```bash
   git clone [YOUR_REPO_URL]
   cd my-ts-app

 2.**Install dependencies:**
 
   npm install

3.**Set up Environment Variables:**

Create a .env file in the root directory and add your TMDB Access Token:

Code snippet

VITE_TMDB_ACCESS_TOKEN=your_token_here

4.**Run the development server:**

Bash

npm run dev

**What I Learned**

Custom Hooks: Created useMovies, useMovieDetails, and useWatchlist to separate business logic from UI.

Parallel Fetching: Used Promise.all to fetch multiple movie details simultaneously for the Watchlist page.

Global State with LocalStorage: Managed a persistent user watchlist across browser sessions.


# Deployment Link

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://movie-discovery-app-two.vercel.app/)

