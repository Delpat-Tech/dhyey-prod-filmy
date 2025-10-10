'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Camera, Save } from 'lucide-react'
import { getAvatarUrl } from '../../../../lib/imageUtils'
import { useAuth } from '../../../../contexts/AuthContext'
import { adminAPI } from '../../../../lib/api'

export default function AdminEditProfilePage() {
  const { updateUser } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    authorName: '',
    bio: '',
    location: '',
    website: ''
  })
  const [avatar, setAvatar] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      const response = await adminAPI.getAdminProfile()
      
      const user = response.data.user
      setFormData({
        name: user.name || '',
        authorName: user.username || user.authorName || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || ''
      })
      setAvatar(user.avatar || '')
    } catch (error) {
      console.error('Error fetching admin data:', error)
      setMessage('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      let updateData = { ...formData }
      
      // If there's a selected file, create FormData for file upload
      if (selectedFile) {
        const formDataWithFile = new FormData()
        formDataWithFile.append('avatar', selectedFile)
        formDataWithFile.append('name', formData.name)
        formDataWithFile.append('authorName', formData.authorName)
        formDataWithFile.append('bio', formData.bio)
        formDataWithFile.append('location', formData.location)
        formDataWithFile.append('website', formData.website)
        
        const response = await fetch('/api/v1/admin/profile', {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('dhyey_token')}`
          },
          body: formDataWithFile
        })
        
        if (!response.ok) {
          throw new Error('Failed to update profile with photo')
        }
        
        const result = await response.json()
        
        // Update user context with new data including avatar
        updateUser({
          name: formData.name,
          username: formData.authorName,
          bio: formData.bio,
          location: formData.location,
          website: formData.website,
          avatar: result.data?.user?.avatar
        })
        
        setAvatar(result.data?.user?.avatar || avatar)
        setSelectedFile(null)
      } else {
        // Update profile data without photo
        const response = await adminAPI.updateAdminProfile(formData)
        
        // Update user context to reflect changes in navbar
        updateUser({
          name: formData.name,
          username: formData.authorName,
          bio: formData.bio,
          location: formData.location,
          website: formData.website,
          avatar: response.data?.user?.avatar || avatar
        })
      }
      
      setMessage('Admin profile updated successfully!')
    } catch (error: any) {
      setMessage(error.response?.data?.message || error.message || 'Failed to update admin profile')
    } finally {
      setSaving(false)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setAvatar(previewUrl)
    }
  }



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/profile" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Edit Admin Profile</h1>
            </div>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white mt-4 rounded-lg border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Image
                  src={getAvatarUrl(avatar)}
                  alt="Admin Profile"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
                <input
                  type="file"
                  id="profilePhoto"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <button 
                  type="button"
                  onClick={() => document.getElementById('profilePhoto')?.click()}
                  className="absolute bottom-0 right-0 bg-purple-500 text-white p-2 rounded-full hover:bg-purple-600 transition-colors"
                >
                  <Camera size={16} />
                </button>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Admin Profile Photo</h3>
                <p className="text-sm text-gray-600">Click the camera icon to update your photo</p>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>

            {/* Author Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author Name
              </label>
              <input
                type="text"
                value={formData.authorName}
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-900 bg-white"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="City, Country"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="yourwebsite.com"
              />
            </div>
          </form>
          
          {/* Message */}
          {message && (
            <div className={`mt-4 p-3 rounded-lg text-center ${
              message.includes('successfully') 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}