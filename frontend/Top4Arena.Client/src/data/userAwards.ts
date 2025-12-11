import { adjustRating } from "../utils/enhanceMovie";

export const AWARDS = [
  {
    awardId: "round-10",
    awardTitle: "Neophyte",
    description: "Make it to Round 10."
  },
  {
    awardId: "round-25",
    awardTitle: "Budding Cinephile",
    description: "Make it to Round 25."
  },
  {
    awardId: "round-50",
    awardTitle: "Film Aficionado",
    description: "Make it to Round 50."
  },
  {
    awardId: "50k-hit",
    awardTitle: "Indie Darling",
    description: "Score a 50k combo."
  },
  {
    awardId: "100k-hit",
    awardTitle: "Box Office Hitter",
    description: "Score a 100k combo."
  },
  {
    awardId: "one-shot-boss",
    awardTitle: "Smashing Machine",
    description: "Defeat a boss in one hit."
  },
  {
    awardId: "comeback-hit",
    awardTitle: "Deus Ex Machina", 
    description: "???" // Defeat a boss with your health below 500.
  },
  {
    awardId: "tarantino-hand",
    awardTitle: "Foot Fetishist",
    description: "???" // Play a full Tarantino hand.
  },
  {
    awardId: "splatty-tomato",
    awardTitle: "Splatty Tomato", 
    description: "???" // Play 4 films with a rating below 5.0
  },
  {
    awardId: "all-different-genre",
    awardTitle: "Eclectic Taste",
    description: "???" // Play a hand with all different genres.
  },
  {
    awardId: "film-bro-rushmore",
    awardTitle: "Film Bro Rushmore", 
    description: "???" // Play a hand with one of each: Tarantino, Nolan, Fincher, Aronofsky, Scorsese, PTA
  },
  {
    awardId: "pure-comedy",
    awardTitle: "Yuk It Up!", 
    description: "???" // Play a pure comedy hand.
  },
];

export function isHandAllSpecificMovies(hand: { id: number }[], validIds: number[]): boolean {
  if (hand.length !== 4) return false;
  const validSet = new Set(validIds);
  return hand.every(card => validSet.has(card.id));
}

// Returns true if every card in the hand has vote_average below the given threshold
export function isHandBelowVoteAverage(hand: { vote_average: number }[], threshold: number): boolean {
  if (hand.length !== 4) return false;
  return hand.every(card => adjustRating(card.vote_average) < threshold);
}

// Returns true if the only genre present in the hand is "Comedy"
export function isHandPureComedy(hand: { genres: { name: string }[] }[]): boolean {
  if (hand.length !== 4) return false;
  const allGenres = hand.flatMap(card => card.genres.map(g => g.name));
  const uniqueGenres = new Set(allGenres);
  return uniqueGenres.size === 1 && uniqueGenres.has("Comedy");
}

// Returns true if hand has 4 cards and playerDamage is 0
export function isHandNoDamage(hand: unknown[], playerDamage: number): boolean {
  return hand.length === 4 && playerDamage === 0;
}

export function isHandFilmBroRushmore(hand: { id: number }[]): boolean {
  if (hand.length !== 4) return false;
  
  // Define director groups
  const directors = [
    { name: "Tarantino", ids: tarantinoIds },
    { name: "Nolan", ids: nolanIds },
    { name: "Fincher", ids: fincherIds },
    { name: "PTA", ids: ptaIds }
  ];
  
  // Track which directors we've found
  const foundDirectors = new Set<string>();
  
  // Check each card
  for (const card of hand) {
    let matchedDirector: string | null = null;
    
    // See which director (if any) this card belongs to
    for (const director of directors) {
      if (director.ids.includes(card.id)) {
        matchedDirector = director.name;
        break;
      }
    }
    
    // If card doesn't match any director, fail
    if (!matchedDirector) {
      return false;
    }
    
    // If we already have a film from this director, fail
    if (foundDirectors.has(matchedDirector)) {
      return false;
    }
    
    // Mark this director as found
    foundDirectors.add(matchedDirector);
  }
  
  // Must have found exactly 4 different directors
  return foundDirectors.size === 4;
}

export const tarantinoIds = [680, 68718, 16869, 24, 393, 500, 273248, 466272, 1991, 184];
export const nolanIds = [11660, 77, 320, 272, 1124, 155, 27205, 49026, 157336, 374720, 577922, 872585, 1368337];
export const fincherIds = [8077, 807, 2649, 550, 4547, 1949, 4922, 37799, 65754, 210577, 614560, 800158];
export const ptaIds = [8052, 4995, 334, 8051, 7345, 68722, 171274, 400617, 718032, 1054867];