'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import ProfileActions from './ProfileActions'
import ProfileStats from './ProfileStats'
import ProfileBio from './ProfileBio'
import { shareProfile } from '@/lib/errorHandler'
import { useAuth } from '@/contexts/AuthContext'
import { userAPI } from '@/lib/api'

export default function ProfileHeader() {
  const { user } = useAuth()
  const [profileData, setProfileData] = useState<any>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        if (user) {
          // Load current user's profile
          const response = await userAPI.getMe()
          setProfileData(response.data.user)
        }
      } catch (error) {
        console.error('Failed to load profile:', error)
        // Fallback to user data from context
        setProfileData(user)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfileData()
  }, [user])

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  const handleShare = (platform: string) => {
    if (profileData) {
      shareProfile(platform, profileData)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
            <div className="w-20 h-20 md:w-[150px] md:h-[150px] bg-gray-200 rounded-full animate-pulse mb-4 md:mb-0"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-6 text-center">
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 py-6">
        {/* Responsive Layout */}
        <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
          {/* Avatar */}
          <Image
            src={profileData.avatar || '/default-avatar.png'}
            alt={profileData.name || 'User'}
            width={80}
            height={80}
            className="rounded-full md:w-[150px] md:h-[150px] mb-4 md:mb-0"
          />

          {/* Profile Info */}
          <div className="flex-1">
            {/* Name and Username */}
            <div className="mb-4">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                {profileData.name || 'User'}
              </h1>
              <p className="text-gray-600 mb-3 md:mb-4">@{profileData.username || 'username'}</p>
              
              {/* Action Buttons */}
              <ProfileActions
                isOwnProfile={true}
                isFollowing={isFollowing}
                onFollow={handleFollow}
                onShare={handleShare}
                userData={profileData}
              />
            </div>

            {/* Stats */}
            <ProfileStats stats={profileData.stats || {}} isMobile={false} />
            
            {/* Mobile Stats */}
            <div className="md:hidden">
              <ProfileStats stats={profileData.stats || {}} isMobile={true} />
            </div>

            {/* Bio */}
            <ProfileBio
              bio={profileData.bio || ''}
              location={profileData.location || ''}
              joinDate={profileData.joinDate || new Date().toISOString()}
              website={profileData.website || ''}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
