import { Skeleton } from "@/components/ui/skeleton";

type AddStickerStatsMetricSkeletonProps = {
  staggerIndex?: number;
};

export function AddStickerStatsMetricSkeleton({ staggerIndex = 0 }: AddStickerStatsMetricSkeletonProps) {
  const staggerClassName = staggerIndex === 0 ? "[animation-delay:0ms]" : "[animation-delay:120ms]";

  return (
    <div className="flex flex-col items-center gap-2.5 rounded-lg bg-white/[0.03] px-2 py-3.5 ring-1 ring-white/[0.06] ring-inset">
      <Skeleton className={`h-9 w-11 ${staggerClassName}`} tone="strong" rounded="sm" />
      <Skeleton className={`h-2.5 w-16 ${staggerClassName}`} tone="muted" rounded="sm" />
    </div>
  );
}
