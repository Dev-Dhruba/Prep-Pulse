// context/user-context.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from "@/lib/supabase/supabase-client"
import { User } from '@supabase/supabase-js'

type UserContextType = {
  user: User | null
  isLoading: boolean
  profile: any // Replace with your profile type
  refresh: () => Promise<void>
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  profile: null,
  refresh: async () => {}
})

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)


  const fetchUser = async () => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profileData } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        
        setProfile(profileData)
      } else {
        setProfile(null)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        fetchUser()
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return (
    <UserContext.Provider value={{ user, isLoading, profile, refresh: fetchUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)