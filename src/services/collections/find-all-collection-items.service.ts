import {
  type QueryDocumentSnapshot,
  type DocumentData,
  collection,
  startAfter,
  Timestamp,
  getDocs,
  orderBy,
  limit,
  query,
  where
} from "firebase/firestore";
import { type UseInfiniteQueryOptions, type InfiniteData, useInfiniteQuery } from "@tanstack/react-query";

import type { PlayerPosition, StickerType, Sticker } from "@/@types/sticker";
import type { StickerRarity, Collection } from "@/@types/collection";

import { getFirestoreClient } from "@/infra/firebase/client";
import { getFirebaseAuth } from "@/infra/firebase/auth";

const COLLECTION_ITEMS_PAGE_SIZE = 20;

export type CollectionItemsPage = {
  items: Collection[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
};

type CollectionItemsPageParam = QueryDocumentSnapshot<DocumentData> | undefined;

type UseFindAllCollectionItemsOptions = Omit<
  UseInfiniteQueryOptions<
    CollectionItemsPage,
    Error,
    InfiniteData<CollectionItemsPage>,
    readonly unknown[],
    CollectionItemsPageParam
  >,
  "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
>;

function isStickerRarity(value: unknown): value is StickerRarity {
  return value === "common" || value === "normal" || value === "bronze" || value === "silver" || value === "gold";
}

function isStickerType(value: unknown): value is StickerType {
  return value === "badge" || value === "team" || value === "player";
}

function isPlayerPosition(value: unknown): value is PlayerPosition {
  return (
    value === "GK" ||
    value === "CB" ||
    value === "RB" ||
    value === "LB" ||
    value === "CM" ||
    value === "CDM" ||
    value === "CAM" ||
    value === "RW" ||
    value === "LW" ||
    value === "ST" ||
    value === "CF"
  );
}

function parseSticker(value: unknown): Sticker | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  if (
    !("id" in value) ||
    !("order" in value) ||
    !("code" in value) ||
    !("type" in value) ||
    !("player" in value) ||
    !("team" in value) ||
    !("currentTeam" in value) ||
    typeof value.id !== "string" ||
    typeof value.order !== "number" ||
    typeof value.code !== "string" ||
    !isStickerType(value.type) ||
    !value.player ||
    typeof value.player !== "object" ||
    !value.team ||
    typeof value.team !== "object" ||
    !value.currentTeam ||
    typeof value.currentTeam !== "object"
  ) {
    return null;
  }

  const player = value.player;
  const team = value.team;
  const currentTeam = value.currentTeam;

  if (
    !("name" in player) ||
    !("birthDate" in player) ||
    !("position" in player) ||
    !("weight" in player) ||
    !("height" in player) ||
    typeof player.name !== "string" ||
    typeof player.birthDate !== "string" ||
    !isPlayerPosition(player.position) ||
    typeof player.weight !== "number" ||
    typeof player.height !== "number" ||
    !("id" in team) ||
    !("name" in team) ||
    !("fifaCode" in team) ||
    !("flag" in team) ||
    !("primaryColor" in team) ||
    !("secondaryColor" in team) ||
    !("groupCode" in team) ||
    typeof team.id !== "string" ||
    typeof team.name !== "string" ||
    typeof team.fifaCode !== "string" ||
    typeof team.flag !== "string" ||
    typeof team.primaryColor !== "string" ||
    typeof team.secondaryColor !== "string" ||
    typeof team.groupCode !== "string" ||
    !("name" in currentTeam) ||
    !("fifaCode" in currentTeam) ||
    typeof currentTeam.name !== "string" ||
    typeof currentTeam.fifaCode !== "string"
  ) {
    return null;
  }

  return {
    team: {
      secondaryColor: team.secondaryColor,
      primaryColor: team.primaryColor,
      groupCode: team.groupCode,
      fifaCode: team.fifaCode,
      name: team.name,
      flag: team.flag,
      id: team.id
    },
    player: {
      birthDate: player.birthDate,
      position: player.position,
      weight: player.weight,
      height: player.height,
      name: player.name
    },
    currentTeam: {
      fifaCode: currentTeam.fifaCode,
      name: currentTeam.name
    },
    order: value.order,
    code: value.code,
    type: value.type,
    id: value.id
  };
}

function parseCollectionDocument(document: QueryDocumentSnapshot<DocumentData>): Collection | null {
  const data = document.data();

  if (
    !data ||
    !(data.createdAt instanceof Timestamp) ||
    typeof data.id !== "string" ||
    typeof data.userId !== "string" ||
    !isStickerRarity(data.stickerRarity)
  ) {
    return null;
  }

  const sticker = parseSticker(data.sticker);

  if (!sticker) {
    return null;
  }

  return {
    stickerRarity: data.stickerRarity,
    createdAt: data.createdAt,
    userId: data.userId,
    id: data.id,
    sticker
  };
}

export const findAllCollectionItemsService = async (cursor?: CollectionItemsPageParam): Promise<CollectionItemsPage> => {
  const auth = getFirebaseAuth();
  await auth.authStateReady();

  const currentUser = auth.currentUser;

  if (currentUser === null) {
    throw new Error("Sua sessão expirou. Entre novamente.");
  }

  const collectionsRef = collection(getFirestoreClient(), "collections");
  const collectionsQuery = cursor
    ? query(
        collectionsRef,
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc"),
        startAfter(cursor),
        limit(COLLECTION_ITEMS_PAGE_SIZE)
      )
    : query(
        collectionsRef,
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc"),
        limit(COLLECTION_ITEMS_PAGE_SIZE)
      );

  const snapshot = await getDocs(collectionsQuery);
  const items = snapshot.docs.flatMap((document) => {
    const collectionItem = parseCollectionDocument(document);

    return collectionItem ? [collectionItem] : [];
  });

  const lastDocument = snapshot.docs.at(-1);

  return {
    lastDoc: snapshot.docs.length === COLLECTION_ITEMS_PAGE_SIZE && lastDocument ? lastDocument : null,
    items
  };
};

export function useFindAllCollectionItems(options?: UseFindAllCollectionItemsOptions) {
  return useInfiniteQuery({
    queryFn: ({ pageParam }) => findAllCollectionItemsService(pageParam),
    getNextPageParam: (lastPage) => lastPage.lastDoc ?? undefined,
    queryKey: ["use-find-all-collection-items"],
    initialPageParam: undefined,
    ...options
  });
}
