import type { ComponentPropsWithRef } from "react";

import { twMerge } from "tailwind-merge";

type CardProps = ComponentPropsWithRef<"div"> & {
  tone?: "surface" | "surfaceAlt";
};

export function Card({ tone = "surface", className, ...props }: CardProps) {
  return (
    <div
      className={twMerge(
        "group/card flex flex-col gap-4 overflow-hidden rounded-xl border border-white/8 py-4 text-sm",
        tone === "surface" ? "bg-surface/92" : "bg-surface-alt/90",
        className
      )}
      data-slot="card"
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div className={twMerge("grid auto-rows-min items-start gap-1 px-4", className)} data-slot="card-header" {...props} />;
}

export function CardTitle({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div className={twMerge("text-base leading-snug font-medium", className)} data-slot="card-title" {...props} />;
}

export function CardDescription({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div className={twMerge("text-ink-muted text-sm", className)} data-slot="card-description" {...props} />;
}

export function CardContent({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div className={twMerge("px-4", className)} data-slot="card-content" {...props} />;
}

export function CardFooter({ className, ...props }: ComponentPropsWithRef<"div">) {
  return (
    <div className={twMerge("flex items-center border-t border-white/8 p-4", className)} data-slot="card-footer" {...props} />
  );
}
