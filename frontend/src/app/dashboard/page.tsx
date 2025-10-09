'use client'

import { useState } from 'react'
import StoryFeed from '@/components/home/StoryFeed'
// import FeaturedStories from '@/components/home/FeaturedStories'

export default function DashboardPage() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)

  const handleGenreFilter = (genre: string | null) => {
    setSelectedGenre(genre)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Mobile optimized */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-900 text-white py-8 md:py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 mix-blend-multiply"></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-3 fade-in-up text-white">
            Share Your Stories
          </h1>
          <p className="text-white text-sm md:text-lg fade-in-up tracking-wide" style={{ animationDelay: '0.2s' }}>
            Discover amazing stories from creative writers around the world
          </p>
        </div>
        {/* Floating elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-white opacity-10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Featured Stories Section - Coming Soon */}
        {/* <FeaturedStories /> */}

        {/* Coming Soon Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center mb-8">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">🚀</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured Stories</h2>
            <p className="text-gray-600 mb-4">Coming Soon</p>
            <p className="text-sm text-gray-500">
              We're working on bringing you curated featured stories from our top authors. Stay tuned!
            </p>
          </div>
        </div>
        
        {/* Main Feed */}
        <div className="mt-8">
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Latest Stories</h2>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => handleGenreFilter(null)}
                className={`px-4 py-2 text-sm rounded-full font-medium transition-all duration-300 ${
                  selectedGenre === null 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-purple-600'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => handleGenreFilter('Fiction')}
                className={`px-4 py-2 text-sm rounded-full font-medium transition-all duration-300 ${
                  selectedGenre === 'Fiction' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-purple-600'
                }`}
              >
                Fiction
              </button>
              <button 
                onClick={() => handleGenreFilter('Poetry')}
                className={`px-4 py-2 text-sm rounded-full font-medium transition-all duration-300 ${
                  selectedGenre === 'Poetry' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-purple-600'
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
