import { persist } from "zustand/middleware";
import { create } from "zustand";

import type { AuthSession } from "@/@types/auth";
import type { User } from "@/@types/user";

type AuthState = {
  user: User | null;
  session: AuthSession | null;
  setUser: (user: User | null) => void;
  setSession: (session: AuthSession | null) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      clearAuth: () => set({ session: null, user: null }),
      setSession: (session) => set({ session }),
      setUser: (user) => set({ user }),
      session: null,
      user: null
    }),
    {
      partialize: (state) => ({ session: state.session, user: state.user }),
      name: "trocae-auth"
    }
  )
);
