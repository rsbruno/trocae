import type { DocumentReference } from "firebase/firestore";

import type { Team } from "./team";

export type StickerType = "badge" | "team" | "player";

export type StickerRarity = "common" | "normal" | "bronze" | "silver" | "gold";

export type PlayerPosition = "" | "GK" | "CB" | "RB" | "LB" | "CM" | "CDM" | "CAM" | "RW" | "LW" | "ST" | "CF";

export type Sticker = {
  id: string;
  number: number;
  code: string;
  name: string;
  type: StickerType;
  rarity: StickerRarity;
  teamRef: DocumentReference<Team>;
  playerPosition: PlayerPosition;
  playerName: string;
  weight: number;
  height: number;
  birthDate: string;
  currentClub: string;
  currentClubCountryCode: string;
};

export type StickerSeed = Omit<Sticker, "teamRef"> & {
  teamRef: string;
};
