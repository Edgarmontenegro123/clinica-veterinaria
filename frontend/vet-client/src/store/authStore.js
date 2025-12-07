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

        // Primero actualizamos el estado con el usuario y sesión
        set({ user, session, isAdmin: false });

        // Luego verificamos el rol de admin en background
        try {
          const { data, error } = await supabase
            .from('users')
            .select('role')
            .eq('auth_id', user.id)
            .single();

          const isAdmin = data?.role === 'admin';
          // Actualizamos solo el rol de admin
          set({ isAdmin });
        } catch (error) {
          throw error;
          // El isAdmin ya está en false por defecto
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
            set({ user: data.session.user, session: data.session, isAdmin: false });
          }
        } else {
          set({ user: null, session: null, isAdmin: false });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => sessionStorage.removeItem(name),
      },
    }
  )
);
