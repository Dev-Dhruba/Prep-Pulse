'use client'

import React, { useState } from 'react'
import { useAuth } from '@/utils/contexts/UserProvider'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { User, Mail, MapPin, Phone, Github, Linkedin, Clock, Coins, Edit, X } from 'lucide-react'
import Image from 'next/image'
import EditProfileForm from '@/components/EditProfileForm'
import { motion, AnimatePresence } from 'framer-motion'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { TextGenerateEffect } from '@/components/ui/text-generate-effect'

const Profile = () => {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-xl text-blue-400">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            Loading profile data...
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center space-y-4">
        <div className="text-2xl font-bold text-white">Please sign in to view your profile</div>
        <Button 
          onClick={() => router.push('/login')}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Sign In
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-12 md:py-16 relative">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <BackgroundBeams />
      </div>
      
      <motion.div 
        className="mb-8 flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >        <h1 className="text-3xl font-bold tracking-tight font-milker">
          <TextGenerateEffect words="Your Profile" className="text-white" />
        </h1>

        {!isEditing && (
          <Button 
            onClick={() => setIsEditing(true)} 
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </motion.div>
      
      <div className="grid gap-8 md:grid-cols-12">
        {/* Profile Overview Card */}
        <motion.div 
          className="col-span-12 md:col-span-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-neutral-800 bg-black/80 backdrop-blur-sm overflow-hidden">
            {!isEditing ? (
              <>
                <CardHeader className="relative pb-8">
                  <div className="absolute inset-0 h-32 bg-gradient-to-r from-blue-600 to-blue-400 opacity-30 rounded-t-lg"></div>
                  <div className="relative mt-8 flex flex-col items-center">
                    <div className="relative h-24 w-24 rounded-full border-4 border-blue-500/30 overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 p-1">
                      {user.avatar_url ? (
                        <Image 
                          src={user.avatar_url || "/placeholder.svg"} 
                          alt={user.full_name || 'User'} 
                          fill 
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-neutral-900 text-4xl font-bold text-white">
                          {(user.full_name || user.email || '?').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>                  <CardTitle className="pt-4 text-center text-xl font-bold text-white font-milker">
                    {user.full_name || 'User'}
                  </CardTitle>
                  <CardDescription className="text-center text-neutral-400">
                    {user.email}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.token_balance && (
                    <div className="flex items-center gap-3 text-neutral-300">
                      <Coins className="h-5 w-5 text-blue-400" />
                      <div className="flex flex-col">
                        <span className="text-sm text-neutral-400">Token Balance</span>
                        <span>{user.token_balance}</span>
                      </div>
                    </div>
                  )}
                  
                  {user.created_at && (
                    <div className="flex items-center gap-3 text-neutral-300">
                      <Clock className="h-5 w-5 text-blue-400" />
                      <div className="flex flex-col">
                        <span className="text-sm text-neutral-400">Member Since</span>
                        <span>{new Date(user.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}
                  
                  {user.location && (
                    <div className="flex items-center gap-3 text-neutral-300">
                      <MapPin className="h-5 w-5 text-blue-400" />
                      <div className="flex flex-col">
                        <span className="text-sm text-neutral-400">Location</span>
                        <span>{user.location}</span>
                      </div>
                    </div>
                  )}
                  
                  {user.phone_number && (
                    <div className="flex items-center gap-3 text-neutral-300">
                      <Phone className="h-5 w-5 text-blue-400" />
                      <div className="flex flex-col">
                        <span className="text-sm text-neutral-400">Phone</span>
                        <span>{user.phone_number}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-center gap-4 pt-2 pb-6">
                  {user.github_id && (
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="rounded-full border-blue-500/30 hover:bg-blue-500/10 hover:border-blue-500/50"
                        asChild
                      >
                        <a href={`https://github.com/${user.github_id}`} target="_blank" rel="noopener noreferrer">
                          <Github className="h-5 w-5 text-white" />
                        </a>
                      </Button>
                    </motion.div>
                  )}
                  
                  {user.linkedin_id && (
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="rounded-full border-blue-500/30 hover:bg-blue-500/10 hover:border-blue-500/50"
                        asChild
                      >
                        <a href={`https://linkedin.com/in/${user.linkedin_id}`} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-5 w-5 text-white" />
                        </a>
                      </Button>
                    </motion.div>
                  )}
                </CardFooter>
              </>
            ) : (
              <CardHeader className="relative">
                <div className="absolute right-4 top-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsEditing(false)}
                    className="h-8 w-8 text-neutral-400 hover:text-white hover:bg-neutral-800"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <CardTitle className="text-white">Edit Your Profile</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
            )}
          </Card>
        </motion.div>
        
        {/* Profile Details Card */}
        <div className="col-span-12 md:col-span-8 space-y-8">
          <AnimatePresence mode="wait">
            {!isEditing ? (
              <motion.div
                key="profile-details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="border-neutral-800 bg-black/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Profile Information</CardTitle>
                    <CardDescription>Your personal information and biography</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-sm text-neutral-400">Full Name</Label>
                        <div className="flex h-10 items-center rounded-md border border-neutral-800 bg-neutral-900/50 px-3 py-2">
                          {user.full_name || 'Not provided'}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm text-neutral-400">Email</Label>
                        <div className="flex h-10 items-center rounded-md border border-neutral-800 bg-neutral-900/50 px-3 py-2">
                          {user.email || 'Not provided'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm text-neutral-400">Phone Number</Label>
                        <div className="flex h-10 items-center rounded-md border border-neutral-800 bg-neutral-900/50 px-3 py-2">
                          {user.phone_number || 'Not provided'}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-sm text-neutral-400">Location</Label>
                        <div className="flex h-10 items-center rounded-md border border-neutral-800 bg-neutral-900/50 px-3 py-2">
                          {user.location || 'Not provided'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-sm text-neutral-400">Biography</Label>
                      <div className="min-h-[100px] rounded-md border border-neutral-800 bg-neutral-900/50 px-3 py-2">
                        {user.bio || 'No biography provided'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="edit-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-neutral-800 bg-black/80 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <EditProfileForm 
                      onSuccess={() => setIsEditing(false)} 
                      onCancel={() => setIsEditing(false)} 
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default Profile
