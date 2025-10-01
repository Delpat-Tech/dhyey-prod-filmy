'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, Share2, MoreHorizontal, Calendar, Clock, Eye } from 'lucide-react'

interface StoryHeaderProps {
  story: {
    id: number
    title: string
    author: {
      name: string
      username: string
      avatar: string
      bio: string
      followers: number
      isFollowing: boolean
    }
    image: string
    genre: string
    hashtags: string[]
    publishedAt: string
    readTime: string
    stats: {
      views: number
    }
  }
}

export default function StoryHeader({ story }: StoryHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(story.author.isFollowing)

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Navigation */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <Link 
          href="/"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="hidden sm:inline">Back to Feed</span>
        </Link>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
            <Share2 size={20} />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Story Header */}
      <div className="p-6">
        {/* Genre Badge */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            {story.genre}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {story.title}
        </h1>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {story.hashtags.map((tag, index) => (
            <Link
              key={index}
              href={`/search?q=${encodeURIComponent(tag)}`}
              className="text-purple-600 hover:text-purple-700 hover:underline text-sm"
            >
              {tag}
            </Link>
          ))}
        </div>

        {/* Author Info */}
        <div className="flex items-center justify-between mb-6">
          <Link href={`/profile/${story.author.username}`} className="flex items-center space-x-4">
            <Image
              src={story.author.avatar}
              alt={story.author.name}
              width={50}
              height={50}
              className="rounded-full"
            />
            <div>
              <h3 className="font-semibold text-gray-900 hover:text-purple-600 transition-colors">
                {story.author.name}
              </h3>
              <p className="text-sm text-gray-600">
                @{story.author.username} • {story.author.followers.toLocaleString()} followers
              </p>
            </div>
          </Link>

          <button
            onClick={handleFollow}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              isFollowing
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-purple-500 text-white hover:bg-purple-600'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>

        {/* Story Meta */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
          <div className="flex items-center space-x-1">
            <Calendar size={16} />
            <span>{formatDate(story.publishedAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock size={16} />
            <span>{story.readTime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye size={16} />
            <span>{story.stats.views.toLocaleString()} views</span>
          </div>
        </div>

        {/* Featured Image */}
        {story.image && (
          <div className="relative aspect-video rounded-xl overflow-hidden">
            <Image
              src={story.image}
              alt={story.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
      </div>
    </div>
  )
}
