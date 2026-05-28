export type AlbumTeam = {
  name: string;
  flag: string;
  fifaCode: string;
  collected: number;
  total: number;
};

export type AlbumGroup = {
  code: string;
  teams: AlbumTeam[];
};

export type AlbumSticker = {
  number: number;
  owned: boolean;
  type: "player" | "extra";
  variant: "forward" | "midfielder" | "defender" | "goalkeeper" | "normal" | "silver" | "bronze" | "gold";
  firstName?: string;
  lastName?: string;
  stats?: string;
  club?: string;
  flag?: string;
  countryCode?: string;
  primaryColor?: string;
  secondaryColor?: string;
  repeated?: number;
  isRare?: boolean;
  isHolographic?: boolean;
};

export const albumGroups: AlbumGroup[] = [
  {
    teams: [
      { fifaCode: "BRA", name: "Brasil", collected: 13, flag: "🇧🇷", total: 18 },
      { name: "Alemanha", fifaCode: "GER", flag: "🇩🇪", collected: 4, total: 18 },
      { fifaCode: "JPN", name: "Japão", flag: "🇯🇵", collected: 7, total: 18 },
      { name: "Nigéria", fifaCode: "NGA", flag: "🇳🇬", collected: 2, total: 18 }
    ],
    code: "A"
  },
  {
    teams: [
      { name: "Argentina", fifaCode: "ARG", flag: "🇦🇷", collected: 8, total: 18 },
      { name: "Inglaterra", fifaCode: "ENG", collected: 11, flag: "🏴", total: 18 },
      { fifaCode: "MEX", name: "México", flag: "🇲🇽", collected: 5, total: 18 },
      { name: "Austrália", fifaCode: "AUS", flag: "🇦🇺", collected: 3, total: 18 }
    ],
    code: "B"
  }
];

export const brazilAlbumStickers: AlbumSticker[] = [
  {
    primaryColor: "var(--accent-primary-strong)",
    secondaryColor: "var(--accent-highlight)",
    flag: "/assets/png/flag-brazil.png",
    stats: "07-07-2000 | 1,76m | 73kg",
    club: "Real Madrid (ESP)",
    firstName: "vinícius",
    variant: "forward",
    lastName: "júnior",
    countryCode: "BRA",
    type: "player",
    isRare: true,
    owned: true,
    repeated: 2,
    number: 1
  },
  {
    primaryColor: "var(--accent-primary-strong)",
    secondaryColor: "var(--accent-highlight)",
    flag: "/assets/png/flag-brazil.png",
    stats: "09-01-2001 | 1,74m | 64kg",
    club: "Real Madrid (ESP)",
    variant: "midfielder",
    firstName: "rodrygo",
    countryCode: "BRA",
    lastName: "goes",
    type: "player",
    owned: true,
    number: 2
  },
  {
    flag: "/assets/png/flag-brazil.png",
    isHolographic: true,
    firstName: "neymar",
    countryCode: "BRA",
    variant: "gold",
    lastName: "jr",
    type: "extra",
    owned: true,
    number: 3
  },
  {
    primaryColor: "var(--accent-primary-strong)",
    secondaryColor: "var(--accent-highlight)",
    flag: "/assets/png/flag-brazil.png",
    stats: "02-10-1992 | 1,93m | 91kg",
    club: "Liverpool (ENG)",
    variant: "goalkeeper",
    firstName: "alisson",
    lastName: "becker",
    countryCode: "BRA",
    type: "player",
    owned: true,
    number: 4
  },
  {
    primaryColor: "var(--accent-primary-strong)",
    secondaryColor: "var(--accent-highlight)",
    flag: "/assets/png/flag-brazil.png",
    stats: "14-05-1994 | 1,83m | 75kg",
    firstName: "marquinhos",
    variant: "defender",
    lastName: "moraes",
    countryCode: "BRA",
    club: "PSG (FRA)",
    type: "player",
    owned: true,
    repeated: 1,
    number: 5
  },
  {
    primaryColor: "var(--accent-primary-strong)",
    secondaryColor: "var(--accent-highlight)",
    flag: "/assets/png/flag-brazil.png",
    stats: "16-11-1997 | 1,82m | 74kg",
    club: "Newcastle (ENG)",
    variant: "midfielder",
    lastName: "guimarães",
    firstName: "bruno",
    countryCode: "BRA",
    type: "player",
    owned: true,
    number: 6
  },
  { variant: "forward", countryCode: "BRA", type: "player", owned: false, number: 7 },
  { variant: "midfielder", countryCode: "BRA", type: "player", owned: false, number: 8 },
  {
    primaryColor: "var(--accent-primary-strong)",
    secondaryColor: "var(--accent-highlight)",
    flag: "/assets/png/flag-brazil.png",
    stats: "10-05-1997 | 1,84m | 78kg",
    firstName: "richarlison",
    club: "Tottenham (ENG)",
    variant: "forward",
    countryCode: "BRA",
    type: "player",
    lastName: "de",
    owned: true,
    number: 9
  },
  {
    flag: "/assets/png/flag-brazil.png",
    firstName: "casemiro",
    countryCode: "BRA",
    variant: "silver",
    type: "extra",
    lastName: "",
    owned: true,
    number: 10
  },
  { variant: "defender", countryCode: "BRA", type: "player", owned: false, number: 11 },
  {
    primaryColor: "var(--accent-primary-strong)",
    secondaryColor: "var(--accent-highlight)",
    flag: "/assets/png/flag-brazil.png",
    stats: "14-12-1996 | 1,76m | 68kg",
    club: "Barcelona (ESP)",
    variant: "midfielder",
    firstName: "raphinha",
    lastName: "belloli",
    countryCode: "BRA",
    type: "player",
    owned: true,
    number: 12
  },
  {
    primaryColor: "var(--accent-primary-strong)",
    secondaryColor: "var(--accent-highlight)",
    flag: "/assets/png/flag-brazil.png",
    stats: "15-07-1991 | 1,84m | 84kg",
    club: "Botafogo (BRA)",
    variant: "defender",
    firstName: "danilo",
    countryCode: "BRA",
    lastName: "luiz",
    type: "player",
    owned: true,
    repeated: 3,
    number: 13
  },
  { variant: "goalkeeper", countryCode: "BRA", type: "player", owned: false, number: 14 },
  { countryCode: "BRA", variant: "bronze", type: "extra", owned: false, number: 15 },
  { variant: "forward", countryCode: "BRA", type: "player", owned: false, number: 16 },
  { variant: "midfielder", countryCode: "BRA", type: "player", owned: false, number: 17 },
  { variant: "defender", countryCode: "BRA", type: "player", owned: false, number: 18 }
];
