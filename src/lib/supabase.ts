import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if Supabase is configured and not in forced local demo mode
export const isSupabaseConfigured = () => {
  if (import.meta.env.VITE_DEMO_MODE === 'true') {
    return false;
  }
  const url = import.meta.env.VITE_SUPABASE_URL || '';
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  return (
    url.length > 0 &&
    key.length > 0 &&
    !url.includes('your-project') &&
    !key.includes('your-anon-key')
  );
};
