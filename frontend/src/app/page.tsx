'use client'

import { useState } from 'react'
import StoryFeed from '@/components/home/StoryFeed'
import Link from 'next/link'

export default function HomePage() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)

  const handleGenreFilter = (genre: string | null) => {
    setSelectedGenre(genre)
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-900 text-white py-6 md:py-12 relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative w-full max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-xl md:text-4xl font-bold mb-2 text-white">
            Discover Amazing Stories
          </h1>
          <p className="text-white text-sm md:text-lg mb-4">
            Explore creative stories from talented writers worldwide
          </p>
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
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto px-4 py-4">
        {/* Main Feed */}
        <div className="w-full">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              Explore Stories
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