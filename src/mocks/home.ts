export type HomeTeam = {
  name: string;
  flag: string;
  progress: number;
  collected: number;
  total: number;
};

export type HomeActivityItem = {
  icon: "trophy" | "sparkles" | "trending-up";
  text: string;
  time: string;
  color: string;
};

export const recentStickers = [
  {
    primaryColor: "var(--accent-primary-strong)",
    secondaryColor: "var(--accent-highlight)",
    flag: "/assets/png/flag-brazil.png",
    stats: "07-07-2000 | 1,76m | 73kg",
    club: "Real Madrid (ESP)",
    firstName: "vinicius",
    variant: "forward",
    lastName: "junior",
    countryCode: "BRA",
    type: "player",
    owned: true,
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
    isRare: true,
    owned: true,
    number: 2
  },
  {
    flag: "/assets/png/flag-brazil.png",
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
    isHolographic: true,
    lastName: "becker",
    countryCode: "BRA",
    type: "player",
    isRare: true,
    owned: true,
    number: 4
  }
];

export const homeTeams: HomeTeam[] = [
  { name: "Brasil", collected: 13, flag: "🇧🇷", progress: 72, total: 18 },
  { name: "Argentina", flag: "🇦🇷", progress: 44, collected: 8, total: 18 },
  { name: "Franca", flag: "🇫🇷", progress: 33, collected: 6, total: 18 },
  { name: "Alemanha", flag: "🇩🇪", progress: 28, collected: 5, total: 18 }
];

export const homeActivity: HomeActivityItem[] = [
  { text: "Selecao do Brasil completa", color: "text-accent-highlight", icon: "trophy", time: "2h" },
  { text: "Figurinha holografica obtida", color: "text-accent-primary", icon: "sparkles", time: "5h" },
  { text: "Troca com @pedro_alb", color: "text-ink-secondary", icon: "trending-up", time: "1d" }
];
