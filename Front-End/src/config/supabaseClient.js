import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('Atención: Faltan las variables de entorno de Supabase (VITE_...). La app no funcionará correctamente.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
