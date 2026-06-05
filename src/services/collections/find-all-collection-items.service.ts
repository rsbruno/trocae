import { type QueryDocumentSnapshot, type DocumentData, collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";

import type { Collection } from "@/@types/collection";

import { type StickerSearchInput, matchesStickerSearch } from "@/helpers/stickers/search";
import { getFirestoreClient } from "@/infra/firebase/client";
import { getFirebaseAuth } from "@/infra/firebase/auth";

export const findAllCollectionItemsQueryKeys = {
  list: (input: StickerSearchInput = {}) =>
    input.search?.trim()
      ? ([...findAllCollectionItemsQueryKeys.all(), input.search.trim()] as const)
      : findAllCollectionItemsQueryKeys.all(),
  all: () => ["use-find-all-collection-items"] as const
};

export function parseCollectionDocument(document: QueryDocumentSnapshot<DocumentData>): Collection {
  const data = document.data();

  return {
    ...data,
    id: data.id ?? document.id
  } as Collection;
}

export const findAllCollectionItemsService = async ({ search }: StickerSearchInput = {}): Promise<Collection[]> => {
  const auth = getFirebaseAuth();
  await auth.authStateReady();

  const currentUser = auth.currentUser;

  if (currentUser === null) {
    throw new Error("Sua sessão expirou. Entre novamente.");
  }

  const collectionsRef = collection(getFirestoreClient(), "collections");
  const collectionsQuery = query(collectionsRef, where("userId", "==", currentUser.uid), orderBy("createdAt", "desc"));

  const snapshot = await getDocs(collectionsQuery);
  const items = snapshot.docs.map(parseCollectionDocument);

  return items.filter((item) => matchesStickerSearch(item.sticker, search));
};

export function useFindAllCollectionItems(
  input: StickerSearchInput = {},
  options?: Omit<UseQueryOptions<Collection[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: findAllCollectionItemsQueryKeys.list(input),
    queryFn: () => findAllCollectionItemsService(input),
    ...options
  });
}
