'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Share2, MoreHorizontal, Calendar, Clock, X } from 'lucide-react'
import { getImageUrl, getAvatarUrl } from '@/lib/imageUtils'
import { toast } from '@/lib/toast'

interface StoryHeaderProps {
  story: {
    id: number
    title: string
    status?: string
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
  const [showImageModal, setShowImageModal] = useState(false)
  const shareMenuRef = useRef<HTMLDivElement>(null)
  const moreMenuRef = useRef<HTMLDivElement>(null)

  // Check if story is under review
  const isUnderReview = story.status && !['approved'].includes(story.status)

  const handleFollow = () => {
    const newFollowingState = !isFollowing
    setIsFollowing(newFollowingState)

    // Show toast message
    if (newFollowingState) {
      toast.success(`Following ${story.author.name}!`)
    } else {
      toast.success(`Unfollowed ${story.author.name}`)
    }
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
        toast.success('Link copied to clipboard!')
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

        {/* Author Info - Hidden for stories under review */}
        {!isUnderReview && (
          <div className="flex items-center justify-between mb-6">
            <Link 
              href={`/profile/${story.author.username}`} 
              className="flex items-center space-x-4 hover:opacity-80 transition-opacity"
            >
              {story.author.avatar ? (
                <Image
                  src={getAvatarUrl(story.author.avatar)}
                  alt={story.author.name}
                  width={50}
                  height={50}
                  className="rounded-full object-cover border-2 border-transparent hover:border-purple-200 transition-colors"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center border-2 border-transparent hover:border-purple-200 transition-colors">
                  <span className="text-white font-bold text-lg">{story.author.name.charAt(0)}</span>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-900 hover:text-purple-600 transition-colors">
                  {story.author.name}
                </h3>
                <p className="text-sm text-gray-600">
                  @{story.author.username} • {(story.author.followers || 0).toLocaleString()} followers
                </p>
              </div>
            </Link>

            <button
              onClick={handleFollow}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
                isFollowing
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl backdrop-blur-sm'
                  : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl backdrop-blur-sm'
              }`}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          </div>
        )}

        {/* Story Meta */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
          <div className="flex items-center space-x-1">
            <Calendar size={16} />
            <span>{formatDate(story.publishedAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>{story.readTime}</span>
          </div>

        </div>

        {/* Featured Image */}
        {story.image && (
          <div 
            className="relative aspect-video rounded-xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
            onClick={() => setShowImageModal(true)}
          >
            <Image
              src={getImageUrl(story.image)}
              alt={story.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X size={32} />
            </button>
            <Image
              src={getImageUrl(story.image)}
              alt={story.title}
              width={1200}
              height={800}
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
          <div 
            className="absolute inset-0" 
            onClick={() => setShowImageModal(false)}
          />
        </div>
      )}
    </div>
  )
}
