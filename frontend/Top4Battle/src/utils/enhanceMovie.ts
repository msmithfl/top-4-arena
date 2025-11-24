import type { Movie, MovieCard } from '../types';
import {
  calculateStarPowerTier,
  calculateRevenueTier,
  calculateEraTier,
  getDecade
} from './statHelpers';

// Adjust inflated TMDB ratings to a more drastic scale
// Maps typical inflated 5.0-8.5 range to a realistic 3.0-9.5 range
export const adjustRating = (rating: number): number => {
  // Simple linear mapping from inflated range to desired range
  // 5.0 -> 2.5, 6.5 -> 6.0, 8.0 -> 8.5, 8.5 -> 9.2
  const minInput = 5.0;   // Lowest rating you expect from TMDB
  const maxInput = 8.5;   // Highest rating you expect from TMDB
  const minOutput = 2.5;  // What you want minInput to become
  const maxOutput = 9.5;  // What you want maxInput to become
  
  // Clamp input to expected range
  const clampedRating = Math.max(minInput, Math.min(maxInput, rating));
  
  // Linear interpolation
  const normalized = (clampedRating - minInput) / (maxInput - minInput);
  const newRating = minOutput + (normalized * (maxOutput - minOutput));
  
  // Round to 1 decimal place
  return Math.round(newRating * 10) / 10;
};

export const enhanceMovie = (movie: Movie): MovieCard => {
  const adjustedRating = adjustRating(movie.vote_average);
  
  return {
    ...movie,
    basePower: Math.round(adjustedRating * 100),
    starPowerTier: calculateStarPowerTier(movie.vote_count, movie.revenue, movie.popularity),
    revenueTier: calculateRevenueTier(movie.revenue),
    eraTier: calculateEraTier(movie.release_date),
    decade: getDecade(movie.release_date)
  };
};