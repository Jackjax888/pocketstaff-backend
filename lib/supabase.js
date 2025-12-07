// lib/supabase.js — PocketStaff backend (server-side, trusted)

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("SUPABASE SERVER DEBUG:", {
  supabaseUrlStart: supabaseUrl?.slice(0, 40) || null,
  hasServiceKey: !!supabaseServiceKey,
});

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment for server-side Supabase client"
  );
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);
export default supabase;
