import type { Timestamp } from "firebase-admin/firestore";

export type User = {
  id: string;
  fullName: string;
  email: string;
  photoURL: string;
  nickname: string;
  createdAt: Timestamp;
};
