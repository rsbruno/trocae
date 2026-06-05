import type { StickerRarity, Collection } from "@/@types/collection";
import type { Sticker } from "@/@types/sticker";

export type CollectionStickerStatus = "missing" | "owned" | "pasted" | "repeated";

export type CollectionStickerSummary = {
  ownedCount: number;
  pastedCount: number;
  repeatedCount: number;
  rarity?: StickerRarity;
  status: CollectionStickerStatus;
};

export type CollectionCountryGroup = {
  key: string;
  team: Sticker["team"];
  stickers: Sticker[];
  ownedUniqueCount: number;
  pastedUniqueCount: number;
  repeatedCount: number;
  totalCount: number;
  progress: number;
};

export type CollectionOverview = {
  ownedUniqueCount: number;
  pastedUniqueCount: number;
  missingCount: number;
  repeatedCount: number;
  totalStickers: number;
  startedCountries: number;
  completedCountries: number;
  progress: number;
};

export function buildCollectionStickerSummary(items: Collection[]) {
  return items.reduce<Record<string, CollectionStickerSummary>>((acc, item) => {
    const stickerId = item.sticker.id;
    const current = acc[stickerId] ?? {
      status: "missing" as CollectionStickerStatus,
      repeatedCount: 0,
      pastedCount: 0,
      ownedCount: 0
    };

    const ownedCount = current.ownedCount + 1;
    const pastedCount = current.pastedCount + (item.pastedAt ? 1 : 0);
    const repeatedCount = Math.max(ownedCount - 1, 0);

    acc[stickerId] = {
      status: pastedCount > 0 ? "pasted" : repeatedCount > 0 ? "repeated" : "owned",
      rarity: current.rarity ?? item.stickerRarity,
      repeatedCount,
      pastedCount,
      ownedCount
    };

    return acc;
  }, {});
}

export function getCollectionStickerStatus(summary: CollectionStickerSummary | undefined): CollectionStickerStatus {
  return summary?.status ?? "missing";
}

export function getCollectionStickerLabel(summary: CollectionStickerSummary | undefined) {
  if (!summary) return "Faltando";
  if (summary.pastedCount > 0) return "Colada";
  if (summary.repeatedCount > 0) return `+${summary.repeatedCount} extra`;
  return "Tenho";
}

export function buildCollectionCountryGroups(stickers: Sticker[], summaries: Record<string, CollectionStickerSummary>) {
  const groups = stickers.reduce<Record<string, CollectionCountryGroup>>((acc, sticker) => {
    const key = sticker.team.fifaCode;
    const current = acc[key] ?? {
      pastedUniqueCount: 0,
      ownedUniqueCount: 0,
      team: sticker.team,
      repeatedCount: 0,
      totalCount: 0,
      stickers: [],
      progress: 0,
      key
    };

    current.stickers.push(sticker);
    acc[key] = current;

    return acc;
  }, {});

  return Object.values(groups)
    .map((group) => {
      const sortedStickers = [...group.stickers].sort((left, right) => left.order - right.order);
      const ownedUniqueCount = sortedStickers.filter((sticker) => (summaries[sticker.id]?.ownedCount ?? 0) > 0).length;
      const pastedUniqueCount = sortedStickers.filter((sticker) => (summaries[sticker.id]?.pastedCount ?? 0) > 0).length;
      const repeatedCount = sortedStickers.reduce((total, sticker) => total + (summaries[sticker.id]?.repeatedCount ?? 0), 0);
      const totalCount = sortedStickers.length;

      return {
        ...group,
        progress: totalCount > 0 ? (ownedUniqueCount / totalCount) * 100 : 0,
        stickers: sortedStickers,
        pastedUniqueCount,
        ownedUniqueCount,
        repeatedCount,
        totalCount
      };
    })
    .sort((left, right) => left.team.name.localeCompare(right.team.name, "pt-BR"));
}

export function filterMissingStickers(stickers: Sticker[], summaries: Record<string, CollectionStickerSummary>) {
  return stickers.filter((sticker) => (summaries[sticker.id]?.ownedCount ?? 0) === 0);
}

export function buildCollectionOverview(groups: CollectionCountryGroup[]): CollectionOverview {
  const totalStickers = groups.reduce((total, group) => total + group.totalCount, 0);
  const ownedUniqueCount = groups.reduce((total, group) => total + group.ownedUniqueCount, 0);
  const pastedUniqueCount = groups.reduce((total, group) => total + group.pastedUniqueCount, 0);
  const repeatedCount = groups.reduce((total, group) => total + group.repeatedCount, 0);

  return {
    completedCountries: groups.filter((group) => group.totalCount > 0 && group.ownedUniqueCount === group.totalCount).length,
    startedCountries: groups.filter((group) => group.ownedUniqueCount > 0).length,
    progress: totalStickers > 0 ? (ownedUniqueCount / totalStickers) * 100 : 0,
    missingCount: Math.max(totalStickers - ownedUniqueCount, 0),
    pastedUniqueCount,
    ownedUniqueCount,
    repeatedCount,
    totalStickers
  };
}
