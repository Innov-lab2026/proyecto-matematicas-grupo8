import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const isMockMode = process.env.DATA_SOURCE === "MOCK";

if (!isMockMode && (!supabaseUrl || !supabaseKey)) {
  throw new Error("Supabase URL y Anon Key son requeridas en el .env");
}

const supabase = isMockMode
  ? { auth: { getUser: () => ({ data: { user: null }, error: null }) } }
  : createClient(supabaseUrl, supabaseKey);

export default supabase;
