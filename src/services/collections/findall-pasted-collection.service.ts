import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";

import type { Collection } from "@/@types/collection";

import { getFirestoreClient } from "@/infra/firebase/client";
import { getFirebaseAuth } from "@/infra/firebase/auth";
import { normalize } from "@/helpers/strings";

export type FindAllPastedCollectionInput = {
  countryCode?: string;
};

export const findAllPastedCollectionService = async ({ countryCode }: FindAllPastedCollectionInput = {}): Promise<
  Collection[]
> => {
  const auth = getFirebaseAuth();
  await auth.authStateReady();

  const currentUser = auth.currentUser;

  if (currentUser === null) throw new Error("Sua sessão expirou. Entre novamente.");

  const collectionsRef = collection(getFirestoreClient(), "collections");
  const collectionsQuery = query(collectionsRef, where("userId", "==", currentUser.uid), where("pastedAt", "!=", null));

  const snapshot = await getDocs(collectionsQuery);
  const items = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: data.id ?? doc.id
    } as Collection;
  });

  if (!countryCode) return items.sort((left, right) => left.sticker.order - right.sticker.order);

  const normalizedCountry = normalize(countryCode);

  return items
    .filter((item) => {
      return (
        normalize(item.sticker.team.fifaCode) === normalizedCountry || normalize(item.sticker.team.name) === normalizedCountry
      );
    })
    .sort((left, right) => left.sticker.order - right.sticker.order);
};

export function useFindAllPastedCollection<TData = Collection[]>(
  countryCode?: string,
  options?: Omit<UseQueryOptions<Collection[], Error, TData>, "queryKey" | "queryFn">
) {
  return useQuery<Collection[], Error, TData>({
    queryKey: ["use-find-all-pasted-stickers", countryCode ?? null],
    queryFn: () => findAllPastedCollectionService({ countryCode }),
    ...options
  });
}
