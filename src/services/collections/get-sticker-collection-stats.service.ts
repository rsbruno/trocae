import { getCountFromServer, collection, query, where } from "firebase/firestore";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";

import type { CollectionStickerStats, StickerRarity } from "@/@types/collection";

import { getFirestoreClient } from "@/infra/firebase/client";
import { getFirebaseAuth } from "@/infra/firebase/auth";

export type GetCollectionStickerStatsInput = {
  stickerId: string;
  stickerRarity: StickerRarity;
};

type UseGetCollectionStickerStatsOptions = Omit<UseQueryOptions<CollectionStickerStats>, "queryKey" | "queryFn" | "enabled">;

export const getCollectionStickerStatsService = async ({
  stickerRarity,
  stickerId
}: GetCollectionStickerStatsInput): Promise<CollectionStickerStats> => {
  const auth = getFirebaseAuth();
  await auth.authStateReady();

  const currentUser = auth.currentUser;

  if (currentUser === null) {
    throw new Error("Sua sessão expirou. Entre novamente.");
  }

  const userId = currentUser.uid;
  const collectionsRef = collection(getFirestoreClient(), "collections");

  const exactMatchQuery = query(
    collectionsRef,
    where("userId", "==", userId),
    where("sticker.id", "==", stickerId),
    where("stickerRarity", "==", stickerRarity)
  );

  const byStickerIdQuery = query(collectionsRef, where("userId", "==", userId), where("sticker.id", "==", stickerId));

  const [exactMatchCount, byStickerIdCount] = await Promise.all([
    getCountFromServer(exactMatchQuery),
    getCountFromServer(byStickerIdQuery)
  ]);

  return {
    ownedCountByStickerId: byStickerIdCount.data().count,
    ownedCount: exactMatchCount.data().count
  };
};

export function useGetCollectionStickerStats(
  stickerId: string | undefined,
  stickerRarity: StickerRarity | undefined,
  options?: UseGetCollectionStickerStatsOptions
) {
  return useQuery({
    queryFn: () =>
      getCollectionStickerStatsService({
        stickerRarity: stickerRarity!,
        stickerId: stickerId!
      }),
    queryKey: ["use-get-collection-sticker-stats", stickerId, stickerRarity],
    enabled: Boolean(stickerId) && Boolean(stickerRarity),
    ...options
  });
}
