import type { Timestamp } from "firebase/firestore";

import type { Sticker } from "./sticker";

export type StickerRarity = "common" | "normal" | "bronze" | "silver" | "gold";

export type Collection = {
  id: string;
  userId: string;
  stickerRarity: StickerRarity;
  sticker: Sticker;
  createdAt: Timestamp;
  pastedAt?: Timestamp;
};

export type CollectionStickerStats = {
  ownedCount: number;
  ownedCountByStickerId: number;
};
