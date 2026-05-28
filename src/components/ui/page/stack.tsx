import type { ComponentPropsWithRef } from "react";

import { twMerge } from "tailwind-merge";

export function PageStackRoot({ className, children, ...props }: ComponentPropsWithRef<"div">) {
  return (
    <div
      className={twMerge("mx-auto flex min-h-full w-full max-w-md flex-col px-5", className)}
      data-slot="page-stack"
      {...props}
    >
      {children}
    </div>
  );
}

export function PageStackMain({ className, children, ...props }: ComponentPropsWithRef<"div">) {
  return (
    <div
      className={twMerge("flex w-full flex-1 flex-col items-center justify-center py-8", className)}
      data-slot="page-stack-main"
      {...props}
    >
      <div className="flex w-full max-w-sm flex-col items-center">{children}</div>
    </div>
  );
}

export function PageStackFooter({ className, children, ...props }: ComponentPropsWithRef<"div">) {
  return (
    <footer className={twMerge("mt-auto w-full shrink-0 py-8 text-center", className)} data-slot="page-stack-footer" {...props}>
      {children}
    </footer>
  );
}
