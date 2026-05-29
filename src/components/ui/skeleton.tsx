import { type ComponentPropsWithoutRef, type ElementType, type ReactNode, Fragment } from "react";
import { type VariantProps, tv } from "tailwind-variants";
import { twMerge } from "tailwind-merge";

import { ForEach } from "@/components/utils/foreach";

const variants = tv({
  variants: {
    tone: {
      base: [
        "bg-[linear-gradient(90deg,var(--skeleton-muted)_0%,var(--skeleton-highlight)_50%,var(--skeleton-muted)_100%)]",
        "ring-[var(--skeleton-ring)]"
      ],
      strong: [
        "bg-[linear-gradient(90deg,var(--skeleton-base)_0%,rgba(255,255,255,0.22)_50%,var(--skeleton-base)_100%)]",
        "ring-white/[0.08]"
      ],
      gray: [
        "bg-[linear-gradient(90deg,rgba(155,164,176,0.14)_0%,var(--skeleton-gray)_50%,rgba(155,164,176,0.14)_100%)]",
        "ring-white/[0.05]"
      ],
      muted: [
        "bg-[linear-gradient(90deg,var(--skeleton-muted)_0%,var(--skeleton-base)_50%,var(--skeleton-muted)_100%)]",
        "ring-white/[0.04]"
      ]
    },
    rounded: {
      "2xl": "rounded-2xl",
      full: "rounded-full",
      base: "rounded-xl",
      xs: "rounded-xs",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl"
    }
  },
  base: [
    "w-full overflow-hidden bg-[length:200%_100%] ring-1 ring-inset",
    "animate-skeleton-shimmer motion-reduce:animate-none motion-reduce:bg-[var(--skeleton-base)]"
  ],
  defaultVariants: {
    rounded: "md",
    tone: "base"
  }
});

type SkeletonBaseProps = {
  children?: ReactNode;
  loading?: boolean;
  repeat?: number;
  className?: string;
};

export type SkeletonProps<T extends ElementType = "div"> = SkeletonBaseProps & {
  as?: T;
} & ComponentPropsWithoutRef<T> &
  VariantProps<typeof variants>;

export function Skeleton<T extends ElementType = "div">({
  loading = true,
  repeat = 1,
  className,
  children,
  rounded,
  tone,
  as,
  ...props
}: SkeletonProps<T>) {
  const Component = as || "div";

  if (!loading) return <Fragment>{children}</Fragment>;

  return (
    <ForEach items={Array.from({ length: repeat })}>
      {() => <Component className={twMerge(variants({ className, rounded, tone }))} data-slot="skeleton" {...props} />}
    </ForEach>
  );
}
