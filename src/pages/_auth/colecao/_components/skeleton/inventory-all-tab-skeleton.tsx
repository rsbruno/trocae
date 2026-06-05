import { StickerInlineCard } from "@/components/v2026/stickers/inline";
import { ForEach } from "@/components/utils/foreach";
import { Skeleton } from "@/components/ui/skeleton";

import { InventoryStickerListItemSkeleton } from "./inventory-sticker-list-item-skeleton";

export function InventoryAllTabSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <ForEach items={Array.from({ length: 3 })}>
        {(_, sectionProps) => (
          <section className="flex flex-col gap-2" key={sectionProps?.index}>
            <div className="flex items-center gap-3 px-1">
              <Skeleton className="size-9 shrink-0" rounded="md" tone="muted" />
              <div className="min-w-0 flex-1">
                <Skeleton className="mb-2 h-4 w-28" tone="base" />
                <Skeleton className="h-2 w-full" tone="muted" />
              </div>
              <Skeleton className="h-4 w-12" tone="muted" />
            </div>

            <StickerInlineCard>
              <ForEach items={Array.from({ length: 4 })}>
                {(_, itemProps) => <InventoryStickerListItemSkeleton key={itemProps?.index} />}
              </ForEach>
            </StickerInlineCard>
          </section>
        )}
      </ForEach>
    </div>
  );
}
