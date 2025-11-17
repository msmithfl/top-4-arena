import type { Movie, MovieCard } from '../types';
import {
  calculateStarPowerTier,
  calculateRevenueTier,
  calculateEraTier,
  getDecade
} from './statHelpers';

export const enhanceMovie = (movie: Movie): MovieCard => {
  return {
    ...movie,
    basePower: Math.round(movie.vote_average * 50),
    starPowerTier: calculateStarPowerTier(movie.vote_count, movie.revenue, movie.popularity),
    revenueTier: calculateRevenueTier(movie.revenue),
    eraTier: calculateEraTier(movie.release_date),
    decade: getDecade(movie.release_date)
  };
};