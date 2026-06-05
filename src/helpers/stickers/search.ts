import type { Sticker } from "@/@types/sticker";

import { normalize } from "@/helpers/strings";

export type StickerSearchInput = {
  search?: string;
};

export function matchesStickerSearch(sticker: Sticker, search: string | undefined) {
  const normalizedSearch = normalize(search ?? "");

  if (!normalizedSearch) return true;

  return [sticker.code, sticker.team.name, sticker.team.fifaCode].some((value) => normalize(value).includes(normalizedSearch));
}

export function filterStickersBySearch(stickers: Sticker[], search: string | undefined) {
  return stickers.filter((sticker) => matchesStickerSearch(sticker, search));
}
