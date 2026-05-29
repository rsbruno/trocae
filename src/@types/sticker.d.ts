export type StickerType = "badge" | "team" | "player";

export type StickerRarity = "common" | "normal" | "bronze" | "silver" | "gold";

export type PlayerPosition = "GK" | "CB" | "RB" | "LB" | "CM" | "CDM" | "CAM" | "RW" | "LW" | "ST" | "CF";

export type Sticker = {
  id: string;
  order: number;
  code: string;
  type: StickerType;
  rarity: StickerRarity;
  player: {
    name: string;
    birthDate: string;
    position: PlayerPosition;
    weight: number;
    height: number;
  };
  currentTeam: {
    name: string;
    fifaCode: string;
  };
  team: {
    id: string;
    name: string;
    fifaCode: string;
    flag: string;
    primaryColor: string;
    secondaryColor: string;
    groupCode: string;
  };
};

export type StickerSeed = Sticker;
