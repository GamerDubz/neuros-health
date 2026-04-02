import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !url.startsWith('http')) {
    throw new Error(
      `Invalid or missing NEXT_PUBLIC_SUPABASE_URL: "${url}". Ensure it starts with https:// and is added to GitHub secrets.`
    );
  }

  if (!anonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Ensure it is added to GitHub secrets.');
  }

  return createSupabaseClient(url, anonKey);
};
