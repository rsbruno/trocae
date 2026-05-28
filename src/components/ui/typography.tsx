import { type ComponentPropsWithoutRef, type ElementType } from "react";
import { type VariantProps, tv } from "tailwind-variants";

import { type SkeletonProps, Skeleton } from "./skeleton";

const variants = tv({
  variants: {
    size: {
      xxs: "text-[length:var(--font-size-xxs)] leading-[var(--line-height-xxs)]",
      xs: "text-[length:var(--font-size-xs)] leading-[var(--line-height-xs)]",
      sm: "text-[length:var(--font-size-sm)] leading-[var(--line-height-sm)]",
      md: "text-[length:var(--font-size-md)] leading-[var(--line-height-md)]",
      lg: "text-[length:var(--font-size-lg)] leading-[var(--line-height-lg)]",
      xl: "text-[length:var(--font-size-xl)] leading-[var(--line-height-xl)]"
    },
    color: {
      highlight: "text-typography-highlight",
      inverse: "text-typography-inverse",
      success: "text-typography-success",
      subtle: "text-typography-subtle",
      accent: "text-typography-accent",
      danger: "text-typography-danger",
      muted: "text-typography-muted",
      base: "text-typography-base",
      info: "text-typography-info"
    },
    variant: {
      semibold: "font-semibold",
      regular: "font-normal",
      medium: "font-medium",
      light: "font-light",
      bold: "font-bold"
    },
    font: {
      secondary: "font-secondary",
      tertiary: "font-tertiary",
      primary: "font-primary"
    }
  },
  defaultVariants: {
    variant: "regular",
    font: "primary",
    color: "base",
    size: "md"
  }
});

export type TypographyProps<T extends ElementType> = {
  className?: string;
  as?: T;
} & VariantProps<typeof variants> &
  Omit<ComponentPropsWithoutRef<T>, "className" | "size" | "translate"> &
  Pick<SkeletonProps, "loading">;

export function Typography<T extends ElementType = "span">({
  className,
  children,
  variant,
  loading,
  color,
  size,
  font,
  as,
  ...props
}: TypographyProps<T>) {
  const Component = as || "span";

  if (loading) return <Skeleton className={variants({ className, variant, color, size, font })} />;

  return (
    <Component className={variants({ className, variant, color, size, font })} data-slot="typography" {...props}>
      {children}
    </Component>
  );
}
