'use client'

import React, { useState } from 'react'
import { useAuth } from '@/utils/contexts/UserProvider'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from './ui/textarea'
import { updateProfile } from '@/utils/functions/update-profile'
import { toast } from 'sonner'
import { User, Upload } from 'lucide-react'
import Image from 'next/image'

interface EditProfileFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EditProfileForm = ({ onSuccess, onCancel }: EditProfileFormProps) => {
  const { user, refreshUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(user?.avatar_url || null)
  
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
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative group">
          <div className="relative h-24 w-24 rounded-full border-4 border-cosmic-blue/30 overflow-hidden bg-gradient-to-br from-cosmic-blue to-cosmic-purple p-1">
            {previewImage ? (
              <Image 
                src={previewImage} 
                alt="Avatar preview"
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-cosmic-dark text-4xl font-bold text-white">
                {(user?.full_name || user?.email || '?').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
              <Upload className="w-8 h-8 text-white" />
            </div>
          </div>
          <input 
            type="file" 
            name="avatar_file" 
            id="avatar_file" 
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <Label htmlFor="avatar_file" className="text-sm text-gray-400 cursor-pointer">
          Click to change avatar
        </Label>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="full_name" className="text-sm font-medium">Full Name</Label>
          <Input 
            id="full_name" 
            name="full_name" 
            placeholder="Your full name"
            defaultValue={user?.full_name || ''}
            className="border-cosmic-blue/20 bg-cosmic-dark/50 text-white"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone_number" className="text-sm font-medium">Phone Number</Label>
            <Input 
              id="phone_number" 
              name="phone_number" 
              placeholder="Your phone number"
              defaultValue={user?.phone_number || ''}
              className="border-cosmic-blue/20 bg-cosmic-dark/50 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">Location</Label>
            <Input 
              id="location" 
              name="location" 
              placeholder="Your location"
              defaultValue={user?.location || ''}
              className="border-cosmic-blue/20 bg-cosmic-dark/50 text-white"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="github_id" className="text-sm font-medium">GitHub Username</Label>
            <Input 
              id="github_id" 
              name="github_id" 
              placeholder="Your GitHub username"
              defaultValue={user?.github_id || ''}
              className="border-cosmic-blue/20 bg-cosmic-dark/50 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="linkedin_id" className="text-sm font-medium">LinkedIn Username</Label>
            <Input 
              id="linkedin_id" 
              name="linkedin_id" 
              placeholder="Your LinkedIn username"
              defaultValue={user?.linkedin_id || ''}
              className="border-cosmic-blue/20 bg-cosmic-dark/50 text-white"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
          <Textarea 
            id="bio" 
            name="bio" 
            placeholder="Write a short bio about yourself"
            defaultValue={user?.bio || ''}
            className="min-h-[120px] border-cosmic-blue/20 bg-cosmic-dark/50 text-white"
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="border-cosmic-blue/20 text-gray-300"
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          className="cosmic-button"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}

export default EditProfileForm