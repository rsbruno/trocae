import type { Timestamp } from "firebase/firestore";

import { serverTimestamp, runTransaction, collection, getDocs, getDoc, query, where, doc } from "firebase/firestore";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";

import type { Collection } from "@/@types/collection";

import { getFirestoreClient } from "@/infra/firebase/client";
import { getFirebaseAuth } from "@/infra/firebase/auth";

export type PasteCollectionItemInput = {
  collectionId: string;
  collectionItem?: Collection;
  stickerId: string;
};

export type OptimisticPasteCollectionContext = {
  previousAvailableItems?: Collection[];
  previousCollectionItems?: Collection[];
  previousPastedQueries: Array<[readonly unknown[], Collection[] | undefined]>;
};

type UsePasteCollectionItemOptions<TContext = unknown> = Omit<
  UseMutationOptions<Collection, Error, PasteCollectionItemInput, TContext>,
  "mutationFn"
>;

export function removePastedCollectionItemFromAvailableCache(items: Collection[] | undefined, selectedItem: Collection) {
  return items?.filter((item) => item.id !== selectedItem.id) ?? [];
}

export function pasteCollectionItemInCollectionCache(
  items: Collection[] | undefined,
  selectedItem: Collection,
  pastedAt: Timestamp
) {
  if (!items) return items;

  return items.map((item) => {
    if (item.sticker.id !== selectedItem.sticker.id) return item;
    if (item.id === selectedItem.id) return { ...item, pastedAt };
    return { ...item, pastedAt: undefined };
  });
}

export function pasteCollectionItemInPastedCache(items: Collection[] | undefined, selectedItem: Collection, pastedAt: Timestamp) {
  const nextItem = { ...selectedItem, pastedAt };
  const currentItems = items ?? [];

  return [...currentItems.filter((item) => item.sticker.id !== selectedItem.sticker.id), nextItem].sort(
    (left, right) => left.sticker.order - right.sticker.order
  );
}

export const pasteCollectionItemService = async ({ collectionId, stickerId }: PasteCollectionItemInput): Promise<Collection> => {
  const auth = getFirebaseAuth();
  await auth.authStateReady();

  const currentUser = auth.currentUser;

  if (currentUser === null) throw new Error("Sua sessão expirou. Entre novamente.");

  const db = getFirestoreClient();
  const targetRef = doc(db, "collections", collectionId);
  const pastedQuery = query(
    collection(db, "collections"),
    where("userId", "==", currentUser.uid),
    where("sticker.id", "==", stickerId)
  );

  const pastedSnapshot = await getDocs(pastedQuery);
  const pastedRefs = pastedSnapshot.docs
    .filter((pastedDoc) => {
      const data = pastedDoc.data() as Collection;
      return Boolean(data.pastedAt);
    })
    .map((pastedDoc) => pastedDoc.ref);

  await runTransaction(db, async (transaction) => {
    const targetSnapshot = await transaction.get(targetRef);

    if (!targetSnapshot.exists()) {
      throw new Error("Figurinha não encontrada na sua coleção.");
    }

    const targetData = targetSnapshot.data() as Collection;

    if (targetData.userId !== currentUser.uid || targetData.sticker.id !== stickerId) {
      throw new Error("Essa figurinha não pertence a esta posição do álbum.");
    }

    if (targetData.pastedAt) {
      return;
    }

    const currentPastedSnapshots = await Promise.all(pastedRefs.map((pastedRef) => transaction.get(pastedRef)));

    currentPastedSnapshots.forEach((currentPastedSnapshot) => {
      if (!currentPastedSnapshot.exists() || currentPastedSnapshot.id === collectionId) return;

      const currentPastedData = currentPastedSnapshot.data() as Collection;

      if (currentPastedData.userId === currentUser.uid && currentPastedData.sticker.id === stickerId) {
        transaction.update(currentPastedSnapshot.ref, { pastedAt: null });
      }
    });

    transaction.update(targetRef, { pastedAt: serverTimestamp() });
  });

  const updatedSnapshot = await getDoc(targetRef);

  if (!updatedSnapshot.exists()) throw new Error("Não foi possível confirmar a figurinha colada.");

  const updatedData = updatedSnapshot.data();

  return {
    ...updatedData,
    id: updatedData.id ?? updatedSnapshot.id
  } as Collection;
};

export function usePasteCollectionItemService<TContext = unknown>(options?: UsePasteCollectionItemOptions<TContext>) {
  return useMutation<Collection, Error, PasteCollectionItemInput, TContext>({
    mutationFn: pasteCollectionItemService,
    ...options
  });
}
