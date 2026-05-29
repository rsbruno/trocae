import type { DocumentReference, Timestamp } from "firebase/firestore";

import type { StickerRarity } from "./sticker";

export type Collection = {
  id: string;
  userId: string;
  userRef: DocumentReference;
  stickerId: string;
  stickerRef: DocumentReference;
  stickerRarity: StickerRarity;
  teamId: string;
  teamRef: DocumentReference;
  createdAt: Timestamp;
};
