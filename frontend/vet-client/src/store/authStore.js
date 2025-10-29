import { create } from "zustand";
import { persist } from "zustand/middleware";
import {supabase} from '../services/supabase.js'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      session: null,

      setAuth: (sessionData) => {
        const { user, session } = sessionData;
        set({ user, session });
      },

  
      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, session: null });
      },

      checkSession: async () => {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          set({ user: data.session.user, session: data.session });
        } else {
          set({ user: null, session: null });
        }
      },
    }),
    { name: "auth-storage" }
  )
);
