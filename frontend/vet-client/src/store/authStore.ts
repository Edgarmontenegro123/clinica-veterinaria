import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  userEmail: string | null;
  userId: number | null;
  setAuth: (token: string, userEmail: string, userId: number) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
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