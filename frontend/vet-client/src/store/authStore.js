import { create } from "zustand";
import { persist } from "zustand/middleware";
import {supabase} from '../services/supabase.js'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isAdmin: false,

      setAuth: async (sessionData) => {
        const { user, session } = sessionData;

        // Verificar si el usuario es administrador
        try {
          const { data, error } = await supabase
            .from('users')
            .select('role')
            .eq('auth_id', user.id)
            .single();

          const isAdmin = data?.role === 'admin';
          set({ user, session, isAdmin });
        } catch (error) {
          console.error('Error checking admin role:', error);
          set({ user, session, isAdmin: false });
        }
      },


      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, session: null, isAdmin: false });
      },

      checkSession: async () => {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          // Verificar rol al comprobar sesión
          try {
            const { data: userData, error } = await supabase
              .from('users')
              .select('role')
              .eq('auth_id', data.session.user.id)
              .single();

            const isAdmin = userData?.role === 'admin';
            set({ user: data.session.user, session: data.session, isAdmin });
          } catch (error) {
            console.error('Error checking admin role:', error);
            set({ user: data.session.user, session: data.session, isAdmin: false });
          }
        } else {
          set({ user: null, session: null, isAdmin: false });
        }
      },
    }),
    { name: "auth-storage" }
  )
);
