import { supabase } from './Client'

export async function checkSupabaseConnection(): Promise<boolean> {
  const { error } = await supabase.from('users').select('*').limit(1)

  if (error) {
    console.error('Supabase connection failed:', error.message)
    return false
  } else {
    console.log('Supabase is connected and working!')
    return true
  }
}