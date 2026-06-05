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
    <div className="bg-bg inset-0 flex max-h-dvh min-h-dvh flex-col overflow-y-scroll">
      <Outlet />
      <BottomNavigation />
    </div>
  );
}
