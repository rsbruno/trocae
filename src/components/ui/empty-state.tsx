import type { ComponentPropsWithRef, ReactNode } from "react";

import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

import { fieldInputClassName } from "@/components/ui/fields/container";
import { Typography } from "@/components/ui/typography";

const emptyState = tv({
  slots: {
    root: "flex w-full flex-col items-center gap-4 px-4 py-16 text-center",
    action: "mt-1 flex flex-col items-center gap-2",
    content: "flex flex-col items-center gap-1"
  }
});

const emptyStateIcon = tv({
  slots: {
    icon: [
      "relative flex size-14 shrink-0 items-center justify-center rounded-xl bg-surface",
      "shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
      "[&_svg]:size-7 [&_svg]:shrink-0 [&_svg]:text-ink-secondary"
    ].join(" ")
  }
});

export type EmptyStateTone = "default" | "danger";

export type EmptyStateRootProps = ComponentPropsWithRef<"div"> & {
  children: ReactNode;
  tone?: EmptyStateTone;
};

export function EmptyStateRoot({ tone = "default", className, children, ...props }: EmptyStateRootProps) {
  const { root } = emptyState();
  const hasError = tone === "danger";

  return (
    <div
      className={twMerge(fieldInputClassName(hasError), root(), className)}
      data-slot="empty-state"
      data-tone={tone}
      {...props}
    >
      {children}
    </div>
  );
}

export type EmptyStateIconProps = ComponentPropsWithRef<"div"> & {
  children: ReactNode;
  tone?: EmptyStateTone;
};

export function EmptyStateIcon({ tone = "default", className, children, ...props }: EmptyStateIconProps) {
  const { icon } = emptyStateIcon();

  return (
    <div className={twMerge(icon(), className)} data-slot="empty-state-icon" data-tone={tone} {...props}>
      {children}
    </div>
  );
}

export type EmptyStateContentProps = ComponentPropsWithRef<"div"> & {
  children: ReactNode;
};

export function EmptyStateContent({ className, children, ...props }: EmptyStateContentProps) {
  const { content } = emptyState();

  return (
    <div className={twMerge(content(), className)} data-slot="empty-state-content" {...props}>
      {children}
    </div>
  );
}

export type EmptyStateTitleProps = Omit<ComponentPropsWithRef<"span">, "color"> & {
  children: ReactNode;
};

export function EmptyStateTitle({ className, children, ...props }: EmptyStateTitleProps) {
  return (
    <Typography className={className} variant="medium" color="base" as="span" size="sm" {...props}>
      {children}
    </Typography>
  );
}

export type EmptyStateDescriptionProps = Omit<ComponentPropsWithRef<"span">, "color"> & {
  children: ReactNode;
};

export function EmptyStateDescription({ className, children, ...props }: EmptyStateDescriptionProps) {
  return (
    <Typography className={className} variant="medium" color="subtle" as="span" size="xs" {...props}>
      {children}
    </Typography>
  );
}

export type EmptyStateActionProps = ComponentPropsWithRef<"div"> & {
  children: ReactNode;
};

export function EmptyStateAction({ className, children, ...props }: EmptyStateActionProps) {
  const { action } = emptyState();

  return (
    <div className={twMerge(action(), className)} data-slot="empty-state-action" {...props}>
      {children}
    </div>
  );
}
