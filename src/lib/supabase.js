import { createClient } from '@supabase/supabase-js'

// SECURITY: Use environment variables instead of hardcoded credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Auto-refresh tokens
    autoRefreshToken: true,
    // Persist session in localStorage (encrypted by Supabase)
    persistSession: true,
    // Detect session from URL (for email confirmations)
    detectSessionInUrl: true
  }
})