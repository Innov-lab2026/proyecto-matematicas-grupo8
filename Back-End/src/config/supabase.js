import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Faltan credenciales de Supabase (URL/Key).');
}

export default createClient(supabaseUrl, supabaseKey);
