import { StickerIcon } from "@phosphor-icons/react";

import {
  StickerInlinePlayerName,
  StickerInlineTeamFlag,
  StickerInlineTeamName,
  StickerInlineContent,
  StickerInlineRarity,
  StickerInlineCard,
  StickerInlineCode,
  StickerInlineRoot,
  StickerInlineEnd
} from "@/components/v2026/stickers/inline";
import {
  EmptyStateDescription,
  EmptyStateContent,
  EmptyStateTitle,
  EmptyStateIcon,
  EmptyStateRoot
} from "@/components/ui/empty-state";
import { useFindAllCollectionItems } from "@/services/collections/find-all-collection-items.service";
import { InfiniteScroll } from "@/components/utils/infinite-scroll";
import { ForEach } from "@/components/utils/foreach";
import { ShowIf } from "@/components/utils/show";

import { InventoryStickerListItemSkeleton } from "../skeleton/inventory-sticker-list-item-skeleton";

export function InventoryStickersTab() {
  const collectionItems = useFindAllCollectionItems();
  const items = collectionItems.data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <InfiniteScroll
      fallback={
        <StickerInlineCard>
          <ForEach fallBack={<InventoryStickerListItemSkeleton />} fallbackRepeat={6} items={undefined} isLoading>
            {() => null}
          </ForEach>
        </StickerInlineCard>
      }
      isFetchingNextPage={collectionItems.isFetchingNextPage}
      fetchNextPage={collectionItems.fetchNextPage}
      hasNextPage={collectionItems.hasNextPage}
      isLoading={collectionItems.isLoading}
    >
      <ShowIf if={Boolean(collectionItems.error) && !collectionItems.isLoading}>
        <EmptyStateRoot className="py-8" tone="danger">
          <EmptyStateContent>
            <EmptyStateTitle className="text-status-danger">
              {collectionItems.error?.message ?? "Não foi possível carregar suas figurinhas."}
            </EmptyStateTitle>
          </EmptyStateContent>
        </EmptyStateRoot>
      </ShowIf>

      <ShowIf if={!collectionItems.isLoading && !collectionItems.error && items.length === 0}>
        <EmptyStateRoot>
          <EmptyStateIcon>
            <StickerIcon weight="duotone" />
          </EmptyStateIcon>
          <EmptyStateContent>
            <EmptyStateTitle>Nenhuma figurinha ainda</EmptyStateTitle>
            <EmptyStateDescription>Adicione figurinhas ao inventário para vê-las aqui</EmptyStateDescription>
          </EmptyStateContent>
        </EmptyStateRoot>
      </ShowIf>

      <ShowIf if={!collectionItems.isLoading && !collectionItems.error && items.length > 0}>
        <StickerInlineCard>
          <ForEach items={items}>
            {(item) => (
              <StickerInlineRoot rarity={item.stickerRarity} data={item.sticker}>
                <StickerInlineTeamFlag />
                <StickerInlineContent>
                  <StickerInlinePlayerName />
                  <StickerInlineTeamName />
                </StickerInlineContent>
                <StickerInlineEnd>
                  <StickerInlineCode />
                  <StickerInlineRarity />
                </StickerInlineEnd>
              </StickerInlineRoot>
            )}
          </ForEach>
        </StickerInlineCard>
      </ShowIf>
    </InfiniteScroll>
  );
}
