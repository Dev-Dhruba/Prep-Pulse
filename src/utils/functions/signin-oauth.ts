import { supabase } from "@/lib/supabase/supabase-browserclient"

export const OauthSignin = async (provider: 'google' | 'github')=>{
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: "http://localhost:3000/auth/callback?next=",
        },
      })
    //   custom onboarding

    if (error) console.error("OAuth error:", error.message);

    return {data, error}  
}
