export const calculateStarPowerTier = (voteCount: number, revenue: number, popularity: number): string => {
  const score = (voteCount / 1000) * 0.5 + (revenue / 1000000) * 0.3 + popularity * 0.2;
  if (score > 50) return 'A-list';
  if (score > 20) return 'B-list';
  return 'Indie';
};

export const getStarPowerMultiplier = (tier: string): number => {
  if (tier === 'A-list') return 1.3;
  if (tier === 'B-list') return 1.15;
  return 1;
};

export const calculateRevenueTier = (revenue: number): string => {
  if (revenue > 500000000) return 'Blockbuster';
  if (revenue > 100000000) return 'Hit';
  return 'Modest';
};

export const getRevenueMultiplier = (tier: string): number => {
  if (tier === 'Blockbuster') return 2;
  if (tier === 'Hit') return 1.5;
  return 1;
};

export const calculateEraTier = (releaseDate: string): string => {
  const year = new Date(releaseDate).getFullYear();
  const age = 2025 - year;
  if (age < 10) return 'Modern';
  if (age < 20) return 'Recent';
  if (age < 30) return 'Classic';
  return 'Legendary';
};

export const getEraMultiplier = (tier: string): number => {
  if (tier === 'Legendary') return 1.3;
  if (tier === 'Classic') return 1.2;
  if (tier === 'Recent') return 1.1;
  return 1;
};

export const getDecade = (releaseDate: string): string => {
  const year = new Date(releaseDate).getFullYear();
  return `${Math.floor(year / 10) * 10}s`;
};