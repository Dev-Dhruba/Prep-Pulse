'use client'

import React, { useState, useRef } from 'react'
import { useAuth } from '@/utils/contexts/UserProvider'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from './ui/textarea'
import { updateProfile } from '@/utils/functions/update-profile'
import { toast } from 'sonner'
import { User, Upload, Github, Linkedin, MapPin, Phone } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { BackgroundBeams } from '@/components/ui/background-beams'

interface EditProfileFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EditProfileForm = ({ onSuccess, onCancel }: EditProfileFormProps) => {
  const { user, refreshUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(user?.avatar_url || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      console.log(formData)
      const result = await updateProfile(formData)
      
      if (result.success) {
        toast.success('Profile updated successfully')
        // Refresh user data to reflect changes
        await refreshUser()
        if (onSuccess) onSuccess()
      } else {
        toast.error('Failed to update profile', {
          description: result.error
        })
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
      console.error('Profile update error:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create a preview URL for the selected image
      const objectUrl = URL.createObjectURL(file)
      setPreviewImage(objectUrl)
      
      // Clean up the preview URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl)
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8 relative">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <BackgroundBeams />
      </div>

      <div className="flex flex-col items-center space-y-4 relative">
        <motion.div 
          className="relative group cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={triggerFileInput}
        >
          <div className="absolute -inset-0.5 rounded-full bg-blue-500 opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative h-28 w-28 rounded-full border-4 border-blue-500/30 overflow-hidden bg-black p-1">
            {previewImage ? (
              <Image 
                src={previewImage || "/placeholder.svg"} 
                alt="Avatar preview"
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-neutral-900 text-4xl font-bold text-white">
                {(user?.full_name || user?.email || '?').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
              <Upload className="w-8 h-8 text-white" />
            </div>
          </div>
          <input 
            ref={fileInputRef}
            type="file" 
            name="avatar_file" 
            id="avatar_file" 
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="absolute -bottom-1 right-0 bg-blue-600 rounded-full p-1.5 shadow-lg border-2 border-black">
            <Upload className="w-4 h-4 text-white" />
          </div>
        </motion.div>
        <Label htmlFor="avatar_file" className="text-sm text-neutral-400 cursor-pointer hover:text-blue-400 transition-colors">
          Click to change avatar
        </Label>
      </div>
      
      <div className="space-y-6 relative">
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Label htmlFor="full_name" className="text-sm font-medium flex items-center gap-2">
            <User className="h-4 w-4 text-blue-400" />
            Full Name
          </Label>
          <Input 
            id="full_name" 
            name="full_name" 
            placeholder="Your full name"
            defaultValue={user?.full_name || ''}
            className="border-neutral-800 bg-neutral-900/50 text-white focus:border-blue-500 focus:ring-blue-500/20"
          />
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Label htmlFor="phone_number" className="text-sm font-medium flex items-center gap-2">
              <Phone className="h-4 w-4 text-blue-400" />
              Phone Number
            </Label>
            <Input 
              id="phone_number" 
              name="phone_number" 
              placeholder="Your phone number"
              defaultValue={user?.phone_number || ''}
              className="border-neutral-800 bg-neutral-900/50 text-white focus:border-blue-500 focus:ring-blue-500/20"
            />
          </motion.div>
          
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-400" />
              Location
            </Label>
            <Input 
              id="location" 
              name="location" 
              placeholder="Your location"
              defaultValue={user?.location || ''}
              className="border-neutral-800 bg-neutral-900/50 text-white focus:border-blue-500 focus:ring-blue-500/20"
            />
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Label htmlFor="github_id" className="text-sm font-medium flex items-center gap-2">
              <Github className="h-4 w-4 text-blue-400" />
              GitHub Username
            </Label>
            <Input 
              id="github_id" 
              name="github_id" 
              placeholder="Your GitHub username"
              defaultValue={user?.github_id || ''}
              className="border-neutral-800 bg-neutral-900/50 text-white focus:border-blue-500 focus:ring-blue-500/20"
            />
          </motion.div>
          
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Label htmlFor="linkedin_id" className="text-sm font-medium flex items-center gap-2">
              <Linkedin className="h-4 w-4 text-blue-400" />
              LinkedIn Username
            </Label>
            <Input 
              id="linkedin_id" 
              name="linkedin_id" 
              placeholder="Your LinkedIn username"
              defaultValue={user?.linkedin_id || ''}
              className="border-neutral-800 bg-neutral-900/50 text-white focus:border-blue-500 focus:ring-blue-500/20"
            />
          </motion.div>
        </div>
        
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
          <Textarea 
            id="bio" 
            name="bio" 
            placeholder="Write a short bio about yourself"
            defaultValue={user?.bio || ''}
            className="min-h-[120px] border-neutral-800 bg-neutral-900/50 text-white focus:border-blue-500 focus:ring-blue-500/20"
          />
        </motion.div>
      </div>
      
      <motion.div 
        className="flex justify-end gap-3 pt-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white"
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </div>
          ) : (
            'Save Changes'
          )}
        </Button>
      </motion.div>
    </form>
  )
}

export default EditProfileForm
