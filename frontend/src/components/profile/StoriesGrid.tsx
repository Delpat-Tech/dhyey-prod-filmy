// frontend/src/components/profile/StoriesGrid.tsx

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
  const rejectedStories = stories.filter(story => story.status === 'rejected')

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
        <div className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 border border-purple-100 rounded-2xl p-6 shadow-sm shadow-purple-200/50">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-semibold text-purple-800">Published Stories</h3>
            <span className="flex-1 h-px bg-gradient-to-r from-purple-200 via-indigo-200 to-transparent" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {publishedStories.map((story) => (
              <Link key={story._id} href={`/story/${story._id}`} className="group">
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-purple-200/70 bg-gradient-to-br from-purple-700 via-indigo-700 to-slate-900 shadow-md shadow-purple-200/40">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-semibold text-white/90 tracking-[0.35em]">
                      {story.title.charAt(0)}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/25 via-indigo-900/30 to-slate-900/35 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]" />

                  {/* Overlay with stats */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex items-center space-x-4 text-white">
                      <div className="flex items-center space-x-1 text-sm font-medium">
                        <Heart size={16} />
                        <span>{story.stats.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm font-medium">
                        <MessageCircle size={16} />
                        <span>{story.stats.comments}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm font-medium">
                        <Eye size={16} />
                        <span>{story.stats.views}</span>
                      </div>
                    </div>
                  </div>

                  {/* Genre Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 rounded-full border border-white/20 bg-white/10 text-white text-xs font-medium backdrop-blur-sm">
                      {story.genre}
                    </span>
                  </div>
                </div>
                
                <div className="mt-2">
                  <h4 className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                    {story.title}
                  </h4>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-purple-600/80">
                    <span>{story.stats.likes} likes</span>
                    <span>{story.stats.views} views</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Under Review Stories */}
      {reviewStories.length > 0 && (
        <div className="bg-gradient-to-br from-yellow-50 via-white to-orange-50 border border-yellow-100 rounded-2xl p-6 shadow-sm shadow-yellow-200/50">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-semibold text-yellow-800">Under Review</h3>
            <span className="flex-1 h-px bg-gradient-to-r from-yellow-200 via-orange-200 to-transparent" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {reviewStories.map((story) => (
              <Link key={story._id} href={`/story/${story._id}`} className="group">
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-yellow-200/70 bg-gradient-to-br from-yellow-600 via-orange-600 to-red-700 shadow-md shadow-yellow-200/40">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-semibold text-white/90 tracking-[0.35em]">
                      {story.title.charAt(0)}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 rounded-full border border-white/20 bg-white/10 text-white text-xs font-medium backdrop-blur-sm">
                      Under Review
                    </span>
                  </div>

                  {/* Genre Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 rounded-full border border-white/20 bg-white/10 text-white text-xs font-medium backdrop-blur-sm">
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

      {/* Rejected Stories */}
      {rejectedStories.length > 0 && (
        <div className="bg-gradient-to-br from-red-50 via-white to-pink-50 border border-red-100 rounded-2xl p-6 shadow-sm shadow-red-200/50">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-semibold text-red-800">Rejected Stories</h3>
            <span className="flex-1 h-px bg-gradient-to-r from-red-200 via-pink-200 to-transparent" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {rejectedStories.map((story) => (
              <Link key={story._id} href={`/story/${story._id}`} className="group">
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-red-200/70 bg-gradient-to-br from-red-600 via-pink-600 to-rose-700 shadow-md shadow-red-200/40">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-semibold text-white/90 tracking-[0.35em]">
                      {story.title.charAt(0)}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 rounded-full border border-white/20 bg-white/10 text-white text-xs font-medium backdrop-blur-sm">
                      Rejected
                    </span>
                  </div>

                  {/* Genre Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 rounded-full border border-white/20 bg-white/10 text-white text-xs font-medium backdrop-blur-sm">
                      {story.genre}
                    </span>
                  </div>
                </div>
                
                <div className="mt-2">
                  <h4 className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                    {story.title}
                  </h4>
                  <p className="text-sm text-red-600 mt-1">Review feedback available</p>
                </div>
              </Link>
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