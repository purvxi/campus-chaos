import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lkfftdjjwqaortrswbxa.supabase.co'
const supabaseAnonKey = 'sb_publishable_z0ecycgwWK-6FAQ1GHTiXg_oyfj1oz1'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)