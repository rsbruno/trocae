import type { Collection } from "@/@types/collection";

export type PastedStickerSummary = {
  stickerId: string;
  repeatedCount: number;
};

export function buildPastedStickerSummaries(items: Collection[]) {
  return items.reduce<Record<string, PastedStickerSummary>>((acc, item) => {
    const current = acc[item.sticker.id];

    if (!current) {
      acc[item.sticker.id] = {
        stickerId: item.sticker.id,
        repeatedCount: 1
      };
      return acc;
    }

    current.repeatedCount += 1;
    return acc;
  }, {});
}
