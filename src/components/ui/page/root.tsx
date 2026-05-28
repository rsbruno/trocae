import type { ReactNode } from "react";

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
      <main className={className}>{children}</main>
    </PageContext.Provider>
  );
}
