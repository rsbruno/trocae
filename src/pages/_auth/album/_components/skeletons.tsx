import { SurfaceCardGhost, SurfaceCardRoot } from "@/components/ui/surface-card";
import { ForEach } from "@/components/utils/foreach";
import { Skeleton } from "@/components/ui/skeleton";

export function AlbumStatsSkeleton() {
  return (
    <SurfaceCardGhost
      className="flex items-center justify-around py-5"
      aria-label="Carregando estatísticas do álbum"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-1">
        <Skeleton className="size-[52px]" rounded="full" tone="base" />
        <Skeleton className="h-3 w-12" tone="muted" rounded="sm" />
      </div>
      <div className="bg-border h-10 w-px" />
      <div className="text-center">
        <Skeleton className="mx-auto h-6 w-10" tone="strong" rounded="sm" />
        <Skeleton className="mt-1 h-3 w-14" tone="muted" rounded="sm" />
      </div>
      <div className="bg-border h-10 w-px" />
      <div className="text-center">
        <Skeleton className="mx-auto h-6 w-10" tone="strong" rounded="sm" />
        <Skeleton className="mt-1 h-3 w-14" tone="muted" rounded="sm" />
      </div>
      <div className="bg-border h-10 w-px" />
      <div className="text-center">
        <Skeleton className="mx-auto h-6 w-10" tone="strong" rounded="sm" />
        <Skeleton className="mt-1 h-3 w-14" tone="muted" rounded="sm" />
      </div>
    </SurfaceCardGhost>
  );
}

export function AlbumGroupsSkeleton() {
  return (
    <div aria-label="Carregando seleções" className="flex flex-col gap-4" aria-busy="true">
      <ForEach items={Array.from({ length: 3 })}>
        {(_, props) => (
          <SurfaceCardRoot className="overflow-hidden p-0" key={props?.index}>
            <div className="border-b border-white/6 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-4 w-20" tone="base" />
                <Skeleton className="h-3 w-12" tone="muted" />
              </div>
              <Skeleton className="mt-2 h-3 w-16" tone="muted" />
            </div>
            <ForEach items={Array.from({ length: 4 })}>
              {(_, rowProps) => (
                <div
                  className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto_auto] items-center gap-3 px-4 py-3.5"
                  key={rowProps?.index}
                >
                  <Skeleton className="size-8 shrink-0" tone="muted" rounded="md" />
                  <Skeleton className="h-3.5 min-w-0" tone="base" />
                  <Skeleton className="h-3 w-10" tone="muted" />
                  <Skeleton className="h-1.5 w-14" rounded="full" tone="muted" />
                  <Skeleton className="size-3.5 shrink-0" tone="muted" rounded="sm" />
                </div>
              )}
            </ForEach>
          </SurfaceCardRoot>
        )}
      </ForEach>
    </div>
  );
}
