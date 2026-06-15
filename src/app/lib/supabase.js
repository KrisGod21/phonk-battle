import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

// Defensive validation: ensure URL starts with http:// or https://
const isValidUrl = (url) => {
  return url && (url.startsWith('http://') || url.startsWith('https://'));
};

// Gracefully export client if credentials exist and URL is valid, otherwise null
export const supabase = isValidUrl(supabaseUrl) && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  console.warn(
    '⚠️ Supabase credentials missing or invalid URL. Phonk Battle is running in Demo Fallback Mode.'
  );
}
