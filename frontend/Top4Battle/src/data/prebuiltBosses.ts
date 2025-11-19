import type { PrebuiltBoss } from '../types/index';

export const PREBUILT_BOSSES: PrebuiltBoss[] = [
  {
    id: 'jaws',
    title: 'Jaws',
    poster_url: '/lxM6kqilAdpdhqUl2biYp5frUxE.jpg',
    maxHP: 5000,
    basePower: 300,
    baseDamage: 600,
    defenseIgnore: 0.3,
    genres: [
      { id: 27, name: 'Horror' },
      { id: 53, name: 'Thriller' }
    ],
    ability: {
      name: 'Blood Frenzy',
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
    poster_url: '/ctaETvc0KmHTiwGo2GFUlPpm6Oo.jpg',
    maxHP: 6000,
    basePower: 350,
    baseDamage: 700,
    defenseIgnore: 0.4,
    genres: [
      { id: 27, name: 'Horror' },
      { id: 878, name: 'Science Fiction' }
    ],
    ability: {
      name: 'Acid Blood',
      description: 'Heals self when attacked.',
      effect: (_turn, baseDamage) => ({
        damage: baseDamage,
        heal: 0.05,
        message: 'Alien heals from acid blood!'
      })
    }
  },
  {
    id: 'kpop-demon-hunters',
    title: 'KPop Demon Hunters',
    poster_url: '/zT7Lhw3BhJbMkRqm9Zlx2YGMsY0.jpg',
    maxHP: 6000,
    basePower: 350,
    baseDamage: 700,
    defenseIgnore: 0.4,
    genres: [
      { id: 14, name: 'Horror' },
      { id: 10402, name: 'Music' },
      { id: 35, name: 'Comedy' },
      { id: 16, name: 'Animation' }
    ],
    ability: {
      name: 'Dance of Shadows',
      description: 'Heals self when attacked.',
      effect: (_turn, baseDamage) => ({
        damage: baseDamage,
        heal: 0.05,
        message: 'Alien heals from acid blood!'
      })
    }
  },
  {
    id: 'turbo',
    title: 'Turbo',
    poster_url: '/aE3A98CfBWVReurJqpOBFbzIwMf.jpg',
    maxHP: 6000,
    basePower: 350,
    baseDamage: 700,
    defenseIgnore: 0.4,
    genres: [
      { id: 16, name: 'Animation' },
      { id: 10751, name: 'Family' }
    ],
    ability: {
      name: 'Nitro Boost',
      description: 'Heals self when attacked.',
      effect: (_turn, baseDamage) => ({
        damage: baseDamage,
        heal: 0.05,
        message: 'Alien heals from acid blood!'
      })
    }
  },
  {
    id: 'hook',
    title: 'Hook',
    poster_url: '/4ZPOIhQJiK8BFc0VF8BZahPVXR0.jpg',
    maxHP: 6000,
    basePower: 350,
    baseDamage: 700,
    defenseIgnore: 0.4,
    genres: [
      { id: 12, name: 'Adventure' },
      { id: 14, name: 'Fantasy' },
      { id: 35, name: 'Comedy' },
      { id: 10751, name: 'Family' }
    ],
    ability: {
      name: 'Pirate’s Revenge',
      description: 'Heals self when attacked.',
      effect: (_turn, baseDamage) => ({
        damage: baseDamage,
        heal: 0.05,
        message: 'Alien heals from acid blood!'
      })
    }
  },
  {
    id: 'ex-machina',
    title: 'Ex Machina',
    poster_url: '/dmJW8IAKHKxFNiUnoDR7JfsK7Rp.jpg',
    maxHP: 6000,
    basePower: 350,
    baseDamage: 700,
    defenseIgnore: 0.4,
    genres: [
      { id: 18, name: 'Drama' },
      { id: 878, name: 'Science Fiction' }
    ],
    ability: {
      name: 'AI Manipulation',
      description: 'Heals self when attacked.',
      effect: (_turn, baseDamage) => ({
        damage: baseDamage,
        heal: 0.05,
        message: 'Alien heals from acid blood!'
      })
    }
  },
  {
    id: 'the-blob',
    title: 'The Blob',
    poster_url: '/zXXDmz5cPuSo9LveCNjZ1j16szC.jpg',
    maxHP: 6000,
    basePower: 350,
    baseDamage: 700,
    defenseIgnore: 0.4,
    genres: [
      { id: 27, name: 'Horror' },
      { id: 878, name: 'Science Fiction' }
    ],
    ability: {
      name: 'Slime Cannon',
      description: 'Heals self when attacked.',
      effect: (_turn, baseDamage) => ({
        damage: baseDamage,
        heal: 0.05,
        message: 'Alien heals from acid blood!'
      })
    }
  },
  {
    id: 'fanstastic-mr-fox',
    title: 'Fantastic Mr. Fox',
    poster_url: '/pYbIT04CMXAbVEPj9mhFzcM73XS.jpg',
    maxHP: 6000,
    basePower: 350,
    baseDamage: 700,
    defenseIgnore: 0.4,
    genres: [
      { id: 12, name: 'Adventure' },
      { id: 16, name: 'Animation' },
      { id: 35, name: 'Comedy' },
      { id: 10751, name: 'Family' }
    ],
    ability: {
      name: 'Sneak King',
      description: 'Heals self when attacked.',
      effect: (_turn, baseDamage) => ({
        damage: baseDamage,
        heal: 0.05,
        message: 'Alien heals from acid blood!'
      })
    }
  },
  {
    id: 'pink-flamingos',
    title: 'Pink Flamingos',
    poster_url: '/10N8SvTQwUqyWgocPam1P18Jgr.jpg',
    maxHP: 6000,
    basePower: 350,
    baseDamage: 700,
    defenseIgnore: 0.4,
    genres: [
      { id: 35, name: 'Comedy' },
      { id: 80, name: 'Crime' }
    ],
    ability: {
      name: 'Barf Bag',
      description: 'Heals self when attacked.',
      effect: (_turn, baseDamage) => ({
        damage: baseDamage,
        heal: 0.05,
        message: 'Alien heals from acid blood!'
      })
    }
  },
  {
    id: 'cujo',
    title: 'Cujo',
    poster_url: '/zqRxnH7Dn1EXaLZWVNXVzBYWSR.jpg',
    maxHP: 6000,
    basePower: 350,
    baseDamage: 700,
    defenseIgnore: 0.4,
    genres: [
      { id: 27, name: 'Horror' },
      { id: 53, name: 'Thriller' }
    ],
    ability: {
      name: 'Rabid Assault',
      description: 'Heals self when attacked.',
      effect: (_turn, baseDamage) => ({
        damage: baseDamage,
        heal: 0.05,
        message: 'Alien heals from acid blood!'
      })
    }
  },
  {
    id: 'the-thing',
    title: 'The Thing',
    poster_url: '/tzGY49kseSE9QAKk47uuDGwnSCu.jpg',
    maxHP: 6000,
    basePower: 350,
    baseDamage: 700,
    defenseIgnore: 0.4,
    genres: [
      { id: 27, name: 'Horror' },
      { id: 9648, name: 'Mystery' },
      { id: 878, name: 'Science Fiction' }
    ],
    ability: {
      name: 'Shape Shift',
      description: 'Heals self when attacked.',
      effect: (_turn, baseDamage) => ({
        damage: baseDamage,
        heal: 0.05,
        message: 'Alien heals from acid blood!'
      })
    }
  },
];