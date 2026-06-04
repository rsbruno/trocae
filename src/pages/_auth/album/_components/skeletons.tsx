import { SurfaceCardGhost } from "@/components/ui/surface-card";
import { GroupListRoot } from "@/components/v2026/groups/list";
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
    <div aria-label="Carregando seleções" className="flex flex-col gap-7" aria-busy="true">
      <ForEach items={Array.from({ length: 3 })}>{(_, props) => <GroupListRoot key={props?.index} skeleton />}</ForEach>
    </div>
  );
}
