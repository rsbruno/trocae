import { createFileRoute, Outlet } from "@tanstack/react-router";

import { BottomNavigation } from "./_components/bottom-navigation";

export const Route = createFileRoute("/_auth")({
  component: AuthLayout
});

function AuthLayout() {
  return (
    <div className="bg-bg fixed inset-0 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-x-hidden overflow-y-auto pb-24">
        <Outlet />
      </div>
      <BottomNavigation />
    </div>
  );
}
