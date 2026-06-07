import axios from 'axios';
import { supabase } from './supabaseClient';

const rawBaseURL = import.meta.env.VITE_API_URL;

// Limpieza por si quedó algún residuo de la copia del .env
const cleanBaseURL = rawBaseURL
    ? rawBaseURL.replace(/^VITE_API_URL:/, '').replace(/['"]/g, '')
    : null;

// Aseguramos que la URL tenga el prefijo /api si es una URL externa
const finalBaseURL = cleanBaseURL
    ? (cleanBaseURL.endsWith('/api') ? cleanBaseURL : `${cleanBaseURL.replace(/\/$/, '')}/api`)
    : null;

console.log('📡 API BaseURL final:', finalBaseURL || 'Usando fallback (127.0.0.1:3001/api)');

const api = axios.create({
    baseURL: finalBaseURL || (
        import.meta.env.MODE === 'production'
        ? '/api'
        : 'http://127.0.0.1:3001/api')
});

api.interceptors.request.use((config) => {
    let storageKey = null;

    try {
        if (import.meta.env.VITE_SUPABASE_URL) {
            const url = new URL(import.meta.env.VITE_SUPABASE_URL);
            storageKey = `sb-${url.hostname.split('.')[0]}-auth-token`;
        }
    } catch (e) {
        console.warn('⚠️ No se pudo derivar la storageKey de Supabase');
    }

    const sessionData = storageKey ? localStorage.getItem(storageKey) : null;

    if (sessionData) {
        const { access_token } = JSON.parse(sessionData);
        config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
