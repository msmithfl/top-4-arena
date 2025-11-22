import type { Movie, BossCard, PrebuiltBoss } from '../types';
import { enhanceMovie } from './enhanceMovie'
import { createBossAbility } from './bossAbilities';


// Create boss with OP stats
export const createBossCard = (movie: Movie): BossCard => {
  const baseCard = enhanceMovie(movie);
  const ability = createBossAbility(movie.genres);
  
  return {
    ...baseCard,
    maxHP: baseCard.basePower,
    baseDamage: baseCard.basePower * 3,
    defenseIgnore: ability.name.includes('PRECISION') ? 0.75 : 0.5, // Ignores 50-75% defense
    ability
  };
};

export async function createPrebuiltBossCard(rawBoss: PrebuiltBoss, fetchMovieDetails: (id: number) => Promise<Movie>): Promise<BossCard> {
  // Fetch movie data from TMDB
  const movieData = await fetchMovieDetails(rawBoss.tmdbId);
  
  // Use custom poster if provided, otherwise use TMDB poster
  const posterPath = rawBoss.poster_url || movieData.poster_path;
  
  // Enhance movie with stats
  const enhancedMovie = enhanceMovie({
    ...movieData,
    poster_path: posterPath
  });
  
  // Calculate boss stats from enhanced movie (like before)
  const maxHP = enhancedMovie.basePower * 25;
  const baseDamage = enhancedMovie.basePower * 2;
  const defenseIgnore = rawBoss.ability.name.includes('PRECISION') ? 0.75 : 0.5;
  
  return {
    ...enhancedMovie,
    maxHP,
    baseDamage,
    defenseIgnore,
    ability: {
      ...rawBoss.ability,
      effect: (turn: number, baseDamage: number) => {
        const result = rawBoss.ability.effect(turn, baseDamage);
        return {
          damage: result.damage,
          heal: result.heal ?? 0,
          message: result.message ?? '',
        };
      }
    }
  };
}