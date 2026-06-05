import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Evitamos que la app explote si faltan las variables (típico en el primer deploy)
if (!supabaseUrl || !supabaseKey) {
    console.error('CRÍTICO: Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en el entorno.');
}

// Inicializamos con valores dummy si fallan para que el resto de los módulos no mueran al importar
export const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : { auth: { getSession: async () => ({ data: { session: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }) } };
