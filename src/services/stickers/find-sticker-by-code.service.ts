import { type DocumentReference, collection, getDocs, getDoc, limit, query, where, doc } from "firebase/firestore";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";

import type { PlayerPosition, StickerRarity, StickerType, Sticker } from "@/@types/sticker";
import type { Team } from "@/@types/team";

import { getFirestoreClient } from "@/infra/firebase/client";

export type StickerWithTeam = {
  sticker: Sticker;
  team: Pick<Team, "id" | "name" | "fifaCode" | "flag" | "primaryColor" | "secondaryColor">;
};

type UseFindStickerByCodeOptions = Omit<
  UseQueryOptions<StickerWithTeam | null, Error, StickerWithTeam | null>,
  "queryKey" | "queryFn" | "enabled"
>;

const stickerTypes: StickerType[] = ["badge", "team", "player"];
const stickerRarities: StickerRarity[] = ["common", "normal", "bronze", "silver", "gold"];
const playerPositions: PlayerPosition[] = ["", "GK", "CB", "RB", "LB", "CM", "CDM", "CAM", "RW", "LW", "ST", "CF"];

function isStickerType(value: unknown): value is StickerType {
  return typeof value === "string" && stickerTypes.some((type) => type === value);
}

function isStickerRarity(value: unknown): value is StickerRarity {
  return typeof value === "string" && stickerRarities.some((rarity) => rarity === value);
}

function isPlayerPosition(value: unknown): value is PlayerPosition {
  return typeof value === "string" && playerPositions.some((position) => position === value);
}

function isDocumentReference(value: unknown): value is DocumentReference {
  return (
    typeof value === "object" &&
    value !== null &&
    "path" in value &&
    typeof value.path === "string" &&
    "id" in value &&
    typeof value.id === "string" &&
    "firestore" in value
  );
}

function resolveTeamRef(teamRef: unknown): DocumentReference {
  if (typeof teamRef === "string" && teamRef.length > 0) {
    return doc(getFirestoreClient(), "teams", teamRef);
  }

  if (isDocumentReference(teamRef)) {
    return teamRef;
  }

  throw new Error("Referência do time da figurinha inválida.");
}

function mapTeamSnapshot(id: string, data: Record<string, unknown>): StickerWithTeam["team"] {
  return {
    secondaryColor: typeof data.secondaryColor === "string" ? data.secondaryColor : "",
    primaryColor: typeof data.primaryColor === "string" ? data.primaryColor : "",
    fifaCode: typeof data.fifaCode === "string" ? data.fifaCode : "",
    name: typeof data.name === "string" ? data.name : "",
    flag: typeof data.flag === "string" ? data.flag : "",
    id
  };
}

function mapStickerSnapshot(id: string, data: Record<string, unknown>): Sticker {
  const teamRef = resolveTeamRef(data.teamRef);

  if (!isStickerType(data.type)) {
    throw new Error("Tipo da figurinha inválido.");
  }

  if (!isStickerRarity(data.rarity)) {
    throw new Error("Raridade da figurinha inválida.");
  }

  if (!isPlayerPosition(data.playerPosition)) {
    throw new Error("Posição do jogador inválida.");
  }

  return {
    currentClubCountryCode: typeof data.currentClubCountryCode === "string" ? data.currentClubCountryCode : "",
    currentClub: typeof data.currentClub === "string" ? data.currentClub : "",
    playerName: typeof data.playerName === "string" ? data.playerName : "",
    birthDate: typeof data.birthDate === "string" ? data.birthDate : "",
    number: typeof data.number === "number" ? data.number : 0,
    weight: typeof data.weight === "number" ? data.weight : 0,
    height: typeof data.height === "number" ? data.height : 0,
    code: typeof data.code === "string" ? data.code : "",
    name: typeof data.name === "string" ? data.name : "",
    playerPosition: data.playerPosition,
    rarity: data.rarity,
    type: data.type,
    teamRef,
    id
  };
}

export const findStickerByCodeService = async (code: string): Promise<StickerWithTeam | null> => {
  const normalizedCode = code.trim().toUpperCase();

  if (!normalizedCode) {
    return null;
  }

  const snapshot = await getDocs(
    query(collection(getFirestoreClient(), "stickers"), where("code", "==", normalizedCode), limit(1))
  );

  if (snapshot.empty) {
    return null;
  }

  const stickerDoc = snapshot.docs[0];
  const stickerData = stickerDoc.data();

  if (!stickerData) {
    return null;
  }

  const sticker = mapStickerSnapshot(stickerDoc.id, stickerData);
  const teamSnapshot = await getDoc(sticker.teamRef);

  if (!teamSnapshot.exists()) {
    throw new Error("Time da figurinha não encontrado.");
  }

  const teamRecord = teamSnapshot.data();

  if (!teamRecord) {
    throw new Error("Time da figurinha não encontrado.");
  }

  return {
    team: mapTeamSnapshot(teamSnapshot.id, teamRecord),
    sticker
  };
};

export function useFindStickerByCode(code: string, options?: UseFindStickerByCodeOptions) {
  const normalizedCode = code.trim().toUpperCase();

  return useQuery({
    queryFn: () => findStickerByCodeService(normalizedCode),
    queryKey: ["use-find-sticker-by-code", normalizedCode],
    enabled: normalizedCode.length >= 2,
    ...options
  });
}
