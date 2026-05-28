import { type ComponentPropsWithoutRef, type ElementType, type ReactNode, Fragment } from "react";
import { type VariantProps, tv } from "tailwind-variants";
import { twMerge } from "tailwind-merge";

import { ForEach } from "@/components/utils/foreach";

const variants = tv({
  variants: {
    color: {
      "100": "bg-gray-100",
      "200": "bg-gray-200",
      "250": "bg-gray-250",
      "300": "bg-gray-300",
      "350": "bg-gray-350",
      "400": "bg-gray-400",
      "450": "bg-gray-450",
      "500": "bg-gray-500",
      "600": "bg-gray-600",
      "700": "bg-gray-700",
      "800": "bg-gray-800",
      "900": "bg-gray-900",
      "950": "bg-gray-950",
      base: "bg-gray-200",
      "50": "bg-gray-50"
    },
    rounded: {
      "2xl": "rounded-2xl",
      base: "rounded-xl",
      xs: "rounded-xs",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl"
    }
  },
  defaultVariants: {
    variant: "regular",
    color: "base"
  },
  base: "animate-pulse w-full"
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
  color,
  as,
  ...props
}: SkeletonProps<T>) {
  const Component = as || "div";

  if (!loading) return <Fragment>{children}</Fragment>;

  return (
    <ForEach items={Array.from({ length: repeat })}>
      {() => <Component className={twMerge(variants({ className, rounded, color }))} data-slot="skeleton" {...props} />}
    </ForEach>
  );
}
