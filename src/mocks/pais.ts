import type { ExtraStickerVariant } from "@/components/v2026/stickers/extra";
import type { StickerVariant } from "@/components/v2026/stickers/normal";
import type { Sticker } from "@/@types/sticker";

export type PaisSticker = {
  number: number;
  owned: boolean;
  layout: "extra" | "player";
  sticker: Sticker;
  playerVariant?: StickerVariant;
  extraVariant?: ExtraStickerVariant;
  isRare?: boolean;
};

const mockBrazilTeam: Sticker["team"] = {
  primaryColor: "var(--accent-primary-strong)",
  secondaryColor: "var(--accent-highlight)",
  flag: "/assets/png/flag-brazil.png",
  id: "mock-brazil-team",
  fifaCode: "BRA",
  name: "Brasil",
  groupCode: "A"
};

export const paisStickers: PaisSticker[] = [
  {
    sticker: {
      player: {
        birthDate: "2000-02-16",
        name: "Bruno Santos",
        position: "CM",
        height: 180,
        weight: 75
      },
      currentTeam: { name: "Clube atual do jogador (BRA)", fifaCode: "BRA" },
      team: mockBrazilTeam,
      rarity: "normal",
      code: "PAIS001",
      type: "player",
      id: "pais-1",
      order: 1
    },
    playerVariant: "midfielder",
    layout: "player",
    owned: true,
    number: 1
  },
  {
    sticker: {
      player: {
        birthDate: "2000-02-16",
        name: "Bruno Santos",
        position: "CM",
        height: 180,
        weight: 75
      },
      currentTeam: { fifaCode: "BRA", name: "Brasil" },
      team: mockBrazilTeam,
      code: "PAIS002",
      type: "player",
      rarity: "gold",
      id: "pais-2",
      order: 2
    },
    extraVariant: "gold",
    layout: "extra",
    isRare: true,
    owned: true,
    number: 2
  }
];
