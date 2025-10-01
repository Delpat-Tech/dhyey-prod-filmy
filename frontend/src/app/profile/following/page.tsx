'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, UserMinus } from 'lucide-react'
import { useState } from 'react'

// Mock following data
const followingData = [
  {
    id: 1,
    name: 'Literary Magazine',
    username: 'literarymagazine',
    avatar: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=50&h=50&fit=crop',
    bio: 'Publishing the best contemporary fiction',
    isFollowing: true
  },
  {
    id: 2,
    name: 'Writing Tips Daily',
    username: 'writingtips',
    avatar: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=50&h=50&fit=crop',
    bio: 'Daily tips for aspiring writers',
    isFollowing: true
  },
  {
    id: 3,
    name: 'Book Reviews Hub',
    username: 'bookreviews',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
    bio: 'Honest reviews of the latest books',
    isFollowing: true
  },
  {
    id: 4,
    name: 'Creative Writing',
    username: 'creativewriting',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
    bio: 'Community for creative writers',
    isFollowing: true
  }
]

export default function FollowingPage() {
  const [following, setFollowing] = useState(followingData)

  const toggleFollow = (userId: number) => {
    setFollowing(prev => prev.map(user => 
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
              <h1 className="text-xl font-bold text-gray-900">Following</h1>
              <p className="text-sm text-gray-600">{following.length} following</p>
            </div>
          </div>
        </div>

        {/* Following List */}
        <div className="bg-white mt-4 rounded-lg border border-gray-200">
          <div className="divide-y divide-gray-200">
            {following.map((user) => (
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
                    {user.isFollowing && <UserMinus size={16} />}
                    <span>{user.isFollowing ? 'Following' : 'Follow'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {following.length === 0 && (
          <div className="bg-white mt-4 rounded-lg border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <UserMinus size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Not Following Anyone</h3>
            <p className="text-gray-600">Discover amazing writers to follow!</p>
            <Link 
              href="/"
              className="inline-block mt-4 bg-purple-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-600 transition-colors"
            >
              Explore Stories
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
