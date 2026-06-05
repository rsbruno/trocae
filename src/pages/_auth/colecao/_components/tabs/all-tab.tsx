import { twMerge } from "tailwind-merge";

import {
  buildCollectionStickerSummary,
  buildCollectionCountryGroups,
  type CollectionStickerStatus,
  getCollectionStickerStatus,
  getCollectionStickerLabel
} from "@/helpers/colecao/collection-overview";
import { useFindAllCollectionItems } from "@/services/collections/find-all-collection-items.service";
import { EmptyStateContent, EmptyStateTitle, EmptyStateRoot } from "@/components/ui/empty-state";
import { CountryProgressHeader } from "@/components/v2026/countries/progress-header";
import { useFindAllStickers } from "@/services/stickers/find-all-stickers.service";
import { StickerInlineCard } from "@/components/v2026/stickers/inline";
import { ForEach } from "@/components/utils/foreach";
import { ShowIf } from "@/components/utils/show";

import { InventoryAllTabSkeleton } from "../skeleton/inventory-all-tab-skeleton";
import { InventoryStickerRow } from "../inventory-sticker-row";
import { InventoryTabError } from "../inventory-tab-error";

const stickerStatusClassName: Record<CollectionStickerStatus, string> = {
  repeated: "bg-accent-highlight/5",
  missing: "opacity-55 grayscale",
  pasted: "bg-status-success/5",
  owned: ""
};

const stickerStatusTextClassName: Record<CollectionStickerStatus, string> = {
  repeated: "text-accent-highlight/80",
  pasted: "text-status-success",
  owned: "text-accent-primary",
  missing: "text-ink-muted"
};

type InventoryAllTabProps = {
  search?: string;
};

export function InventoryAllTab({ search }: InventoryAllTabProps) {
  const { isFetching: stickersFetching, error: stickersError, data: stickers = [] } = useFindAllStickers({ search });
  const {
    isFetching: collectionFetching,
    data: collectionItems = [],
    error: collectionError
  } = useFindAllCollectionItems({ search });

  const summaries = buildCollectionStickerSummary(collectionItems);
  const groups = buildCollectionCountryGroups(stickers, summaries);
  const error = stickersError ?? collectionError;
  const isLoading = stickersFetching || collectionFetching;

  return (
    <div className="flex flex-col gap-4">
      <ShowIf if={isLoading}>
        <InventoryAllTabSkeleton />
      </ShowIf>

      <ShowIf if={Boolean(error) && !isLoading}>
        <InventoryTabError fallback="Não foi possível carregar a coleção completa." message={error?.message} />
      </ShowIf>

      <ShowIf if={!isLoading && !error && groups.length === 0}>
        <EmptyStateRoot>
          <EmptyStateContent>
            <EmptyStateTitle>Nenhuma figurinha encontrada</EmptyStateTitle>
          </EmptyStateContent>
        </EmptyStateRoot>
      </ShowIf>

      <ShowIf if={!isLoading && !error && groups.length > 0}>
        <ForEach items={groups}>
          {(group) => (
            <section className="flex flex-col gap-2" key={group.key}>
              <CountryProgressHeader
                currentCount={group.ownedUniqueCount}
                totalCount={group.totalCount}
                progress={group.progress}
                team={group.team}
              />

              <StickerInlineCard>
                <ForEach items={group.stickers}>
                  {(sticker) => {
                    const summary = summaries[sticker.id];
                    const status = getCollectionStickerStatus(summary);

                    return (
                      <InventoryStickerRow
                        rarityClassName={stickerStatusTextClassName[status]}
                        className={twMerge(stickerStatusClassName[status])}
                        showMissingIndicator={status === "missing"}
                        rarity={getCollectionStickerLabel(summary)}
                        sticker={sticker}
                        key={sticker.id}
                      />
                    );
                  }}
                </ForEach>
              </StickerInlineCard>
            </section>
          )}
        </ForEach>
      </ShowIf>
    </div>
  );
}
