import type { ComponentPropsWithRef } from "react";

import { twMerge } from "@/lib/tv";

type SurfaceCardRootProps = ComponentPropsWithRef<"div">;

export function SurfaceCardRoot({ className, children, ...props }: SurfaceCardRootProps) {
  return (
    <div className={twMerge("bg-surface rounded-xl p-4", className)} {...props}>
      {children}
    </div>
  );
}

export function SurfaceCardGhost({ className, children, ...props }: SurfaceCardRootProps) {
  return (
    <div className={twMerge("bg-surface-alt rounded-lg p-4", className)} {...props}>
      {children}
    </div>
  );
}

export function SurfaceCardAccent({ className, children, ...props }: SurfaceCardRootProps) {
  return (
    <div className={twMerge("bg-surface ring-accent-primary/20 rounded-xl p-4 ring-1", className)} {...props}>
      {children}
    </div>
  );
}
