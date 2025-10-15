'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import ProfileActions from './ProfileActions'
import ProfileStats from './ProfileStats'
import ProfileBio from './ProfileBio'
import { shareProfile } from '@/lib/errorHandler'
import { useAuth } from '@/contexts/AuthContext'
import { userAPI, storyAPI } from '@/lib/api'
import { getAvatarUrl } from '@/lib/imageUtils'

interface ProfileHeaderProps {
  username?: string
}

export default function ProfileHeader({ username }: ProfileHeaderProps) {
  const { user, isLoading: authLoading } = useAuth()
  const [isFollowing, setIsFollowing] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // If no username provided, show current user's profile
  const isOwnProfile = !username || username === user?.username

  useEffect(() => {
    const fetchProfileData = async () => {
      if (isOwnProfile) {
        if (user) {
          try {
            const response = await userAPI.getMe()
            const userData = response.data.user
            
            // Fetch actual published story count
            try {
              const storiesResponse = await storyAPI.getUserStories(userData._id)
              const publishedStories = storiesResponse.data.stories.filter(story => story.status === 'approved' || story.status === 'published')
              userData.stats = {
                ...userData.stats,
                stories: publishedStories.length
              }
            } catch (storyError) {
              console.error('Error fetching user stories:', storyError)
            }
            
            setProfileData(userData)
          } catch (error) {
            console.error('Error fetching user data:', error)
            setProfileData(user)
          }
        } else {
          setProfileData(user)
        }
        setIsLoading(authLoading)
      } else if (username) {
        try {
          const response = await userAPI.getUserProfile(username)
          setProfileData(response.data.user)
        } catch (error) {
          console.error('Error fetching profile:', error)
          setProfileData(null)
        }
        setIsLoading(false)
      }
    }

    fetchProfileData()
  }, [user, username, authLoading, isOwnProfile])

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
            src={getAvatarUrl(profileData.avatar)}
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
                isOwnProfile={isOwnProfile}
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
