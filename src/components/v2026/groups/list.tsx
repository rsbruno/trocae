import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { CaretRightIcon } from "@phosphor-icons/react";
import { twMerge } from "tailwind-merge";

import { ProgressIndicator, ProgressTrack, Progress } from "@/components/ui/progress";
import { Typography } from "@/components/ui/typography";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export interface GroupListRootProps extends ComponentPropsWithoutRef<"section"> {
  children?: ReactNode;
  skeleton?: boolean;
}
export function GroupListRoot({ skeleton = false, className, children, ...props }: GroupListRootProps) {
  if (skeleton) {
    return (
      <section className={twMerge("", className)} data-slot="group-list-root" aria-busy="true" {...props}>
        <Skeleton className="mb-3 h-3 w-16" tone="muted" rounded="sm" />
        <GroupListContent skeleton />
      </section>
    );
  }

  return (
    <section className={twMerge("", className)} data-slot="group-list-root" {...props}>
      {children}
    </section>
  );
}

export interface GroupListHeaderProps extends Omit<ComponentPropsWithoutRef<"p">, "color"> {
  children: ReactNode;
}
export function GroupListHeader({ className, children, ...props }: GroupListHeaderProps) {
  return (
    <Typography
      className={twMerge("mb-3 tracking-[0.08em] uppercase", className)}
      data-slot="group-list-header"
      variant="medium"
      color="accent"
      size="xs"
      as="p"
      {...props}
    >
      {children}
    </Typography>
  );
}

export interface GroupListContentProps extends ComponentPropsWithoutRef<"div"> {
  skeletonCount?: number;
  children?: ReactNode;
  skeleton?: boolean;
}
export function GroupListContent({ skeletonCount = 4, skeleton = false, className, children, ...props }: GroupListContentProps) {
  return (
    <Card
      className={twMerge("flex flex-col divide-y divide-white/6 overflow-hidden p-0", className)}
      data-slot="group-list-content"
      {...props}
    >
      {skeleton ? Array.from({ length: skeletonCount }).map((_, i) => <GroupListItemRoot skeleton key={i} />) : children}
    </Card>
  );
}

export interface GroupListItemRootProps extends ComponentPropsWithoutRef<"button"> {
  type?: "button" | "submit" | "reset";
  children?: ReactNode;
  skeleton?: boolean;
}
export function GroupListItemRoot({ skeleton = false, type = "button", className, children, ...props }: GroupListItemRootProps) {
  if (skeleton) {
    return (
      <div className="flex items-center gap-3 px-4 py-3.5" data-slot="group-list-item-root" aria-hidden="true">
        <Skeleton className="size-8 shrink-0" tone="muted" rounded="md" />
        <Skeleton className="h-3 flex-1" tone="muted" rounded="sm" />
        <Skeleton className="h-3 w-8" tone="muted" rounded="sm" />
        <Skeleton className="h-1.5 w-14" rounded="full" tone="muted" />
        <Skeleton className="size-3.5 shrink-0" tone="muted" rounded="sm" />
      </div>
    );
  }

  return (
    <button
      className={twMerge("flex items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-white/4", className)}
      data-slot="group-list-item-root"
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

export function GroupListItemFlag({ className, ...props }: ComponentPropsWithoutRef<"img">) {
  return (
    <span className="size-8 overflow-hidden rounded-md">
      <img className={twMerge("", className)} {...props} />
    </span>
  );
}

export interface GroupListItemNameProps extends Omit<ComponentPropsWithoutRef<"span">, "color"> {
  children: ReactNode;
}
export function GroupListItemName({ className, children, ...props }: GroupListItemNameProps) {
  return (
    <Typography
      className={twMerge("flex-1", className)}
      data-slot="group-list-item-name"
      variant="medium"
      color="base"
      as="span"
      size="sm"
      {...props}
    >
      {children}
    </Typography>
  );
}

export interface GroupListItemStatsProps extends Omit<ComponentPropsWithoutRef<"span">, "color"> {
  children: ReactNode;
}
export function GroupListItemStats({ className, children, ...props }: GroupListItemStatsProps) {
  return (
    <Typography
      className={twMerge("tabular-nums", className)}
      data-slot="group-list-item-stats"
      variant="medium"
      color="subtle"
      as="span"
      size="xs"
      {...props}
    >
      {children}
    </Typography>
  );
}

export interface GroupListItemProgressProps extends Omit<ComponentPropsWithoutRef<typeof Progress>, "className"> {
  className?: string;
  value: number;
}
export function GroupListItemProgress({ className, value, ...props }: GroupListItemProgressProps) {
  return (
    <Progress className={twMerge("w-14", className)} data-slot="group-list-item-progress" value={value} {...props}>
      <ProgressTrack className="h-1.5">
        <ProgressIndicator />
      </ProgressTrack>
    </Progress>
  );
}

export interface GroupListItemActionProps extends Omit<ComponentPropsWithoutRef<typeof CaretRightIcon>, "weight" | "size"> {}
export function GroupListItemAction({ className, ...props }: GroupListItemActionProps) {
  return (
    <CaretRightIcon
      className={twMerge("text-ink-muted", className)}
      data-slot="group-list-item-action"
      weight="regular"
      size={14}
      {...props}
    />
  );
}
