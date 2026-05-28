import type { ComponentPropsWithRef } from "react";

import { twMerge } from "tailwind-merge";

type SurfaceCardRootProps = ComponentPropsWithRef<"div">;

export function SurfaceCardRoot({ className, children, ...props }: SurfaceCardRootProps) {
  return (
    <div className={twMerge("bg-surface/92 rounded-xl border border-white/8 p-4", className)} {...props}>
      {children}
    </div>
  );
}

export function SurfaceCardGhost({ className, children, ...props }: SurfaceCardRootProps) {
  return (
    <div className={twMerge("bg-surface-alt/95 rounded-lg border border-white/7 p-4", className)} {...props}>
      {children}
    </div>
  );
}

export function SurfaceCardAccent({ className, children, ...props }: SurfaceCardRootProps) {
  return (
    <div
      className={twMerge("bg-surface/92 ring-accent-primary/20 rounded-xl border border-white/10 p-4 ring-1", className)}
      {...props}
    >
      {children}
    </div>
  );
}
