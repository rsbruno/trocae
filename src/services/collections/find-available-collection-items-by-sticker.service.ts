import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";

import type { Collection } from "@/@types/collection";

import { getFirestoreClient } from "@/infra/firebase/client";
import { getFirebaseAuth } from "@/infra/firebase/auth";

import { parseCollectionDocument } from "./find-all-collection-items.service";

export const findAvailableCollectionItemsByStickerQueryKeys = {
  detail: (stickerId: string) => [...findAvailableCollectionItemsByStickerQueryKeys.all(), stickerId.trim()] as const,
  all: () => ["use-find-available-collection-items-by-sticker"] as const
};

export const findAvailableCollectionItemsByStickerService = async (stickerId: string): Promise<Collection[]> => {
  const auth = getFirebaseAuth();
  await auth.authStateReady();

  const currentUser = auth.currentUser;

  if (currentUser === null) throw new Error("Sua sessão expirou. Entre novamente.");

  const normalizedStickerId = stickerId.trim();

  if (!normalizedStickerId) return [];

  const collectionsRef = collection(getFirestoreClient(), "collections");
  const collectionsQuery = query(
    collectionsRef,
    where("userId", "==", currentUser.uid),
    where("sticker.id", "==", normalizedStickerId)
  );

  const snapshot = await getDocs(collectionsQuery);

  return snapshot.docs
    .map(parseCollectionDocument)
    .filter((item) => !item.pastedAt)
    .sort((left, right) => {
      const leftDate = left.createdAt?.toMillis?.() ?? 0;
      const rightDate = right.createdAt?.toMillis?.() ?? 0;
      return rightDate - leftDate;
    });
};

type UseFindAvailableCollectionItemsByStickerOptions = Omit<UseQueryOptions<Collection[], Error>, "queryKey" | "queryFn">;

export function useFindAvailableCollectionItemsBySticker(
  stickerId: string,
  options?: UseFindAvailableCollectionItemsByStickerOptions
) {
  const normalizedStickerId = stickerId.trim();

  return useQuery({
    queryKey: findAvailableCollectionItemsByStickerQueryKeys.detail(normalizedStickerId),
    queryFn: () => findAvailableCollectionItemsByStickerService(normalizedStickerId),
    enabled: normalizedStickerId.length > 0,
    ...options
  });
}
