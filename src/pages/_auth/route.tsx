import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";

import { getFirebaseAuth } from "@/infra/firebase/auth";
import { useAuthStore } from "@/stores/auth.store";

import { BottomNavigation } from "./_components/bottom-navigation";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async () => {
    if (!useAuthStore.persist.hasHydrated())
      await new Promise<void>((resolve) => {
        useAuthStore.persist.onFinishHydration(() => resolve());
      });

    const { clearAuth, session, user } = useAuthStore.getState();
    if (!session || !user) throw redirect({ to: "/" });

    const auth = getFirebaseAuth();
    await auth.authStateReady();

    if (!auth.currentUser) {
      clearAuth();
      throw redirect({ to: "/" });
    }
  },
  component: AuthLayout,
  staleTime: 0
});

function AuthLayout() {
  return (
    <div className="bg-bg fixed inset-0 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-x-hidden overflow-y-auto pb-[calc(8rem+env(safe-area-inset-bottom))]">
        <Outlet />
      </div>
      <BottomNavigation />
    </div>
  );
}
