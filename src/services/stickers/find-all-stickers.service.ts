import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";

import type { Sticker } from "@/@types/sticker";

import { type StickerSearchInput, filterStickersBySearch } from "@/helpers/stickers/search";
import { getFirestoreClient } from "@/infra/firebase/client";

export const findAllStickersQueryKeys = {
  list: (input: StickerSearchInput = {}) =>
    input.search?.trim() ? ([...findAllStickersQueryKeys.all(), input.search.trim()] as const) : findAllStickersQueryKeys.all(),
  all: () => ["use-find-all-stickers"] as const
};

export const findAllStickersService = async ({ search }: StickerSearchInput = {}): Promise<Sticker[]> => {
  const stickersRef = collection(getFirestoreClient(), "stickers");
  const stickersSnapshot = await getDocs(stickersRef);

  const stickers = stickersSnapshot.docs
    .map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: data.id ?? doc.id
      } as Sticker;
    })
    .sort((left, right) => left.order - right.order);

  return filterStickersBySearch(stickers, search);
};

export function useFindAllStickers(
  input: StickerSearchInput = {},
  options?: Omit<UseQueryOptions<Sticker[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: findAllStickersQueryKeys.list(input),
    queryFn: () => findAllStickersService(input),
    ...options
  });
}
