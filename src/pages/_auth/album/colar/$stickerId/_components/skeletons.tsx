import { StickerRoot } from "@/components/v2026/stickers/normal";
import { SurfaceCardGhost } from "@/components/ui/surface-card";
import { ForEach } from "@/components/utils/foreach";
import { Skeleton } from "@/components/ui/skeleton";

export function PasteStickerInfoCardSkeleton() {
  return (
    <SurfaceCardGhost aria-label="Carregando informações da figurinha" aria-busy="true">
      <div className="flex items-center gap-4">
        <Skeleton className="size-14" tone="muted" rounded="lg" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-28" rounded="sm" tone="base" />
          <Skeleton className="h-3 w-36" tone="muted" rounded="sm" />
          <Skeleton className="h-3 w-32" tone="muted" rounded="sm" />
        </div>
      </div>
    </SurfaceCardGhost>
  );
}

export function PasteStickerGridSkeleton() {
  return (
    <div aria-label="Carregando figurinhas disponíveis" className="grid grid-cols-2 gap-1" aria-busy="true">
      <ForEach items={Array.from({ length: 4 })}>{(_, props) => <StickerRoot key={props?.index} size="album" loading />}</ForEach>
    </div>
  );
}
