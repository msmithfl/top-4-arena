import type { Movie, BossCard, PrebuiltBoss } from '../types';
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

export function createPrebuiltBossCard(rawBoss: PrebuiltBoss): BossCard {
  return {
    ...rawBoss,
    id: -1,
    poster_path: rawBoss.poster_url,
    vote_average: 0,
    vote_count: 0,
    revenue: 0,
    runtime: 0,
    release_date: '',
    popularity: 0,
    starPowerTier: '',
    revenueTier: '',
    eraTier: '',
    decade: '',
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