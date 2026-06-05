import type { LinkProps } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { twMerge } from "tailwind-merge";

import { PageContext } from "./context";

type PageRootProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  back?: Omit<LinkProps, "children">;
  className?: string;
};

export function PageRoot({ className, children, subtitle, title, back }: PageRootProps) {
  return (
    <PageContext.Provider value={{ subtitle, title, back }}>
      <main className={twMerge(className, "mx-auto flex h-full w-full max-w-md flex-1 flex-col pb-10")}>{children}</main>
    </PageContext.Provider>
  );
}
