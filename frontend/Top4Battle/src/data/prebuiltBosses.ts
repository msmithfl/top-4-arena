import type { PrebuiltBoss } from '../types/index';

export const PREBUILT_BOSSES: PrebuiltBoss[] = [
  {
    id: 'jaws',
    tmdbId: 578, // Jaws (1975)
    poster_url: '/lxM6kqilAdpdhqUl2biYp5frUxE.jpg',
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
    tmdbId: 348, // Alien (1979)
    poster_url: '/ctaETvc0KmHTiwGo2GFUlPpm6Oo.jpg',
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
    id: 'the-babadook',
    tmdbId: 242224, // The Babadook
    poster_url: '/6gbQp25jkRuKoDvDIEym3McsLbc.jpg',
    ability: {
      name: 'Psychological Torture',
      description: 'Hides the genre for some cards.',
      effect: (_turn, baseDamage) => ({
        damage: baseDamage,
        heal: 0.05,
        message: 'Babadook terrorizes 3 cards!'
      })
    }
  },
  {
    id: 'christine',
    tmdbId: 8769, // Christine
    poster_url: '/mMtUJke2TtIoT6JB9hkvERmsSu8.jpg',
    ability: {
      name: 'Exhaust Fumes',
      description: 'Slowly drains your health.',
      effect: (_turn, baseDamage) => ({
        damage: baseDamage * 1.2,
        message: 'Fumes activated!'
      })
    }
  },
  {
    id: 'hook',
    tmdbId: 879, // Hook
    poster_url: '/4ZPOIhQJiK8BFc0VF8BZahPVXR0.jpg',
    ability: {
      name: "Pirate's Revenge",
      description: 'Strikes back with vengeance.',
      effect: (_turn, baseDamage) => ({
        damage: baseDamage * 1.15,
        message: 'The captain strikes back!'
      })
    }
  },
  {
    id: 'ex-machina',
    tmdbId: 264660, // Ex Machina
    poster_url: '/dmJW8IAKHKxFNiUnoDR7JfsK7Rp.jpg',
    ability: {
      name: 'AI Manipulation',
      description: 'Predicts and counters attacks.',
      effect: (_turn, baseDamage) => ({
        damage: baseDamage * 1.25,
        message: 'Ava predicts your move!'
      })
    }
  },
  {
    id: 'the-blob',
    tmdbId: 9599, // The Blob (1988)
    poster_url: '/zXXDmz5cPuSo9LveCNjZ1j16szC.jpg',
    ability: {
      name: 'Slime Cannon',
      description: 'Absorbs and reflects damage.',
      effect: (_turn, baseDamage) => ({
        damage: baseDamage,
        heal: 0.03,
        message: 'The blob absorbs your attack!'
      })
    }
  },
  {
    id: 'goodfellas',
    tmdbId: 769, // Goodfellas
    poster_url: '/6QMSLvU5ziIL2T6VrkaKzN2YkxK.jpg',
    ability: {
      name: 'Made Man',
      description: 'Chance of deadly blow.',
      effect: (turn, baseDamage) => ({
        damage: turn % 2 === 0 ? baseDamage * 1.3 : baseDamage,
        message: turn % 2 === 0 ? 'Ruthless sneak attack!' : ''
      })
    }
  },
  {
    id: 'pink-flamingos',
    tmdbId: 692, // Pink Flamingos
    poster_url: '/10N8SvTQwUqyWgocPam1P18Jgr.jpg',
    ability: {
      name: "Divine's Fury",
      description: 'Unleashes shocking power.',
      effect: (_turn, baseDamage) => ({
        damage: baseDamage * 1.4,
        message: 'Divine fury unleashed!'
      })
    }
  },
  {
    id: 'cujo',
    tmdbId: 10489, // Cujo
    poster_url: '/zqRxnH7Dn1EXaLZWVNXVzBYWSR.jpg',
    ability: {
      name: 'Rabid Assault',
      description: 'Wild attacks with increasing fury.',
      effect: (turn, baseDamage) => ({
        damage: baseDamage + (turn * 50),
        message: 'Rabid fury intensifies!'
      })
    }
  },
  {
    id: 'the-thing',
    tmdbId: 1091, // The Thing (1982)
    poster_url: '/tzGY49kseSE9QAKk47uuDGwnSCu.jpg',
    ability: {
      name: 'Shape Shift',
      description: 'Adapts to avoid damage.',
      effect: (_turn, baseDamage) => ({
        damage: baseDamage * 0.9,
        heal: 0.08,
        message: 'The Thing adapts and regenerates!'
      })
    }
  },
];
