import { supabase } from "@/lib/supabase/supabase-browserclient";

export async function signOut() {
    const { error } = await supabase.auth.signOut()
  }