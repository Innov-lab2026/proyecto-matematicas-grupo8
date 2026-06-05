import axios from 'axios';
import { supabase } from './supabaseClient';

const rawBaseURL = import.meta.env.VITE_API_URL;

// Limpieza por si quedó algún residuo de la copia del .env
const cleanBaseURL = rawBaseURL
    ? rawBaseURL.replace(/^VITE_API_URL:/, '').replace(/['"]/g, '')
    : null;

console.log('📡 API BaseURL:', cleanBaseURL || 'Usando fallback');

const api = axios.create({
    baseURL: cleanBaseURL || (
        import.meta.env.MODE === 'production'
        ? '/api'
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
