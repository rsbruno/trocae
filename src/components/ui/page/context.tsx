import { createContext } from "react";

export type PageContextValue = {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
};

export const PageContext = createContext<PageContextValue>({});
