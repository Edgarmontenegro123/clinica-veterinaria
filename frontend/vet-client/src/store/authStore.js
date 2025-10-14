import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      userEmail: null,
      userId: null,
      roles: null,
      setAuth: (token, userEmail, userId, roles) =>
        set({ token, userEmail, userId, roles }),
      logout: () =>
        set({ token: null, userEmail: null, userId: null, roles: null }),
    }),
    { name: "auth-storage" }
  )
);
