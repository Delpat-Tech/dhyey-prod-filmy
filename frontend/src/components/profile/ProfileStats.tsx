'use client'

import Link from 'next/link'

interface ProfileStatsProps {
  stats: {
    stories?: number
    followers?: number
    following?: number
    likes?: number
  }
  isMobile?: boolean
}

export default function ProfileStats({ stats, isMobile = false }: ProfileStatsProps) {
  // Provide default values for all stats
  const safeStats = {
    stories: stats?.stories || 0,
    followers: stats?.followers || 0,
    following: stats?.following || 0,
    likes: stats?.likes || 0
  }
  if (isMobile) {
    return (
      <div className="flex justify-around py-4 border-y border-gray-100 mb-4">
        <button className="text-center hover:bg-gray-50 px-2 py-1 rounded transition-colors">
          <div className="font-bold text-lg text-gray-900">{safeStats.stories}</div>
          <div className="text-sm text-gray-600">Stories</div>
        </button>
        <Link href="/profile/followers" className="text-center hover:bg-gray-50 px-2 py-1 rounded transition-colors">
          <div className="font-bold text-lg text-gray-900">{safeStats.followers.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Followers</div>
        </Link>
        <Link href="/profile/following" className="text-center hover:bg-gray-50 px-2 py-1 rounded transition-colors">
          <div className="font-bold text-lg text-gray-900">{safeStats.following}</div>
          <div className="text-sm text-gray-600">Following</div>
        </Link>
        <button className="text-center hover:bg-gray-50 px-2 py-1 rounded transition-colors">
          <div className="font-bold text-lg text-gray-900">{safeStats.likes.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Likes</div>
        </button>
      </div>
    )
  }

  return (
    <div className="flex space-x-8 mb-4">
      <button className="hover:bg-gray-50 px-2 py-1 rounded transition-colors">
        <span className="font-bold text-gray-900">{safeStats.stories}</span>
        <span className="text-gray-600 ml-1">stories</span>
      </button>
      <Link href="/profile/followers" className="hover:bg-gray-50 px-2 py-1 rounded transition-colors">
        <span className="font-bold text-gray-900">{safeStats.followers.toLocaleString()}</span>
        <span className="text-gray-600 ml-1">followers</span>
      </Link>
      <Link href="/profile/following" className="hover:bg-gray-50 px-2 py-1 rounded transition-colors">
        <span className="font-bold text-gray-900">{safeStats.following}</span>
        <span className="text-gray-600 ml-1">following</span>
      </Link>
      <button className="hover:bg-gray-50 px-2 py-1 rounded transition-colors">
        <span className="font-bold text-gray-900">{safeStats.likes.toLocaleString()}</span>
        <span className="text-gray-600 ml-1">likes</span>
      </button>
    </div>
  )
}
