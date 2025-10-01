'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Settings, Edit, Share, MoreHorizontal, MapPin, Calendar, Link as LinkIcon } from 'lucide-react'

// Mock user data - replace with API calls later
const userData = {
  name: "Sarah Johnson",
  username: "sarahjwrites",
  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  bio: "Storyteller | Fiction Writer | Coffee Enthusiast ☕\nLove crafting tales that touch hearts and minds ✨",
  location: "New York, NY",
  joinDate: "March 2023",
  website: "sarahjohnson.com",
  stats: {
    stories: 24,
    followers: 1247,
    following: 389,
    likes: 5632
  },
  isOwnProfile: true // This would be determined by auth
}

export default function ProfileHeader() {
  const [isFollowing, setIsFollowing] = useState(false)

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 py-6">
        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Profile Info */}
          <div className="flex items-start space-x-4 mb-4">
            <Image
              src={userData.avatar}
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
              
              {/* Action Buttons */}
              <div className="flex space-x-2">
                {userData.isOwnProfile ? (
                  <>
                    <button className="flex-1 bg-gray-100 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                      <Edit size={16} className="inline mr-2" />
                      Edit Profile
                    </button>
                    <button className="px-3 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors">
                      <Settings size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleFollow}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                        isFollowing
                          ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          : 'bg-purple-500 text-white hover:bg-purple-600'
                      }`}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                    <button className="px-3 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors">
                      <Share size={16} />
                    </button>
                    <button className="px-3 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-around py-4 border-y border-gray-100 mb-4">
            <div className="text-center">
              <div className="font-bold text-lg text-gray-900">{userData.stats.stories}</div>
              <div className="text-sm text-gray-600">Stories</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-gray-900">{userData.stats.followers.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-gray-900">{userData.stats.following}</div>
              <div className="text-sm text-gray-600">Following</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-gray-900">{userData.stats.likes.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Likes</div>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <p className="text-gray-900 whitespace-pre-line">{userData.bio}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin size={14} />
                <span>{userData.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>Joined {userData.joinDate}</span>
              </div>
              <div className="flex items-center space-x-1">
                <LinkIcon size={14} />
                <a href={`https://${userData.website}`} className="text-purple-600 hover:underline">
                  {userData.website}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="flex items-start space-x-8">
            {/* Avatar */}
            <Image
              src={userData.avatar}
              alt={userData.name}
              width={150}
              height={150}
              className="rounded-full"
            />

            {/* Profile Info */}
            <div className="flex-1">
              {/* Name and Actions */}
              <div className="flex items-center space-x-4 mb-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {userData.name}
                </h1>
                
                {userData.isOwnProfile ? (
                  <div className="flex space-x-2">
                    <button className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                      <Edit size={16} className="inline mr-2" />
                      Edit Profile
                    </button>
                    <button className="px-3 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors">
                      <Settings size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleFollow}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        isFollowing
                          ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          : 'bg-purple-500 text-white hover:bg-purple-600'
                      }`}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                    <button className="px-3 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors">
                      <Share size={16} />
                    </button>
                    <button className="px-3 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Username */}
              <p className="text-gray-600 mb-4">@{userData.username}</p>

              {/* Stats */}
              <div className="flex space-x-8 mb-4">
                <div>
                  <span className="font-bold text-gray-900">{userData.stats.stories}</span>
                  <span className="text-gray-600 ml-1">stories</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900">{userData.stats.followers.toLocaleString()}</span>
                  <span className="text-gray-600 ml-1">followers</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900">{userData.stats.following}</span>
                  <span className="text-gray-600 ml-1">following</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900">{userData.stats.likes.toLocaleString()}</span>
                  <span className="text-gray-600 ml-1">likes</span>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <p className="text-gray-900 whitespace-pre-line">{userData.bio}</p>
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin size={14} />
                    <span>{userData.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>Joined {userData.joinDate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <LinkIcon size={14} />
                    <a href={`https://${userData.website}`} className="text-purple-600 hover:underline">
                      {userData.website}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
