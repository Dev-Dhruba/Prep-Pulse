'use server'

import { createClient } from '@/lib/supabase/supabase-server'
import { revalidatePath } from 'next/cache'

interface UpdateProfileData {
  id: string;
  full_name?: string;
  bio?: string;
  phone_number?: string;
  location?: string;
  github_id?: string;
  linkedin_id?: string;
  avatar_url?: string;
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    // Extract profile data from form
    const profileData: UpdateProfileData = {
      id: session.user.id,
      full_name: formData.get('full_name') as string || undefined,
      bio: formData.get('bio') as string || undefined,
      phone_number: formData.get('phone_number') as string || undefined,
      location: formData.get('location') as string || undefined,
      github_id: formData.get('github_id') as string || undefined,
      linkedin_id: formData.get('linkedin_id') as string || undefined
    }

    // Handle avatar file upload if provided
    const avatarFile = formData.get('avatar_file') as File
    if (avatarFile && avatarFile.size > 0) {
      // Generate a unique filename
      const fileExt = avatarFile.name.split('.').pop()
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload the avatar to Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-content')
        .upload(filePath, avatarFile, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        console.error('Error uploading avatar:', uploadError)
        return { success: false, error: 'Failed to upload avatar' }
      }

      // Get the public URL for the uploaded avatar
      const { data: { publicUrl } } = supabase.storage
        .from('user-content')
        .getPublicUrl(filePath)

      // Add avatar URL to profile data
      profileData.avatar_url = publicUrl
    }

    // Update user profile in the database
    const { error } = await supabase
      .from('users')
      .upsert(profileData, {
        onConflict: 'id',
        ignoreDuplicates: false,
      })

    if (error) {
      console.error('Error updating profile:', error)
      return { success: false, error: error.message }
    }

    // Revalidate paths to show updated data
    revalidatePath('/profile')
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    console.error('Exception in updateProfile:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}