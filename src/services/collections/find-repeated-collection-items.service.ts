import { collection, getDocs, query, where } from "firebase/firestore";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";

import type { Collection } from "@/@types/collection";
import type { Sticker } from "@/@types/sticker";

import { type StickerSearchInput, matchesStickerSearch } from "@/helpers/stickers/search";
import { getFirestoreClient } from "@/infra/firebase/client";
import { getFirebaseAuth } from "@/infra/firebase/auth";

import { parseCollectionDocument } from "./find-all-collection-items.service";

export const findRepeatedCollectionItemsQueryKeys = {
  list: (input: StickerSearchInput = {}) =>
    input.search?.trim()
      ? ([...findRepeatedCollectionItemsQueryKeys.all(), input.search.trim()] as const)
      : findRepeatedCollectionItemsQueryKeys.all(),
  all: () => ["use-find-repeated-collection-items"] as const
};

export type RepeatedCollectionItem = {
  sticker: Sticker;
  stickerRarity: string;
  repeatedCount: number;
};

export const findRepeatedCollectionItemsService = async ({ search }: StickerSearchInput = {}): Promise<
  RepeatedCollectionItem[]
> => {
  const auth = getFirebaseAuth();
  await auth.authStateReady();

  const currentUser = auth.currentUser;

  if (currentUser === null) {
    throw new Error("Sua sessão expirou. Entre novamente.");
  }

  const collectionsRef = collection(getFirestoreClient(), "collections");
  const collectionsQuery = query(collectionsRef, where("userId", "==", currentUser.uid));

  const snapshot = await getDocs(collectionsQuery);
  const items = snapshot.docs
    .map(parseCollectionDocument)
    .filter((doc): doc is Collection => doc !== null)
    .filter((item) => matchesStickerSearch(item.sticker, search));

  const stickerMap = new Map<string, Collection[]>();

  for (const item of items) {
    const id = item.sticker.id;
    if (!stickerMap.has(id)) {
      stickerMap.set(id, []);
    }
    stickerMap.get(id)!.push(item);
  }

  const repeatedItems: RepeatedCollectionItem[] = [];

  for (const collections of stickerMap.values()) {
    if (collections.length > 1) {
      const reference = collections[0];
      repeatedItems.push({
        stickerRarity: reference.stickerRarity,
        repeatedCount: collections.length - 1,
        sticker: reference.sticker
      });
    }
  }

  repeatedItems.sort((a, b) => a.sticker.order - b.sticker.order || a.sticker.code.localeCompare(b.sticker.code));

  return repeatedItems;
};

export function useFindRepeatedCollectionItems(
  input: StickerSearchInput = {},
  options?: Omit<UseQueryOptions<RepeatedCollectionItem[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: findRepeatedCollectionItemsQueryKeys.list(input),
    queryFn: () => findRepeatedCollectionItemsService(input),
    ...options
  });
}
