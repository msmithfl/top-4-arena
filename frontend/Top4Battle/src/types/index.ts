export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  revenue: number;
  runtime: number;
  release_date: string;
  popularity: number;
  genres: { id: number; name: string }[];
}

export interface MovieCard extends Movie {
  basePower: number;
  starPowerTier: string;
  revenueTier: string;
  eraTier: string;
  decade: string;
}

export interface BossAbility {
  name: string;
  description: string;
  effect: (turn: number, damage: number) => { damage: number; heal: number; message: string };
}

export interface BossCard extends MovieCard {
  maxHP: number;
  baseDamage: number;
  defenseIgnore: number;
  ability: BossAbility;
}

export interface BattleResult {
  damage: number;
  defense: number;
  synergies: string[];
}
