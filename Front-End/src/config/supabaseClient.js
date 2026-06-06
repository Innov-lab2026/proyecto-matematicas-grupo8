import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔌 Supabase Config Check:', {
    urlPresent: !!supabaseUrl,
    keyPresent: !!supabaseKey,
    urlStart: supabaseUrl?.substring(0, 10) + '...',
    mode: import.meta.env.MODE
});

export const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : { auth: { getSession: async () => ({ data: { session: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }) } };
