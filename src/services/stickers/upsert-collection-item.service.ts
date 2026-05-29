import { serverTimestamp, Timestamp, getDoc, setDoc, doc } from "firebase/firestore";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";

import type { StickerRarity } from "@/@types/collection";
import type { Collection } from "@/@types/collection";
import type { Sticker } from "@/@types/sticker";

import { getFirestoreClient } from "@/infra/firebase/client";
import { getFirebaseAuth } from "@/infra/firebase/auth";

export type UpsertCollectionItemInput = {
  sticker: Sticker;
  stickerRarity: StickerRarity;
};

type UseUpsertCollectionItemOptions = Omit<UseMutationOptions<Collection, Error, UpsertCollectionItemInput>, "mutationFn">;

export const upsertCollectionItemService = async ({ stickerRarity, sticker }: UpsertCollectionItemInput): Promise<Collection> => {
  const auth = getFirebaseAuth();
  await auth.authStateReady();

  const currentUser = auth.currentUser;

  if (currentUser === null) {
    throw new Error("Sua sessão expirou. Entre novamente.");
  }

  const userId = currentUser.uid;
  const collectionId = crypto.randomUUID();

  const collectionRef = doc(getFirestoreClient(), "collections", collectionId);

  await setDoc(collectionRef, {
    createdAt: serverTimestamp(),
    id: collectionId,
    stickerRarity,
    sticker,
    userId
  });

  const snapshot = await getDoc(collectionRef);

  if (!snapshot.exists()) {
    throw new Error("Não foi possível confirmar a figurinha na sua coleção.");
  }

  const data = snapshot.data();

  if (!data || !(data.createdAt instanceof Timestamp)) {
    throw new Error("Não foi possível confirmar a figurinha na sua coleção.");
  }

  return {
    createdAt: data.createdAt,
    id: collectionId,
    stickerRarity,
    sticker,
    userId
  };
};

export function useUpsertCollectionItemService(options?: UseUpsertCollectionItemOptions) {
  return useMutation({
    mutationFn: upsertCollectionItemService,
    ...options
  });
}
