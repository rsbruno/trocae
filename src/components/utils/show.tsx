import type { ReactNode } from "react";

interface ShowProps {
  if: boolean | undefined;
  children: ReactNode;
}

export function ShowIf({ if: condition = false, children }: ShowProps) {
  return condition ? <>{children}</> : null;
}
