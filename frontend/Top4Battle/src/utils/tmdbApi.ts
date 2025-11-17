import type { Movie } from '../types';

const TMDB_API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmODZmYTE3MzcwNzRmMzY3NzkwNzc1Y2Q1NTQwNmExYyIsIm5iZiI6MTY4NzYyNzAzOC40MDEsInN1YiI6IjY0OTcyNTFlYjM0NDA5MDBhZDUyNTY4YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.YA8K57yrPNiM_UwefPB6Bv2t8fZdY_v1GD9AS3rRrU0';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// TMDB API Functions
export const fetchMovieDetails = async (movieId: number): Promise<Movie> => {
  const response = await fetch(`${TMDB_BASE_URL}/movie/${movieId}`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${TMDB_API_TOKEN}`
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch movie ${movieId}`);
  }
  
  const data = await response.json();
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
    genres: data.genres
  };
};

export const fetchPopularMovies = async (page: number = 1): Promise<Movie[]> => {
  const params = new URLSearchParams({
    include_adult: 'false',
    include_video: 'false',
    language: 'en-US',
    page: page.toString(),
    sort_by: 'vote_count.desc',  // Sort by vote count instead of popularity for more variety
    'vote_count.gte': '200',  // At least 200 votes so movies aren't too obscure
    'vote_average.gte': '1.0',  // Lower threshold to include more variety
    'vote_average.lte': '8.5'  // Cap at 8.5 to avoid only masterpieces
  });
  
  const response = await fetch(`${TMDB_BASE_URL}/discover/movie?${params}`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${TMDB_API_TOKEN}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch movies');
  }
  
  const data = await response.json();
  
  // Fetch detailed info for first 30 movies to get revenue, then shuffle and pick 20
  const movieIds = data.results.slice(0, 30).map((movie: any) => movie.id);
  const detailedMovies = await Promise.all(
    movieIds.map((id: number) => fetchMovieDetails(id))
  );
  
  // Shuffle array to randomize selection
  const shuffled = detailedMovies.sort(() => Math.random() - 0.5);
  
  return shuffled.slice(0, 20);
};

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
  
  const response = await fetch(`${TMDB_BASE_URL}/discover/movie?${params}`, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${TMDB_API_TOKEN}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch boss movie');
  }
  
  const data = await response.json();
  
  // Pick a random movie from the results
  const randomIndex = Math.floor(Math.random() * Math.min(10, data.results.length));
  const bossMovie = data.results[randomIndex];
  
  return await fetchMovieDetails(bossMovie.id);
};