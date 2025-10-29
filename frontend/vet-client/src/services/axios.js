import axios from 'axios';
import { useAuthStore } from '../store/authStore.js';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://vpzpbnftuwmienyciczg.supabase.co/rest/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default instance;