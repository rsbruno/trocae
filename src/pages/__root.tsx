import { createRootRoute, Outlet } from "@tanstack/react-router";

import { AppBottomNavigation } from "@/pages/_components/app-bottom-navigation";

export const Route = createRootRoute({
  component: RootLayout
});

function RootLayout() {
  return (
    <div className="bg-bg fixed inset-0 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-x-hidden overflow-y-auto pb-24">
        <Outlet />
      </div>
      <AppBottomNavigation />
    </div>
  );
}
