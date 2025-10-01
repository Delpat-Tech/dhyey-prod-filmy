'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
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
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const shareMenuRef = useRef<HTMLDivElement>(null)
  const moreMenuRef = useRef<HTMLDivElement>(null)

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false)
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleShare = () => {
    setShowShareMenu(!showShareMenu)
  }

  const handleMore = () => {
    setShowMoreMenu(!showMoreMenu)
  }

  const shareStory = async (platform: string) => {
    const url = window.location.href
    const title = story.title
    
    switch (platform) {
      case 'copy':
        await navigator.clipboard.writeText(url)
        alert('Link copied to clipboard!')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
        break
    }
    setShowShareMenu(false)
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
        
        <div className="flex items-center space-x-2 relative">
          <div className="relative" ref={shareMenuRef}>
            <button 
              onClick={handleShare}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Share2 size={20} />
            </button>
            
            {/* Share Menu */}
            {showShareMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl py-1 w-48 z-50">
                <button 
                  onClick={() => shareStory('copy')}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 transition-colors"
                >
                  Copy Link
                </button>
                <button 
                  onClick={() => shareStory('twitter')}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 transition-colors"
                >
                  Share on Twitter
                </button>
                <button 
                  onClick={() => shareStory('facebook')}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 transition-colors"
                >
                  Share on Facebook
                </button>
                <button 
                  onClick={() => shareStory('linkedin')}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 transition-colors"
                >
                  Share on LinkedIn
                </button>
              </div>
            )}
          </div>
          
          <div className="relative" ref={moreMenuRef}>
            <button 
              onClick={handleMore}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreHorizontal size={20} />
            </button>
            
            {/* More Menu */}
            {showMoreMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl py-1 w-48 z-50">
                <button 
                  onClick={() => {
                    console.log('Save Story clicked')
                    setShowMoreMenu(false)
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 transition-colors"
                >
                  Save Story
                </button>
                <button 
                  onClick={() => {
                    console.log('Report Story clicked')
                    setShowMoreMenu(false)
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 transition-colors"
                >
                  Report Story
                </button>
                <button 
                  onClick={() => {
                    console.log('Hide Story clicked')
                    setShowMoreMenu(false)
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 transition-colors"
                >
                  Hide Story
                </button>
                <hr className="my-1 border-gray-100" />
                <button 
                  onClick={() => {
                    console.log('Block Author clicked')
                    setShowMoreMenu(false)
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-red-50 text-sm text-red-600 transition-colors font-medium"
                >
                  Block Author
                </button>
              </div>
            )}
          </div>
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
          <Link 
            href={`/profile/${story.author.username}`} 
            className="flex items-center space-x-4 hover:opacity-80 transition-opacity"
          >
            <Image
              src={story.author.avatar}
              alt={story.author.name}
              width={50}
              height={50}
              className="rounded-full object-cover border-2 border-transparent hover:border-purple-200 transition-colors"
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
