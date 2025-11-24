import type { MovieCard, BattleResult } from '../types';

export const calculateBattle = (cards: MovieCard[]): BattleResult => {
  if (cards.length === 0) return { damage: 0, defense: 0, synergies: [] };
  
  const synergies: string[] = [];
  let totalDamage = 0;
  let totalDefense = 0;
  let multiplier = 1;
  
  // Genre synergies - determine which genres have synergies
  const genres = cards.flatMap(c => c.genres.slice(0, 2).map(g => g.name));
  const genreCounts = genres.reduce((acc, g) => {
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Track genres that have synergies (count >= 2)
  const synergyGenres = new Set<string>();
  
  Object.entries(genreCounts).forEach(([genre, count]) => {
    if (count >= 4) {
      multiplier *= 3;
      synergies.push(`${genre} Combo\n 3x damage`);
      synergyGenres.add(genre);
    } else if (count >= 3) {
      multiplier *= 2;
      synergies.push(`${genre} Combo\n 2x damage`);
      synergyGenres.add(genre);
    } else if (count >= 2) {
      multiplier *= 1.2;
      synergies.push(`${genre} Combo\n 1.2x damage`);
      synergyGenres.add(genre);
    }
  });
  
  // Only add damage from cards that have at least one genre with synergy
  cards.forEach(card => {
    const cardGenres = card.genres.slice(0, 2).map(g => g.name);
    const hasGenreSynergy = cardGenres.some(g => synergyGenres.has(g));
    
    if (hasGenreSynergy) {
      const baseDmg = card.basePower;
      
      totalDamage += baseDmg;
      totalDefense += card.runtime;
    }
  });
  
  totalDamage *= multiplier;
  
  return {
    damage: Math.round(totalDamage),
    defense: Math.round(totalDefense),
    synergies
  };
};