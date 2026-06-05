import axios from 'axios';
import { supabase } from './supabaseClient';

const api = axios.create({
    // Si no está la variable, no usamos localhost por defecto en prod para evitar falsos positivos
    baseURL: import.meta.env.VITE_API_URL || (
        import.meta.env.MODE === 'production'
        ? '/api' // Intenta ruta relativa si estamos en prod
        : 'http://localhost:3001/api')
});

api.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
