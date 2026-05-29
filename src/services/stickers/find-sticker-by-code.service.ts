import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";

import type { Sticker } from "@/@types/sticker";

import { STICKER_CODE_LENGTH } from "@/schemas/zod/add-sticker";
import { getFirestoreClient } from "@/infra/firebase/client";

type UseFindStickerByCodeOptions = Omit<
  UseQueryOptions<Sticker | null, Error, Sticker | null>,
  "queryKey" | "queryFn" | "enabled"
>;

export const findStickerByCodeService = async (code: string): Promise<Sticker | null> => {
  const stickerSnapshot = await getDocs(
    query(collection(getFirestoreClient(), "stickers"), where("code", "==", code.trim().toUpperCase()), limit(1))
  );
  if (stickerSnapshot.empty) return null;

  const stickerDoc = stickerSnapshot.docs[0];

  return stickerDoc.data() as unknown as Sticker;
};

export function useFindStickerByCode(code: string, options?: UseFindStickerByCodeOptions) {
  const normalizedCode = code.trim().toUpperCase();

  return useQuery({
    queryFn: () => findStickerByCodeService(normalizedCode),
    queryKey: ["use-find-sticker-by-code", normalizedCode],
    enabled: normalizedCode.length === STICKER_CODE_LENGTH,
    ...options
  });
}
