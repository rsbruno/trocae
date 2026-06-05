import { CheckCircleIcon, Trophy, Stack } from "@phosphor-icons/react";

import {
  buildCollectionStickerSummary,
  buildCollectionCountryGroups,
  buildCollectionOverview
} from "@/helpers/colecao/collection-overview";
import { useFindAllCollectionItems } from "@/services/collections/find-all-collection-items.service";
import { useFindAllStickers } from "@/services/stickers/find-all-stickers.service";
import { SurfaceCardGhost } from "@/components/ui/surface-card";
import { Typography } from "@/components/ui/typography";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ShowIf } from "@/components/utils/show";

export function CollectionSummary() {
  const { isFetching: stickersFetching, data: stickers = [] } = useFindAllStickers();
  const { isFetching: collectionFetching, data: collectionItems = [] } = useFindAllCollectionItems();

  const summaries = buildCollectionStickerSummary(collectionItems);
  const groups = buildCollectionCountryGroups(stickers, summaries);
  const overview = buildCollectionOverview(groups);
  const isLoading = stickersFetching || collectionFetching;

  return (
    <SurfaceCardGhost className="grid grid-cols-2 gap-3 p-3">
      <ShowIf if={isLoading}>
        <div className="col-span-2 flex items-center justify-between gap-3">
          <Skeleton className="h-4 w-24" tone="base" />
          <Skeleton className="h-3 w-28" tone="muted" />
        </div>
        <Skeleton className="col-span-2 h-[5px]" rounded="full" tone="muted" />
        <Skeleton className="h-10" rounded="md" tone="muted" />
        <Skeleton className="h-10" rounded="md" tone="muted" />
      </ShowIf>

      <ShowIf if={!isLoading}>
        <div className="col-span-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Trophy className="text-accent-primary" weight="duotone" size={18} />
            <Typography variant="semibold" color="base" as="span" size="sm">
              {Math.round(overview.progress)}% da copa
            </Typography>
          </div>
          <Typography variant="medium" color="subtle" as="span" size="xs">
            {overview.startedCountries}/{groups.length} países iniciados
          </Typography>
        </div>
        <Progress value={overview.progress} className="col-span-2" />
        <div className="flex items-center gap-2">
          <CheckCircleIcon className="text-status-success shrink-0" weight="duotone" size={17} />
          <div className="min-w-0">
            <Typography variant="semibold" className="block" color="base" as="span" size="sm">
              {overview.pastedUniqueCount}
            </Typography>
            <Typography className="block truncate" variant="medium" color="subtle" as="span" size="xs">
              coladas no álbum
            </Typography>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Stack className="text-accent-highlight shrink-0" weight="duotone" size={17} />
          <div className="min-w-0">
            <Typography variant="semibold" className="block" color="base" as="span" size="sm">
              {overview.completedCountries}
            </Typography>
            <Typography className="block truncate" variant="medium" color="subtle" as="span" size="xs">
              países completos
            </Typography>
          </div>
        </div>
      </ShowIf>
    </SurfaceCardGhost>
  );
}
