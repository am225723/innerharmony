import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be configured in production');
  }
  console.warn('⚠️  Warning: Supabase URL or Anon Key not configured. Auth will not work properly.');
  console.warn('   Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
}

const hasValidConfig = supabaseUrl && supabaseAnonKey;

export const supabase = hasValidConfig 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false,
      },
    })
  : null as any;

export async function verifySupabaseToken(token: string) {
  if (!supabase) {
    console.error('Supabase client not initialized');
    return null;
  }
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}
