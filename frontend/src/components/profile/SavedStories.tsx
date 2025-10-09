'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, MessageCircle, Bookmark, Clock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { userAPI, storyAPI } from '@/lib/api'
import { getImageUrl, getAvatarUrl } from '@/lib/imageUtils'

// Mock saved stories data
const savedStories = [
  {
    id: 7,
    title: "The Art of Letting Go",
    author: {
      name: "Maya Patel",
      username: "mayapoetry",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face"
    },
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    genre: "Poetry",
    likes: 234,
    comments: 19,
    savedAt: "2 days ago",
    excerpt: "Like autumn leaves that dance on wind, our memories float away..."
  },
  {
    id: 8,
    title: "Midnight in Tokyo",
    author: {
      name: "Yuki Tanaka",
      username: "yukistories",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face"
    },
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&h=300&fit=crop",
    genre: "Fiction",
    likes: 567,
    comments: 45,
    savedAt: "1 week ago",
    excerpt: "The neon lights reflected off the wet streets as I walked through Shibuya..."
  },
  {
    id: 9,
    title: "The Digital Nomad's Journey",
    author: {
      name: "Alex Thompson",
      username: "alexwrites",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
    },
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300&h=300&fit=crop",
    genre: "Non-Fiction",
    likes: 342,
    comments: 28,
    savedAt: "2 weeks ago",
    excerpt: "Working from coffee shops around the world taught me more than any office..."
  }
]

interface SavedStoriesProps {
  activeTab?: string
}

export default function SavedStories({ activeTab }: SavedStoriesProps) {
  const { user } = useAuth()
  const [stories, setStories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      fetchSavedStories()
    }
  }, [user?.id])

  // Refetch when saved tab becomes active
  useEffect(() => {
    if (activeTab === 'saved' && user?.id) {
      fetchSavedStories()
    }
  }, [activeTab, user?.id])

  // Listen for saved stories updates
  useEffect(() => {
    const handleSavedStoriesUpdate = () => {
      if (activeTab === 'saved' && user?.id) {
        fetchSavedStories()
      }
    }

    window.addEventListener('savedStoriesUpdated', handleSavedStoriesUpdate)
    return () => window.removeEventListener('savedStoriesUpdated', handleSavedStoriesUpdate)
  }, [activeTab, user?.id])

  const fetchSavedStories = async () => {
    try {
      setLoading(true)
      console.log('Fetching saved stories for user:', user!.id)
      const response = await userAPI.getUserSavedStories(user!.id)
      console.log('Saved stories response:', response)
      console.log('Full response data:', response.data)
      const stories = response.data?.stories || response.data?.savedStories || response.data || []
      console.log('Setting saved stories:', stories)
      setStories(stories)
    } catch (error) {
      console.error('Error fetching saved stories:', error)
      setStories(savedStories)
    } finally {
      setLoading(false)
    }
  }

  const handleUnsave = async (storyId: string) => {
    try {
      await storyAPI.saveStory(storyId)
      setStories(stories.filter(story => story._id !== storyId && story.id !== storyId))
    } catch (error) {
      console.error('Error unsaving story:', error)
    }
  }

  const handleLike = async (storyId: string) => {
    try {
      await storyAPI.likeStory(storyId)
      setStories(stories.map(story => {
        if (story._id === storyId || story.id === storyId) {
          const currentLikes = story.likes || story.stats?.likes || 0
          const isLiked = story.isLiked
          return {
            ...story,
            isLiked: !isLiked,
            likes: isLiked ? currentLikes - 1 : currentLikes + 1,
            stats: story.stats ? { ...story.stats, likes: isLiked ? currentLikes - 1 : currentLikes + 1 } : undefined
          }
        }
        return story
      }))
    } catch (error) {
      console.error('Error liking story:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (stories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Bookmark size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Saved Stories</h3>
        <p className="text-gray-600">Stories you save will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Saved Stories</h3>
        <button 
          onClick={fetchSavedStories}
          className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
        >
          Refresh
        </button>
      </div>
      <div className="text-sm text-gray-500 mb-2">
        Found {stories.length} saved stories
      </div>
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
                        <span>Saved {story.savedAt}</span>
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
                    onClick={() => handleLike(storyId)}
                    className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                  >
                    <Heart size={16} className={story.isLiked ? 'fill-red-500 text-red-500' : ''} />
                    <span>{story.likes || story.stats?.likes || 0}</span>
                  </button>
                  <div className="flex items-center space-x-1">
                    <MessageCircle size={16} />
                    <span>{story.comments || story.stats?.comments || 0}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleUnsave(storyId)}
                    className="text-purple-600 hover:text-purple-700 p-1 transition-colors"
                    title="Remove from saved"
                  >
                    <Bookmark size={16} className="fill-purple-600" />
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
