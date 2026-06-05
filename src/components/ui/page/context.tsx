import type { LinkProps } from "@tanstack/react-router";

import { createContext } from "react";

export type PageContextValue = {
  title?: string;
  subtitle?: string;
  back?: Omit<LinkProps, "children">;
};

export const PageContext = createContext<PageContextValue>({});
