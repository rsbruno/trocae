export type StickerType = "badge" | "team" | "player";

export type PlayerPosition = "GK" | "CB" | "RB" | "LB" | "CM" | "CDM" | "CAM" | "RW" | "LW" | "ST" | "CF";

export type Sticker = {
  id: string;
  order: number;
  code: string;
  type: StickerType;
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
    stickerPrimary: string;
    stickerSecondary: string;
    groupCode: string;
  };
};

export type StickerSeed = Sticker;
