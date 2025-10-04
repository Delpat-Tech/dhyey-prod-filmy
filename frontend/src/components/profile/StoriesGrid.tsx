'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, MessageCircle, Eye, Plus, Grid } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { storyAPI } from '@/lib/api'

interface Story {
  _id: string
  title: string
  image?: string
  genre: string
  stats: {
    likes: number
    comments: number
    views: number
  }
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'unpublished'
}

export default function StoriesGrid() {
  const { user } = useAuth()
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user?.id) {
      fetchUserStories()
    }
  }, [user?.id])

  const fetchUserStories = async () => {
    try {
      setLoading(true)
      const response = await storyAPI.getUserStories(user!.id)
      console.log('Fetched stories:', response.data.stories)
      setStories(response.data.stories)
    } catch (err: any) {
      console.error('Error fetching stories:', err)
      setError(err.message || 'Failed to fetch stories')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchUserStories}
          className="text-purple-600 hover:text-purple-700 font-medium"
        >
          Try Again
        </button>
      </div>
    )
  }

  const publishedStories = stories.filter(story => story.status === 'approved')
  const draftStories = stories.filter(story => story.status === 'draft')
  const reviewStories = stories.filter(story => story.status === 'pending')

  return (
    <div className="space-y-8">
      {/* Create New Story Button */}
      <Link 
        href="/create"
        className="block w-full p-8 border-2 border-dashed border-gray-300 rounded-xl text-center hover:border-purple-400 hover:bg-purple-50 transition-colors group"
      >
        <Plus size={32} className="mx-auto text-gray-400 group-hover:text-purple-500 mb-2" />
        <p className="text-gray-600 group-hover:text-purple-600 font-medium">Create New Story</p>
      </Link>

      {/* Published Stories */}
      {publishedStories.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Published Stories</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {publishedStories.map((story) => (
              <Link key={story._id} href={`/story/${story._id}`} className="group">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">{story.title.charAt(0)}</span>
                  </div>
                  
                  {/* Overlay with stats */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center space-x-4 text-white">
                      <div className="flex items-center space-x-1">
                        <Heart size={16} />
                        <span className="text-sm font-medium">{story.stats.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle size={16} />
                        <span className="text-sm font-medium">{story.stats.comments}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye size={16} />
                        <span className="text-sm font-medium">{story.stats.views}</span>
                      </div>
                    </div>
                  </div>

                  {/* Genre Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs font-medium rounded-full">
                      {story.genre}
                    </span>
                  </div>
                </div>
                
                <div className="mt-2">
                  <h4 className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                    {story.title}
                  </h4>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                    <span>{story.stats.likes} likes</span>
                    <span>{story.stats.views} views</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Stories Under Review */}
      {reviewStories.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Under Review</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviewStories.map((story) => (
              <Link key={story._id} href={`/story/${story._id}`} className="group">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center opacity-75 group-hover:opacity-90 transition-opacity">
                    <span className="text-white text-2xl font-bold">{story.title.charAt(0)}</span>
                  </div>
                  
                  {/* Review Status Overlay */}
                  <div className="absolute inset-0 bg-yellow-500 bg-opacity-20 flex items-center justify-center">
                    <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Under Review
                    </div>
                  </div>

                  {/* Genre Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs font-medium rounded-full">
                      {story.genre}
                    </span>
                  </div>
                </div>
                
                <div className="mt-2">
                  <h4 className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                    {story.title}
                  </h4>
                  <p className="text-sm text-yellow-600 mt-1">Waiting for approval</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Draft Stories */}
      {draftStories.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Drafts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {draftStories.map((story) => (
              <button 
                key={story._id} 
                onClick={() => alert('Coming Soon!')} 
                className="group text-left w-full"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center opacity-50 group-hover:opacity-75 transition-opacity">
                    <span className="text-white text-2xl font-bold">{story.title.charAt(0)}</span>
                  </div>
                  
                  {/* Draft Status Overlay */}
                  <div className="absolute inset-0 bg-gray-500 bg-opacity-20 flex items-center justify-center">
                    <div className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Draft
                    </div>
                  </div>

                  {/* Genre Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs font-medium rounded-full">
                      {story.genre}
                    </span>
                  </div>
                </div>
                
                <div className="mt-2">
                  <h4 className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                    {story.title}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">Continue editing</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {stories.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Grid size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Stories Yet</h3>
          <p className="text-gray-600 mb-4">Start sharing your creativity with the world</p>
          <Link 
            href="/create"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            <Plus size={16} />
            <span>Create Your First Story</span>
          </Link>
        </div>
      )}
    </div>
  )
}