import { Fragment } from "react/jsx-runtime";

import { SurfaceCardGhost, SurfaceCardRoot } from "@/components/ui/surface-card";
import { StickerRoot } from "@/components/v2026/stickers/normal";
import { ForEach } from "@/components/utils/foreach";
import { Skeleton } from "@/components/ui/skeleton";

export function CountryPageHeaderSkeleton() {
  return (
    <div className="min-w-0 flex-1 space-y-2">
      <Skeleton className="h-4 w-28" tone="muted" rounded="sm" />
      <Skeleton className="h-3 w-40" tone="muted" rounded="sm" />
    </div>
  );
}

export function CountryTeamCardSkeleton() {
  return (
    <SurfaceCardRoot>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Skeleton className="size-14" tone="muted" rounded="lg" />
          <Skeleton className="absolute -right-1 -bottom-1 h-6 w-12" rounded="full" tone="muted" />
        </div>
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-28" rounded="sm" tone="base" />
          <Skeleton className="h-3 w-40" tone="muted" rounded="sm" />
          <div className="flex gap-3 pt-0.5">
            <Skeleton className="h-3 w-24" tone="muted" rounded="sm" />
            <Skeleton className="h-3 w-32" tone="muted" rounded="sm" />
          </div>
        </div>
        <Skeleton className="size-9" tone="muted" rounded="md" />
      </div>
    </SurfaceCardRoot>
  );
}

export function CountryStatsSkeleton() {
  return (
    <SurfaceCardGhost className="flex items-center justify-around py-5">
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

export function CountryStickersGridSkeleton() {
  return (
    <div aria-label="Carregando figurinhas do país" className="grid grid-cols-2 gap-1" aria-busy="true">
      <ForEach items={Array.from({ length: 4 })}>{(_, props) => <StickerRoot key={props?.index} size="album" loading />}</ForEach>
    </div>
  );
}

export function CountryCollectionsSkeleton() {
  return (
    <Fragment>
      <CountryStatsSkeleton />
      <CountryStickersGridSkeleton />
    </Fragment>
  );
}
