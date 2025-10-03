'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Settings, Edit, MapPin, Calendar, Link as LinkIcon } from 'lucide-react'
import api from '@/lib/api'

interface UserData {
  _id: string
  name: string
  username: string
  avatar?: string
  bio?: string
  location?: string
  website?: string
  updatedAt: string
  stats: {
    storiesCount: number
    followersCount: number
    followingCount: number
    likesCount: number
  }
}

export default function ProfileHeader() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await api.get('/users/me')
      setUserData(response.data.data.user)
    } catch (error: any) {
      console.error('Failed to fetch user data:', error)
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-6">
          <div className="animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 md:w-32 md:h-32 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-32 mb-4"></div>
                <div className="h-10 bg-gray-300 rounded w-32"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-6 text-center">
          <p className="text-gray-500">Failed to load profile data</p>
        </div>
      </div>
    )
  }

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  }

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 py-6">
        <div className="flex items-start space-x-4 mb-4">
          <Image
            src={userData.avatar?.startsWith('http') ? userData.avatar : `http://localhost:5000/${userData.avatar || 'uploads/avatars/default.jpg'}`}
            alt={userData.name}
            width={80}
            height={80}
            className="rounded-full"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900 truncate">
              {userData.name}
            </h1>
            <p className="text-gray-600 mb-2">@{userData.username}</p>
            
            <div className="flex space-x-2">
              <Link 
                href="/profile/edit"
                className="flex-1 bg-gray-100 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
              >
                <Edit size={16} className="inline mr-2" />
                Edit Profile
              </Link>
              <Link 
                href="/settings"
                className="px-3 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center justify-center"
              >
                <Settings size={16} />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex justify-around py-4 border-y border-gray-100 mb-4">
          <div className="text-center">
            <div className="font-bold text-lg text-gray-900">{userData.stats.storiesCount}</div>
            <div className="text-sm text-gray-600">Stories</div>
          </div>
          <Link href="/profile/followers" className="text-center">
            <div className="font-bold text-lg text-gray-900">{userData.stats.followersCount.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Followers</div>
          </Link>
          <Link href="/profile/following" className="text-center">
            <div className="font-bold text-lg text-gray-900">{userData.stats.followingCount}</div>
            <div className="text-sm text-gray-600">Following</div>
          </Link>
          <div className="text-center">
            <div className="font-bold text-lg text-gray-900">{userData.stats.likesCount.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Likes</div>
          </div>
        </div>

        <div className="space-y-2">
          {userData.bio && (
            <p className="text-gray-900 whitespace-pre-line">{userData.bio}</p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            {userData.location && (
              <div className="flex items-center space-x-1">
                <MapPin size={14} />
                <span>{userData.location}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>Joined {formatJoinDate(userData.updatedAt)}</span>
            </div>
            {userData.website && (
              <div className="flex items-center space-x-1">
                <LinkIcon size={14} />
                <a href={`https://${userData.website}`} className="text-purple-600 hover:underline">
                  {userData.website}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}