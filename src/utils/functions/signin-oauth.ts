import { supabase } from "@/lib/supabase/supabase-browserclient"

export const OauthSignin = async (provider: 'google' | 'github')=>{

    const mode = process.env.NEXT_PUBLIC_MODE;

    const redirectTo = mode === 'production' 
        ? "https://prep-pulse-ten.vercel.app/" 
        : "http://localhost:3000/";

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
        },
    });
    //   custom onboarding

    if (error) console.error("OAuth error:", error.message);

    return {data, error}  
}