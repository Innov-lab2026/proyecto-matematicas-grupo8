import axios from 'axios';
import { supabase } from './supabaseClient';

const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3001/api';

console.log('📡 API BaseURL:', baseURL);

const api = axios.create({
    baseURL
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
