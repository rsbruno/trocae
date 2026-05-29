import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";

import { useAuthStore } from "@/stores/auth.store";

import { BottomNavigation } from "./_components/bottom-navigation";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async () => {
    if (!useAuthStore.persist.hasHydrated())
      await new Promise<void>((resolve) => {
        useAuthStore.persist.onFinishHydration(() => resolve());
      });

    const { session, user } = useAuthStore.getState();
    if (!session || !user) throw redirect({ to: "/" });
  },
  component: AuthLayout,
  staleTime: 0
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
