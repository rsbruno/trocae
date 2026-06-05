import type { QueryClient } from "@tanstack/react-query";

import { createRootRouteWithContext, useRouterState, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";

import { Toaster } from "@/components/ui/sonner";

export type RouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout
});

function ScrollToTop() {
  const locationHref = useRouterState({ select: (state) => state.location.href });

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      const scrollTargets = [
        document.scrollingElement,
        document.documentElement,
        document.body,
        ...document.querySelectorAll<HTMLElement>("[data-app-scroll-root]")
      ];

      for (const target of scrollTargets) {
        target?.scrollTo({ behavior: "smooth", top: 0 });
      }
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [locationHref]);

  return null;
}

function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
      <Toaster />
    </>
  );
}
