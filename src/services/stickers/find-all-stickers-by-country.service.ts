import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";

import type { Sticker } from "@/@types/sticker";

import { getFirestoreClient } from "@/infra/firebase/client";
import { normalize } from "@/helpers/strings";

export const findAllStickersByCountryService = async (countryCode: string): Promise<Sticker[]> => {
  const normalizedCountry = normalize(countryCode);

  const stickersRef = collection(getFirestoreClient(), "stickers");

  const stickersSnapshot =
    normalizedCountry.length === 3
      ? await getDocs(query(stickersRef, where("team.fifaCode", "==", normalizedCountry.toUpperCase())))
      : await getDocs(stickersRef);

  const stickers = stickersSnapshot.docs
    .map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: data.id ?? doc.id
      } as Sticker;
    })
    .filter((sticker) => {
      return normalize(sticker.team.fifaCode) === normalizedCountry || normalize(sticker.team.name) === normalizedCountry;
    });

  return stickers.sort((left, right) => left.order - right.order);
};

type UseFindAllStickersByCountryOptions = Omit<UseQueryOptions<Sticker[], Error, Sticker[]>, "queryKey" | "queryFn">;

export function useFindAllStickersByCountry(countryCode: string, options?: UseFindAllStickersByCountryOptions) {
  const normalizedCountry = countryCode.trim();

  return useQuery({
    queryFn: () => findAllStickersByCountryService(normalizedCountry),
    queryKey: ["use-find-all-stickers-by-country", normalizedCountry],
    ...options
  });
}
