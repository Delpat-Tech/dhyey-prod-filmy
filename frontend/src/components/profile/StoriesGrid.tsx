'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, MessageCircle, Eye, Plus } from 'lucide-react'

// Mock user stories data
const userStories = [
  {
    id: 1,
    title: "The Last Sunset",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
    genre: "Fiction",
    likes: 234,
    comments: 12,
    views: 1520,
    status: "published"
  },
  {
    id: 2,
    title: "Digital Dreams",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop",
    genre: "Sci-Fi",
    likes: 189,
    comments: 8,
    views: 892,
    status: "published"
  },
  {
    id: 3,
    title: "Ocean's Whisper",
    image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=300&h=300&fit=crop",
    genre: "Poetry",
    likes: 156,
    comments: 23,
    views: 743,
    status: "published"
  },
  {
    id: 4,
    title: "Midnight Train",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&h=300&fit=crop",
    genre: "Mystery",
    likes: 298,
    comments: 15,
    views: 1834,
    status: "published"
  },
  {
    id: 5,
    title: "The Unfinished Symphony",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    genre: "Drama",
    likes: 0,
    comments: 0,
    views: 0,
    status: "draft"
  },
  {
    id: 6,
    title: "City Lights",
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=300&h=300&fit=crop",
    genre: "Romance",
    likes: 0,
    comments: 0,
    views: 0,
    status: "review"
  }
]

export default function StoriesGrid() {
  const publishedStories = userStories.filter(story => story.status === 'published')
  const draftStories = userStories.filter(story => story.status === 'draft')
  const reviewStories = userStories.filter(story => story.status === 'review')

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
              <Link key={story.id} href={`/story/${story.id}`} className="group">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Overlay with stats */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center space-x-4 text-white">
                      <div className="flex items-center space-x-1">
                        <Heart size={16} />
                        <span className="text-sm font-medium">{story.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle size={16} />
                        <span className="text-sm font-medium">{story.comments}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye size={16} />
                        <span className="text-sm font-medium">{story.views}</span>
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
                    <span>{story.likes} likes</span>
                    <span>{story.views} views</span>
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
              <div key={story.id} className="group">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    className="object-cover opacity-75"
                  />
                  
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
                  <h4 className="font-medium text-gray-900 line-clamp-1">
                    {story.title}
                  </h4>
                  <p className="text-sm text-yellow-600 mt-1">Waiting for approval</p>
                </div>
              </div>
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
              <Link key={story.id} href={`/create?draft=${story.id}`} className="group">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    className="object-cover opacity-50 group-hover:opacity-75 transition-opacity"
                  />
                  
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
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {publishedStories.length === 0 && draftStories.length === 0 && reviewStories.length === 0 && (
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
