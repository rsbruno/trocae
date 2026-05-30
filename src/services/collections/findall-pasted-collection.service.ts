import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";

import type { Collection } from "@/@types/collection";

import { getFirestoreClient } from "@/infra/firebase/client";
import { getFirebaseAuth } from "@/infra/firebase/auth";

export const findAllPastedCollectionService = async (): Promise<Collection[]> => {
  const auth = getFirebaseAuth();
  await auth.authStateReady();

  const currentUser = auth.currentUser;

  if (currentUser === null) {
    throw new Error("Sua sessão expirou. Entre novamente.");
  }

  const collectionsRef = collection(getFirestoreClient(), "collections");
  const collectionsQuery = query(collectionsRef, where("userId", "==", currentUser.uid), where("pastedAt", "!=", null));

  const snapshot = await getDocs(collectionsQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as unknown as Collection[];
};

export function useFindAllPastedCollection<TData = Collection[]>(
  options?: Omit<UseQueryOptions<Collection[], Error, TData>, "queryKey" | "queryFn">
) {
  return useQuery<Collection[], Error, TData>({
    queryKey: ["use-find-all-pasted-stickers"],
    queryFn: findAllPastedCollectionService,
    ...options
  });
}
