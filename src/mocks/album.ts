import type { ExtraStickerVariant } from "@/components/v2026/stickers/extra";
import type { StickerVariant } from "@/components/v2026/stickers/normal";
import type { Sticker } from "@/@types/sticker";

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
  layout: "extra" | "player";
  sticker: Sticker;
  playerVariant?: StickerVariant;
  extraVariant?: ExtraStickerVariant;
  repeated?: number;
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

const placeholderPlayerSticker = (order: number, position: Sticker["player"]["position"]): Sticker => ({
  player: {
    birthDate: "2000-01-01",
    name: "Jogador",
    height: 180,
    weight: 75,
    position
  },
  code: `ALB${String(order).padStart(3, "0")}`,
  currentTeam: { fifaCode: "BRA", name: "—" },
  id: `album-${order}`,
  team: mockBrazilTeam,
  type: "player",
  order
});

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
    sticker: {
      player: {
        name: "Vinícius Júnior",
        birthDate: "2000-07-07",
        position: "ST",
        height: 176,
        weight: 73
      },
      currentTeam: { name: "Real Madrid (ESP)", fifaCode: "ESP" },
      team: mockBrazilTeam,
      code: "ALB001",
      type: "player",
      id: "album-1",
      order: 1
    },
    playerVariant: "forward",
    layout: "player",
    isRare: true,
    repeated: 2,
    owned: true,
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
      code: "ALB002",
      type: "player",
      id: "album-2",
      order: 2
    },
    playerVariant: "midfielder",
    layout: "player",
    owned: true,
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
      code: "ALB003",
      type: "player",
      id: "album-3",
      order: 3
    },
    extraVariant: "gold",
    isHolographic: true,
    layout: "extra",
    owned: true,
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
      code: "ALB004",
      type: "player",
      id: "album-4",
      order: 4
    },
    playerVariant: "goalkeeper",
    layout: "player",
    owned: true,
    number: 4
  },
  {
    sticker: {
      player: {
        name: "Marquinhos Moraes",
        birthDate: "1994-05-14",
        position: "CB",
        height: 183,
        weight: 75
      },
      currentTeam: { name: "PSG (FRA)", fifaCode: "FRA" },
      team: mockBrazilTeam,
      code: "ALB005",
      type: "player",
      id: "album-5",
      order: 5
    },
    playerVariant: "defender",
    layout: "player",
    repeated: 1,
    owned: true,
    number: 5
  },
  {
    sticker: {
      player: {
        name: "Bruno Guimarães",
        birthDate: "1997-11-16",
        position: "CM",
        height: 182,
        weight: 74
      },
      currentTeam: { name: "Newcastle (ENG)", fifaCode: "ENG" },
      team: mockBrazilTeam,
      code: "ALB006",
      type: "player",
      id: "album-6",
      order: 6
    },
    playerVariant: "midfielder",
    layout: "player",
    owned: true,
    number: 6
  },
  { sticker: placeholderPlayerSticker(7, "ST"), playerVariant: "forward", layout: "player", owned: false, number: 7 },
  { sticker: placeholderPlayerSticker(8, "CM"), playerVariant: "midfielder", layout: "player", owned: false, number: 8 },
  {
    sticker: {
      player: {
        name: "Richarlison de Andrade",
        birthDate: "1997-05-10",
        position: "ST",
        height: 184,
        weight: 78
      },
      currentTeam: { name: "Tottenham (ENG)", fifaCode: "ENG" },
      team: mockBrazilTeam,
      code: "ALB009",
      type: "player",
      id: "album-9",
      order: 9
    },
    playerVariant: "forward",
    layout: "player",
    owned: true,
    number: 9
  },
  {
    sticker: {
      player: {
        birthDate: "1992-02-23",
        name: "Casemiro",
        position: "CDM",
        height: 185,
        weight: 84
      },
      currentTeam: { fifaCode: "BRA", name: "Brasil" },
      team: mockBrazilTeam,
      id: "album-10",
      code: "ALB010",
      type: "player",
      order: 10
    },
    extraVariant: "silver",
    layout: "extra",
    owned: true,
    number: 10
  },
  { sticker: placeholderPlayerSticker(11, "CB"), playerVariant: "defender", layout: "player", owned: false, number: 11 },
  {
    sticker: {
      player: {
        name: "Raphinha Belloli",
        birthDate: "1996-12-14",
        position: "RW",
        height: 176,
        weight: 68
      },
      currentTeam: { name: "Barcelona (ESP)", fifaCode: "ESP" },
      team: mockBrazilTeam,
      id: "album-12",
      code: "ALB012",
      type: "player",
      order: 12
    },
    playerVariant: "midfielder",
    layout: "player",
    owned: true,
    number: 12
  },
  {
    sticker: {
      player: {
        birthDate: "1991-07-15",
        name: "Danilo Luiz",
        position: "RB",
        height: 184,
        weight: 84
      },
      currentTeam: { name: "Botafogo (BRA)", fifaCode: "BRA" },
      team: mockBrazilTeam,
      id: "album-13",
      code: "ALB013",
      type: "player",
      order: 13
    },
    playerVariant: "defender",
    layout: "player",
    repeated: 3,
    owned: true,
    number: 13
  },
  { sticker: placeholderPlayerSticker(14, "GK"), playerVariant: "goalkeeper", layout: "player", owned: false, number: 14 },
  {
    sticker: { ...placeholderPlayerSticker(15, "ST") },
    extraVariant: "bronze",
    layout: "extra",
    owned: false,
    number: 15
  },
  { sticker: placeholderPlayerSticker(16, "ST"), playerVariant: "forward", layout: "player", owned: false, number: 16 },
  { sticker: placeholderPlayerSticker(17, "CM"), playerVariant: "midfielder", layout: "player", owned: false, number: 17 },
  { sticker: placeholderPlayerSticker(18, "CB"), playerVariant: "defender", layout: "player", owned: false, number: 18 }
];
