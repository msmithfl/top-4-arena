export interface Top4Preset {
  id: string;
  title: string;
  movieIds: [number, number, number, number]; // Exactly 4 TMDB IDs
}

export const CELEBRITY_TOP4S: Top4Preset[] = [
  {
    id: 'keanu-reeves',
    title: "Keanu Reeves",
    movieIds: [985, 11, 238, 9040]
  },
  {
    id: 'tom-hanks',
    title: "Tom Hanks",
    movieIds: [62, 887, 704, 3116]
  },
  {
    id: 'mikey-madison',
    title: "Mikey Madison",
    movieIds: [655, 87081, 39415, 9880]
  },
  {
    id: 'andrew-garfield',
    title: "Andrew Garfield",
    movieIds: [8446, 9340, 105, 2280]
  },
  {
    id: 'peter-jackson',
    title: "Peter Jackson",
    movieIds: [244, 3112, 947, 329]
  },
  {
    id: 'florence-pugh',
    title: "Florence Pugh",
    movieIds: [455, 9454, 2470, 11319]
  },
  {
    id: 'seth-rogen',
    title: "Seth Rogen",
    movieIds: [14886, 280, 115, 9603]
  },
  {
    id: 'julia-garner',
    title: "Julia Garner",
    movieIds: [705, 639, 10494, 769]
  }
];

export const ARCHETYPE_TOP4S: Top4Preset[] = [
  {
    id: 'standard-film-bro',
    title: "Standard Film Bro",
    movieIds: [680, 872585, 550, 1359]
  },
  {
    id: 'b-movie-horror-head',
    title: "B-Movie Horror Head",
    movieIds: [28941, 15239, 27346, 16296]
  },
  {
    id: 'nostalgic-millenial',
    title: "Nostalgic Millenial",
    movieIds: [8363, 808, 557, 4964]
  },
  {
    id: 'grindset-influencer',
    title: "Grindset Influencer",
    movieIds: [106646, 37799, 308266, 964980]
  },
  {
    id: 'transcendental-gooner',
    title: "Transcendental Gooner",
    movieIds: [23629, 1018, 884, 584]
  },
  {
    id: 'art-house-gooner',
    title: "Art House Gooner",
    movieIds: [439, 11104, 147, 25538]
  },
  {
    id: 'boomer-pop',
    title: "Boomer Pop",
    movieIds: [3034, 3063, 1585, 38765]
  },
  {
    id: 'sci-fi-anarchist',
    title: "Sci Fi Anarchist",
    movieIds: [752, 8337, 68, 39513]
  }
];
