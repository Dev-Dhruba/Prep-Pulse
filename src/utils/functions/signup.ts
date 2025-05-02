'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/supabase-server'

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const userData = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { data, error } = await supabase.auth.signUp(userData)
    console.log(data)
    console.log(error)
    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath('/', 'layout')
    return { success: true, user: data.user }
}