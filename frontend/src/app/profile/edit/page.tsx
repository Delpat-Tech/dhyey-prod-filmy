'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Camera, Save, User, FileText } from 'lucide-react'
import { userAPI } from '@/lib/api'

export default function EditProfilePage() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
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
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await userAPI.getMe()
      
      const user = response.data.user
      setFormData({
        name: user.name || '',
        username: user.username || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || ''
      })
      setAvatar(user.avatar || '')
    } catch (error) {
      console.error('Error fetching user data:', error)
      setMessage('Failed to load user data')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      if (selectedFile) {
        const formDataWithImage = new FormData()
        formDataWithImage.append('avatar', selectedFile)
        Object.keys(formData).forEach(key => {
          formDataWithImage.append(key, formData[key as keyof typeof formData])
        })
        
        const response = await userAPI.updateMeWithImage(formDataWithImage)
        setAvatar(response.data.user.avatar)
        setSelectedFile(null)
      } else {
        await userAPI.updateMe(formData)
      }
      
      setMessage('Profile updated successfully!')
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const previewUrl = URL.createObjectURL(file)
      setAvatar(previewUrl)
    }
  }



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
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
              <Link href="/profile" className="text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Edit Profile</h1>
            </div>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="mt-4 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Picture Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Image
                    src={avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'}
                    alt="Profile"
                    width={100}
                    height={100}
                    className="rounded-full object-cover border-4 border-gray-100"
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
                    className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors shadow-lg"
                  >
                    <Camera size={16} />
                  </button>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Profile Photo</h3>
                  <p className="text-sm text-gray-600 mb-2">Click the camera icon to update your photo</p>
                  <p className="text-xs text-gray-500">JPG, PNG or GIF. Max size 5MB.</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <User size={20} className="text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white transition-colors"
                    placeholder="Choose a unique username"
                  />
                </div>
              </div>
            </div>

            {/* About & Location */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <FileText size={20} className="text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">About & Location</h2>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-900 bg-white transition-colors"
                    placeholder="Tell us about yourself..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Max 500 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white transition-colors"
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white transition-colors"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </div>
          </form>
          
          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg text-center font-medium ${
              message.includes('successfully') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}