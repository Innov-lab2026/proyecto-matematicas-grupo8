import axios from 'axios';
import { supabase } from './supabaseClient';

const rawBaseURL = import.meta.env.VITE_API_URL;

const cleanBaseURL = rawBaseURL
    ? rawBaseURL.replace(/^VITE_API_URL:/, '').replace(/['"]/g, '')
    : null;

console.log('📡 API BaseURL:', cleanBaseURL || 'Usando fallback');

const api = axios.create({
    baseURL: cleanBaseURL || (
        import.meta.env.MODE === 'production'
        ? '/api'
        : 'http://localhost:3001/api'),
    timeout: 15000
});

export default api;
