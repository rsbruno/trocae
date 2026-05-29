import type { ReactNode } from "react";

import { twMerge } from "tailwind-merge";

import { PageContext } from "./context";

type PageRootProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  className?: string;
};

export function PageRoot({ className = "mx-auto max-w-md", children, subtitle, showBack, onBack, title }: PageRootProps) {
  return (
    <PageContext.Provider value={{ subtitle, showBack, onBack, title }}>
      <main className={twMerge(className, "flex h-full flex-1 flex-col")}>{children}</main>
    </PageContext.Provider>
  );
}
