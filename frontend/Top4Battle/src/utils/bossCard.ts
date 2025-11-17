import type { Movie, BossCard } from '../types';
import { enhanceMovie } from './enhanceMovie'
import { createBossAbility } from './bossAbilities';

// Create boss with OP stats
export const createBossCard = (movie: Movie): BossCard => {
  const baseCard = enhanceMovie(movie);
  const ability = createBossAbility(movie.genres);
  
  return {
    ...baseCard,
    maxHP: baseCard.basePower * 50,
    baseDamage: baseCard.basePower * 3,
    defenseIgnore: ability.name.includes('PRECISION') ? 0.75 : 0.5, // Ignores 50-75% defense
    ability
  };
};