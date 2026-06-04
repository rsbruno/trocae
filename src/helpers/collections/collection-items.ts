import type { Collection } from "@/@types/collection";

import { normalize } from "@/helpers/strings";

export function buildAvailableStickerCounts(items: Collection[]) {
  return items.reduce<Record<string, number>>((acc, item) => {
    if (item.pastedAt) return acc;

    acc[item.sticker.id] = (acc[item.sticker.id] ?? 0) + 1;
    return acc;
  }, {});
}

export function filterCollectionItemsByCountry(items: Collection[], countryCode?: string) {
  if (!countryCode) return items;

  const normalizedCountry = normalize(countryCode);

  return items.filter((item) => {
    return normalize(item.sticker.team.fifaCode) === normalizedCountry || normalize(item.sticker.team.name) === normalizedCountry;
  });
}

export function buildRepeatedStickerCountByCountry(items: Collection[], countryCode?: string) {
  const countryItems = filterCollectionItemsByCountry(items, countryCode);
  const stickerCounts = countryItems.reduce<Record<string, number>>((acc, item) => {
    acc[item.sticker.id] = (acc[item.sticker.id] ?? 0) + 1;
    return acc;
  }, {});

  return Object.values(stickerCounts).reduce((total, count) => total + Math.max(count - 1, 0), 0);
}
