import type { MovieCard, BattleResult } from '../types';
import {
  getStarPowerMultiplier,
  getRevenueMultiplier,
  getEraMultiplier
} from './statHelpers';

// Calculate battle damage with synergies
export const calculateBattle = (cards: MovieCard[]): BattleResult => {
  if (cards.length === 0) return { damage: 0, defense: 0, synergies: [] };
  
  const synergies: string[] = [];
  let totalDamage = 0;
  let totalDefense = 0;
  let multiplier = 1;
  
  // Base damage from all cards
  cards.forEach(card => {
    const baseDmg = card.basePower;
    const starMult = getStarPowerMultiplier(card.starPowerTier);
    const revMult = getRevenueMultiplier(card.revenueTier);
    const eraMult = getEraMultiplier(card.eraTier);
    
    totalDamage += baseDmg * starMult * revMult * eraMult;
    totalDefense += card.basePower * 0.6; // Defense is 60% of base power
  });
  
  // Genre synergies
  const genres = cards.flatMap(c => c.genres.slice(0, 2).map(g => g.name));
  const genreCounts = genres.reduce((acc, g) => {
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  Object.entries(genreCounts).forEach(([genre, count]) => {
    if (count >= 4) {
      multiplier *= 3;
      synergies.push(`${genre} Combo\n 3x damage`);
    } else if (count >= 3) {
      multiplier *= 2;
      synergies.push(`${genre} Combo\n 2x damage`);
    } else if (count >= 2) {
      multiplier *= 1.5;
      synergies.push(`${genre} Combo\n 1.5x damage`);
    }
  });
  
  // Decade synergy
  const decades = cards.map(c => c.decade);
  if (new Set(decades).size === 1) {
    multiplier *= 1.4;
    synergies.push(`${decades[0]} Era Unity 1.4x damage`);
  }
  
  // High rating synergy
  const avgRating = cards.reduce((sum, c) => sum + c.vote_average, 0) / cards.length;
  if (avgRating >= 8.5) {
    totalDamage += 800;
    synergies.push(`Masterpiece (avg 8.5+): +800 damage`);
  } else if (avgRating >= 8.0) {
    totalDamage += 500;
    synergies.push(`Critical Darling (avg 8.0+): +500 damage`);
  }
  
  // Genre-specific bonuses
  if (genres.includes('Action')) {
    totalDamage += 300;
    synergies.push(`Action Bonus +300 damage`);
  }
  if (genres.includes('Horror')) {
    const lifesteal = Math.round(totalDamage * 0.1);
    synergies.push(`Horror Lifesteal Heal ${lifesteal} HP`);
  }
  
  totalDamage *= multiplier;
  
  return {
    damage: Math.round(totalDamage),
    defense: Math.round(totalDefense),
    synergies
  };
};