import type { ReactNode } from "react";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from "@tanstack/react-query";

import { ShowIf } from "@/components/utils/show";

import { queryClient } from "./query-client";

type QueryProviderProps = {
  children: ReactNode;
};

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ShowIf if={import.meta.env.DEV}>
        <ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
      </ShowIf>
    </QueryClientProvider>
  );
}
