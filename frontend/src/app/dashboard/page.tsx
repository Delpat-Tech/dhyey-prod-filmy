

'use client'

import { useState } from 'react'
import StoryFeed from '@/components/home/StoryFeed'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
// import FeaturedStories from '@/components/home/FeaturedStories'

export default function DashboardPage() {
  const { isAuthenticated } = useAuth()
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)

  const handleGenreFilter = (genre: string | null) => {
    setSelectedGenre(genre)
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Hero Section - Mobile optimized */}
      <div className="w-full bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-900 text-white py-6 md:py-12 relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative w-full max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-xl md:text-4xl font-bold mb-2 text-white">
            {isAuthenticated ? 'Share Your Stories' : 'Discover Amazing Stories'}
          </h1>
          <p className="text-white text-sm md:text-lg mb-4">
            {isAuthenticated 
              ? 'Discover amazing stories from creative writers around the world'
              : 'Explore creative stories from talented writers worldwide'
            }
          </p>
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/auth/login"
                className="bg-white text-purple-700 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="border-2 border-white text-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-purple-700 transition-colors"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto px-4 py-4">                        {/* change this line to increase/decrease the width of the cards */}
        {/* Featured Stories Section - Coming Soon */}
        {/* <FeaturedStories /> */}

        {/* Coming Soon Section - Only for authenticated users */}
        {isAuthenticated && (
          <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-lg">🚀</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Featured Stories</h2>
            <p className="text-gray-600 mb-2">Coming Soon</p>
            <p className="text-sm text-gray-500">
              We&apos;re working on bringing you curated featured stories from our top authors. Stay tuned!
            </p>
          </div>
        )}
        
        {/* Main Feed */}
        <div className="w-full">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              {isAuthenticated ? 'Latest Stories' : 'Explore Stories'}
            </h2>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => handleGenreFilter(null)}
                className={`px-3 py-2 text-sm rounded-full font-medium ${
                  selectedGenre === null 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => handleGenreFilter('Fiction')}
                className={`px-3 py-2 text-sm rounded-full font-medium ${
                  selectedGenre === 'Fiction' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Fiction
              </button>
              <button 
                onClick={() => handleGenreFilter('Poetry')}
                className={`px-3 py-2 text-sm rounded-full font-medium ${
                  selectedGenre === 'Poetry' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Poetry
              </button>
            </div>
          </div>
          
          <StoryFeed genreFilter={selectedGenre} />
        </div>
      </div>
    </div>
  )
}
