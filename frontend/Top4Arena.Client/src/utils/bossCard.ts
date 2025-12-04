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

export async function createPrebuiltBossCard(rawBoss: PrebuiltBoss, fetchMovieDetails: (id: number) => Promise<Movie>, round: number = 1): Promise<BossCard> {
  // Fetch movie data from TMDB
  const movieData = await fetchMovieDetails(rawBoss.tmdbId);
  
  // Use custom poster if provided, otherwise use TMDB poster
  const posterPath = rawBoss.poster_url || movieData.poster_path;
  
  // Enhance movie with stats
  const enhancedMovie = enhanceMovie({
    ...movieData,
    poster_path: posterPath
  });
  
  // Scale HP: +2000 per round (10000 base + 2000 * (round - 1))
  const maxHP = 10000 + (round - 1) * 2000;
  
  // Scale damage: +100 per round (1000 base + 100 * (round - 1))
  const baseDamage = 1200 + (round - 1) * 100;
  
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