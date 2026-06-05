import axios from 'axios';
import { supabase } from './supabaseClient';

const api = axios.create({
    // Si no está la variable, no usamos localhost por defecto en prod para evitar falsos positivos
    baseURL: import.meta.env.VITE_API_URL || (
        import.meta.env.MODE === 'production'
        ? '/api' // Intenta ruta relativa si estamos en prod
        : 'http://localhost:3001/api')
});

api.interceptors.request.use((config) => {
    // Intentamos sacar el token del storage directamente si existe,
    // para evitar el await que puede congelar la petición
    const storageKey = `sb-${new URL(import.meta.env.VITE_SUPABASE_URL).hostname.split('.')[0]}-auth-token`;
    const sessionData = localStorage.getItem(storageKey);

    if (sessionData) {
        const { access_token } = JSON.parse(sessionData);
        config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
