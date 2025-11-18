import type { BossAbility } from '../types';

// Boss ability factory
export const createBossAbility = (genres: { id: number; name: string }[]): BossAbility => {
  const genreNames = genres.map(g => g.name);
  
  if (genreNames.includes('Action')) {
    return {
      name: 'RAMPAGE',
      description: 'Deals 2x damage every 3rd turn',
      effect: (turn, damage) => {
        if (turn % 3 === 0) {
          return { damage: damage * 2, heal: 0, message: '💥 RAMPAGE ACTIVATED! Double damage!' };
        }
        return { damage, heal: 0, message: '' };
      }
    };
  }
  
  if (genreNames.includes('Horror')) {
    return {
      name: 'LIFESTEAL',
      description: 'Heals 15% of max HP each turn',
      effect: (_turn, damage) => {
        return { damage, heal: 0.15, message: '🩸 Boss regenerates health!' };
      }
    };
  }
  
  if (genreNames.includes('Drama')) {
    return {
      name: 'EMOTIONAL WEIGHT',
      description: 'Your attacks deal 30% less damage',
      effect: (_turn, damage) => {
        return { damage, heal: 0, message: '😢 Your attacks feel less impactful...' };
      }
    };
  }
  
  if (genreNames.includes('Sci-Fi')) {
    return {
      name: 'TECH SHIELD',
      description: 'Absorbs first 1500 damage each turn',
      effect: (_turn, damage) => {
        return { damage, heal: 0, message: '🛡️ Tech shield absorbing damage!' };
      }
    };
  }
  
  if (genreNames.includes('Crime') || genreNames.includes('Thriller')) {
    return {
      name: 'PRECISION STRIKE',
      description: 'Ignores 75% of your defense',
      effect: (_turn, damage) => {
        return { damage, heal: 0, message: '🎯 Critical hit! Defense shattered!' };
      }
    };
  }
  
  return {
    name: 'BLOCKBUSTER',
    description: 'All damage increased by 50%',
    effect: (_turn, damage) => {
      return { damage: damage * 1.5, heal: 0, message: '💥 Legendary power surges!' };
    }
  };
};