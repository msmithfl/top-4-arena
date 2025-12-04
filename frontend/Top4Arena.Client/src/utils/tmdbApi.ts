import type { Movie } from '../types';

const TMDB_API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmODZmYTE3MzcwNzRmMzY3NzkwNzc1Y2Q1NTQwNmExYyIsIm5iZiI6MTY4NzYyNzAzOC40MDEsInN1YiI6IjY0OTcyNTFlYjM0NDA5MDBhZDUyNTY4YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.YA8K57yrPNiM_UwefPB6Bv2t8fZdY_v1GD9AS3rRrU0';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// TMDB API Functions

// 1 API call
export const fetchMovieDetails = async (movieId: number): Promise<Movie> => {
  console.log(`[TMDB] Fetching details for movie ID: ${movieId}`);
  const response = await fetch(`${TMDB_BASE_URL}/movie/${movieId}`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${TMDB_API_TOKEN}`
    }
  });
  
  if (!response.ok) {
    console.error(`[TMDB] Movie details fetch failed for ${movieId}:`, response.status, response.statusText);
    throw new Error(`Failed to fetch movie ${movieId}`);
  }
  
  const data = await response.json();
  console.log(`[TMDB] Movie details response for ${movieId}:`, data);
  return {
    id: data.id,
    title: data.title,
    poster_path: data.poster_path,
    vote_average: data.vote_average,
    vote_count: data.vote_count,
    revenue: data.revenue || 0,
    runtime: data.runtime,
    release_date: data.release_date,
    popularity: data.popularity,
    genres: data.genres,
    overview: data.overview
  };
};

// 1 API call
export const fetchPopularMovies = async (page: number = 1): Promise<any[]> => {
  const params = new URLSearchParams({
    include_adult: 'false',
    include_video: 'false',
    language: 'en-US',
    page: page.toString(),
    sort_by: 'vote_count.desc',
    'vote_count.gte': '200',
    'vote_average.gte': '1.0',
    'vote_average.lte': '8.5'
  });

  console.log('[TMDB] Fetching movie list...');
  const response = await fetch(`${TMDB_BASE_URL}/discover/movie?${params}`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${TMDB_API_TOKEN}`
    }
  });

  if (!response.ok) {
    console.error('[TMDB] Movie list fetch failed:', response.status, response.statusText);
    throw new Error('Failed to fetch movies');
  }

  const data = await response.json();
  console.log('[TMDB] Movie list response:', data);
  return data.results; // Only return the list, no detail fetches!
};

// 2 API calls
export const fetchPopularBoss = async (): Promise<Movie> => {
  // Fetch from top 3 pages of most popular movies for boss
  const randomPage = Math.floor(Math.random() * 3) + 1;
  const params = new URLSearchParams({
    include_adult: 'false',
    include_video: 'false',
    language: 'en-US',
    page: randomPage.toString(),
    sort_by: 'popularity.desc',
    'vote_count.gte': '1000',  // High vote count for well-known movies
    'vote_average.gte': '7.0'  // High ratings only
  });

  console.log('[TMDB] Fetching boss movie list...');
  const response = await fetch(`${TMDB_BASE_URL}/discover/movie?${params}`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${TMDB_API_TOKEN}`
    }
  });

  if (!response.ok) {
    console.error('[TMDB] Boss movie list fetch failed:', response.status, response.statusText);
    throw new Error('Failed to fetch boss movie');
  }

  const data = await response.json();
  console.log('[TMDB] Boss movie list response:', data);

  // Pick a random movie from the results
  const randomIndex = Math.floor(Math.random() * Math.min(10, data.results.length));
  const bossMovie = data.results[randomIndex];

  const bossDetails = await fetchMovieDetails(bossMovie.id);
  console.log('[TMDB] Boss movie details response:', bossDetails);
  return bossDetails;
};