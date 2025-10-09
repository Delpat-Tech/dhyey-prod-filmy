'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, MessageCircle, Bookmark, Clock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { storyAPI, userAPI } from '@/lib/api'
import { getImageUrl, getAvatarUrl } from '@/lib/imageUtils'

// Mock liked stories data
const likedStories = [
  {
    id: 10,
    title: "Code of the Heart",
    author: {
      name: "David Kim",
      username: "davidcodes",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
    },
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=300&fit=crop",
    genre: "Romance",
    likes: 189,
    comments: 23,
    likedAt: "3 hours ago",
    excerpt: "In the world of algorithms and data structures, love was the one equation I couldn't solve..."
  },
  {
    id: 11,
    title: "Whispers of the Forest",
    author: {
      name: "Luna Martinez",
      username: "lunapoetry",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face"
    },
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop",
    genre: "Poetry",
    likes: 156,
    comments: 8,
    likedAt: "1 day ago",
    excerpt: "Beneath the canopy of ancient oaks, where sunlight dances and shadow cloaks..."
  },
  {
    id: 12,
    title: "The Time Traveler's Dilemma",
    author: {
      name: "Marcus Chen",
      username: "marcusscifi",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face"
    },
    image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=300&fit=crop",
    genre: "Sci-Fi",
    likes: 423,
    comments: 67,
    likedAt: "3 days ago",
    excerpt: "Every choice creates a new timeline, but some choices should never be made..."
  }
]

export default function LikedStories() {
  const { user } = useAuth()
  const [stories, setStories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLikedStories = async () => {
      try {
        setLoading(true)
        const response = await userAPI.getUserLikedStories()
        setStories(response.data.stories || [])
      } catch (error) {
        console.error('Failed to load liked stories:', error)
        setStories(likedStories) // Fallback to mock data
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadLikedStories()
    }
  }, [user])

  const handleUnlike = async (storyId: string) => {
    try {
      await storyAPI.likeStory(storyId)
      setStories(stories.filter(story => story._id !== storyId && story.id !== storyId))
    } catch (error) {
      console.error('Error unliking story:', error)
    }
  }

  const handleSave = async (storyId: string) => {
    try {
      await storyAPI.saveStory(storyId)
      setStories(stories.map(story => {
        if (story._id === storyId || story.id === storyId) {
          return { ...story, isSaved: !story.isSaved }
        }
        return story
      }))
    } catch (error) {
      console.error('Error saving story:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden animate-pulse">
            <div className="md:flex">
              <div className="md:w-48 h-48 md:h-auto bg-gray-200"></div>
              <div className="flex-1 p-4 md:p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (stories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Heart size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Liked Stories</h3>
        <p className="text-gray-600">Stories you like will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {stories.map((story) => {
        const storyId = story._id || story.id
        return (
        <div key={storyId} className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
          <div className="md:flex">
            {/* Story Image */}
            <div className="md:w-48 h-48 md:h-auto relative flex-shrink-0">
              <Link href={`/story/${storyId}`}>
                <Image
                  src={getImageUrl(story.image)}
                  alt={story.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </div>

            {/* Story Content */}
            <div className="flex-1 p-4 md:p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Link href={`/profile/${story.author?.username || 'user'}`}>
                    <Image
                      src={getAvatarUrl(story.author?.avatar)}
                      alt={story.author?.name || 'User'}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </Link>
                  <div>
                    <Link 
                      href={`/profile/${story.author?.username || 'user'}`}
                      className="font-medium text-gray-900 hover:text-purple-600"
                    >
                      {story.author?.name || 'User'}
                    </Link>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>@{story.author?.username || 'user'}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>Liked {story.likedAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  {story.genre}
                </span>
              </div>

              <Link href={`/story/${storyId}`}>
                <h3 className="font-bold text-lg text-gray-900 mb-2 hover:text-purple-600 transition-colors">
                  {story.title}
                </h3>
                <p className="text-gray-700 mb-3 line-clamp-2">
                  {story.excerpt || story.content?.substring(0, 150) + '...'}
                </p>
              </Link>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <button 
                    onClick={() => handleUnlike(storyId)}
                    className="flex items-center space-x-1 hover:text-red-600 transition-colors"
                    title="Unlike"
                  >
                    <Heart size={16} className="fill-red-500 text-red-500" />
                    <span>{story.likes || story.stats?.likes || 0}</span>
                  </button>
                  <div className="flex items-center space-x-1">
                    <MessageCircle size={16} />
                    <span>{story.comments || story.stats?.comments || 0}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleSave(storyId)}
                    className="text-gray-600 hover:text-purple-600 p-1 transition-colors"
                    title={story.isSaved ? 'Unsave' : 'Save'}
                  >
                    <Bookmark size={16} className={story.isSaved ? 'fill-purple-600 text-purple-600' : ''} />
                  </button>
                  <Link 
                    href={`/story/${storyId}`}
                    className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                  >
                    Read
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )})}
    </div>
  )
}
