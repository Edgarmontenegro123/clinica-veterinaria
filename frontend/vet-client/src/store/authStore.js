import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      userEmail: null,
      userId: null,
      setAuth: (token, userEmail, userId) => set({ token, userEmail, userId }),
      logout: () => set({ token: null, userEmail: null, userId: null }),
    }),
    { name: 'auth-storage' }
  )
);