import type { ExtraStickerVariant } from "@/components/v2026/stickers/extra";
import type { StickerVariant } from "@/components/v2026/stickers/normal";
import type { Sticker } from "@/@types/sticker";

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

export type HomeRecentSticker = {
  number: number;
  layout: "extra" | "player";
  sticker: Sticker;
  playerVariant?: StickerVariant;
  extraVariant?: ExtraStickerVariant;
  isRare?: boolean;
  isHolographic?: boolean;
};

const mockBrazilTeam: Sticker["team"] = {
  stickerPrimary: "var(--accent-primary-strong)",
  primaryColor: "var(--accent-primary-strong)",
  stickerSecondary: "var(--accent-highlight)",
  secondaryColor: "var(--accent-highlight)",
  flag: "/assets/png/flag-brazil.png",
  id: "mock-brazil-team",
  fifaCode: "BRA",
  name: "Brasil",
  groupCode: "A"
};

export const recentStickers: HomeRecentSticker[] = [
  {
    sticker: {
      player: {
        name: "Vinicius Junior",
        birthDate: "2000-07-07",
        position: "ST",
        height: 176,
        weight: 73
      },
      currentTeam: { name: "Real Madrid (ESP)", fifaCode: "ESP" },
      team: mockBrazilTeam,
      code: "HOME001",
      type: "player",
      id: "home-1",
      order: 1
    },
    playerVariant: "forward",
    layout: "player",
    number: 1
  },
  {
    sticker: {
      player: {
        birthDate: "2001-01-09",
        name: "Rodrygo Goes",
        position: "CM",
        height: 174,
        weight: 64
      },
      currentTeam: { name: "Real Madrid (ESP)", fifaCode: "ESP" },
      team: mockBrazilTeam,
      code: "HOME002",
      type: "player",
      id: "home-2",
      order: 2
    },
    playerVariant: "midfielder",
    layout: "player",
    isRare: true,
    number: 2
  },
  {
    sticker: {
      player: {
        birthDate: "1992-02-05",
        name: "Neymar Jr",
        position: "ST",
        height: 175,
        weight: 68
      },
      currentTeam: { fifaCode: "BRA", name: "Brasil" },
      team: mockBrazilTeam,
      code: "HOME003",
      type: "player",
      id: "home-3",
      order: 3
    },
    extraVariant: "gold",
    layout: "extra",
    number: 3
  },
  {
    sticker: {
      player: {
        birthDate: "1992-10-02",
        name: "Alisson Becker",
        position: "GK",
        height: 193,
        weight: 91
      },
      currentTeam: { name: "Liverpool (ENG)", fifaCode: "ENG" },
      team: mockBrazilTeam,
      code: "HOME004",
      type: "player",
      id: "home-4",
      order: 4
    },
    playerVariant: "goalkeeper",
    isHolographic: true,
    layout: "player",
    isRare: true,
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
