import type { Collection } from "@/@types/collection";
import type { GroupedTeam } from "@/@types/team";

import { buildRepeatedStickerCountByCountry } from "@/helpers/collections/collection-items";

export const MAX_STICKERS_PER_TEAM = 20;

export type AlbumPastedStats = {
  byTeam: Record<string, number>;
  uniqueCount: number;
};

export function buildAlbumPastedStats(items: Collection[]): AlbumPastedStats {
  const uniqueStickerIds = new Set<string>();
  const byTeam = items.reduce<Record<string, number>>((acc, item) => {
    const teamId = item.sticker.team.id;
    acc[teamId] = (acc[teamId] ?? 0) + 1;
    uniqueStickerIds.add(item.sticker.id);
    return acc;
  }, {});

  return {
    uniqueCount: uniqueStickerIds.size,
    byTeam
  };
}

export function buildAlbumGlobalStats(groups: GroupedTeam[], collectionItems: Collection[], pastedUniqueCount: number) {
  const totalCountries = groups.reduce((total, group) => total + group.teams.length, 0);
  const totalStickers = totalCountries * MAX_STICKERS_PER_TEAM;

  return {
    progress: totalStickers > 0 ? (pastedUniqueCount / totalStickers) * 100 : 0,
    repeatedCount: buildRepeatedStickerCountByCountry(collectionItems),
    pastedUniqueCount,
    totalStickers
  };
}
