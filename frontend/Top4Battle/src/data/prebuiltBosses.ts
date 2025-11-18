import type { PrebuiltBoss } from '../types/index';

export const PREBUILT_BOSSES: PrebuiltBoss[] = [
  {
    id: 'jaws',
    title: 'Jaws',
    poster_url: '/lxM6kqilAdpdhqUl2biYp5frUxE.jpg', // or TMDB poster path
    maxHP: 5000,
    basePower: 300,
    baseDamage: 600,
    defenseIgnore: 0.3,
    genres: [
      { id: 27, name: 'Horror' },
      { id: 53, name: 'Thriller' }
    ],
    ability: {
      name: '🦈 Blood Frenzy',
      description: 'Deals extra damage every 3 turns.',
      effect: (turn, baseDamage) => ({
        damage: turn % 3 === 0 ? baseDamage + 400 : baseDamage,
        message: turn % 3 === 0 ? 'Jaws goes into a frenzy!' : ''
      })
    }
  },
  {
    id: 'alien',
    title: 'Alien',
    poster_url: '/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg',
    maxHP: 6000,
    basePower: 350,
    baseDamage: 700,
    defenseIgnore: 0.4,
    genres: [
      { id: 27, name: 'Horror' },
      { id: 878, name: 'Science Fiction' }
    ],
    ability: {
      name: '👽 Acid Blood',
      description: 'Heals self when attacked.',
      effect: (_turn, baseDamage) => ({
        damage: baseDamage,
        heal: 0.05,
        message: 'Alien heals from acid blood!'
      })
    }
  },
];