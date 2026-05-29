import { QueryClient } from "@tanstack/react-query";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: import.meta.env.PROD,
        staleTime: 60_000,
        retry: 1
      },
      mutations: {
        retry: 0
      }
    }
  });
}

export const queryClient = createQueryClient();
