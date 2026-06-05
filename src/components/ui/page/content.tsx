import type { ComponentPropsWithoutRef } from "react";

import { twMerge } from "tailwind-merge";

type PageContentProps = ComponentPropsWithoutRef<"div">;

export function PageContent({ className, children, ...props }: PageContentProps) {
  return (
    <div className={twMerge("flex flex-col gap-7 px-4", className)} {...props}>
      {children}
    </div>
  );
}
