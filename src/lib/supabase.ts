import { createClient } from "@supabase/supabase-js";
import { config, isConfigured } from "./config";

export function getSupabaseClient() {
  if (!isConfigured.supabase) return null;
  return createClient(config.supabaseUrl, config.supabaseAnonKey);
}
