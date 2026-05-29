import { createRouter } from "@tanstack/react-router";

import { QueryProvider } from "@/infra/query-client/provider";
import { queryClient } from "@/infra/query-client/query-client";

import { routeTree } from ".";

export const router = createRouter({
  routeTree,
  context: {
    queryClient
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  Wrap: QueryProvider
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
