import type { ComponentPropsWithRef } from "react";

import { twMerge } from "@/lib/tv";

type CardProps = ComponentPropsWithRef<"div"> & {
  tone?: "surface" | "surfaceAlt";
};

export function Card({ tone = "surface", className, ...props }: CardProps) {
  return (
    <div
      className={twMerge(
        "rounded-xl border border-white/8",
        tone === "surface" ? "bg-surface/92" : "bg-surface-alt/90",
        className
      )}
      data-slot="card"
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div className={twMerge("flex flex-col gap-1.5 p-4", className)} data-slot="card-header" {...props} />;
}

export function CardTitle({ className, ...props }: ComponentPropsWithRef<"h3">) {
  return <h3 className={twMerge("leading-none font-semibold", className)} data-slot="card-title" {...props} />;
}

export function CardDescription({ className, ...props }: ComponentPropsWithRef<"p">) {
  return <p className={twMerge("text-ink-muted", className)} data-slot="card-description" {...props} />;
}

export function CardContent({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div className={twMerge("p-4 pt-0", className)} data-slot="card-content" {...props} />;
}

export function CardFooter({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div className={twMerge("flex items-center p-4 pt-0", className)} data-slot="card-footer" {...props} />;
}
