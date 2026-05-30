import { Skeleton } from "@/components/ui/skeleton";

export function InventoryStickerListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <Skeleton className="size-10 shrink-0" rounded="md" tone="muted" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Skeleton className="h-3.5 w-2/3" tone="base" />
        <Skeleton className="h-3 w-1/2" tone="muted" />
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <Skeleton className="h-3 w-16" tone="muted" />
        <Skeleton className="h-3 w-10" tone="muted" />
      </div>
    </div>
  );
}
