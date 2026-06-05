import { SurfaceCardGhost } from "@/components/ui/surface-card";
import { Skeleton } from "@/components/ui/skeleton";

import { AddStickerStatsMetricSkeleton } from "./stats-metric-skeleton";

export function AddStickerStatsBlockSkeleton() {
  return (
    <SurfaceCardGhost aria-label="Carregando estatísticas da coleção" className="flex flex-col gap-4 py-4" aria-busy="true">
      <Skeleton className="h-3.5 w-28" tone="muted" rounded="sm" />
      <div className="grid grid-cols-2 gap-2.5">
        <AddStickerStatsMetricSkeleton />
        <AddStickerStatsMetricSkeleton />
      </div>
      <Skeleton className="mx-auto h-3 w-44 max-w-full" tone="muted" rounded="sm" />
    </SurfaceCardGhost>
  );
}
