'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, UserPlus } from 'lucide-react'
import { useState } from 'react'

// Mock followers data
const followersData = [
  {
    id: 1,
    name: 'Emma Wilson',
    username: 'emmawrites',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
    bio: 'Fiction writer and storyteller',
    isFollowing: true
  },
  {
    id: 2,
    name: 'David Kim',
    username: 'davidcodes',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
    bio: 'Tech writer and developer',
    isFollowing: false
  },
  {
    id: 3,
    name: 'Maya Patel',
    username: 'mayapoetry',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
    bio: 'Poet and creative writer',
    isFollowing: true
  },
  {
    id: 4,
    name: 'Alex Thompson',
    username: 'alexwrites',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
    bio: 'Travel writer and blogger',
    isFollowing: false
  }
]

export default function FollowersPage() {
  const [followers, setFollowers] = useState(followersData)

  const toggleFollow = (userId: number) => {
    setFollowers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, isFollowing: !user.isFollowing }
        : user
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/profile" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Followers</h1>
              <p className="text-sm text-gray-600">{followers.length} followers</p>
            </div>
          </div>
        </div>

        {/* Followers List */}
        <div className="bg-white mt-4 rounded-lg border border-gray-200">
          <div className="divide-y divide-gray-200">
            {followers.map((user) => (
              <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Link href={`/profile/${user.username}`}>
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link 
                        href={`/profile/${user.username}`}
                        className="block"
                      >
                        <h3 className="font-semibold text-gray-900 hover:text-purple-600">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-600">@{user.username}</p>
                        {user.bio && (
                          <p className="text-sm text-gray-500 mt-1">{user.bio}</p>
                        )}
                      </Link>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleFollow(user.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                      user.isFollowing
                        ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        : 'bg-purple-500 text-white hover:bg-purple-600'
                    }`}
                  >
                    {!user.isFollowing && <UserPlus size={16} />}
                    <span>{user.isFollowing ? 'Following' : 'Follow'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {followers.length === 0 && (
          <div className="bg-white mt-4 rounded-lg border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <UserPlus size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Followers Yet</h3>
            <p className="text-gray-600">Share your stories to attract followers!</p>
          </div>
        )}
      </div>
    </div>
  )
}
