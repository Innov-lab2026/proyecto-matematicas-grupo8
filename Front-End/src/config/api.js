import axios from 'axios';
import { supabase } from './supabaseClient';

const rawBaseURL = import.meta.env.VITE_API_URL;

const normalizeBaseURL = (url) => {
    if (!url) return null;
    let cleaned = url.replace(/^VITE_API_URL:/, '').replace(/['"]/g, '').trim();
    if (!cleaned) return null;
    cleaned = cleaned.replace(/\/+$/, '');
    // El back monta las rutas bajo /api. Si falta, lo agregamos.
    if (!cleaned.endsWith('/api')) {
        cleaned = `${cleaned}/api`;
    }
    return cleaned;
};

const cleanBaseURL = normalizeBaseURL(rawBaseURL);

console.log('📡 API BaseURL:', cleanBaseURL || 'Usando fallback');

const api = axios.create({
    baseURL: cleanBaseURL || (
        import.meta.env.MODE === 'production'
        ? '/api'
        : 'http://localhost:3001/api'),
    timeout: 15000
});

api.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
