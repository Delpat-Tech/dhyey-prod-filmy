'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, Bookmark, MessageCircle, Clock, Search } from 'lucide-react'
import { getImageUrl, getAvatarUrl } from '@/lib/imageUtils'

// Helper function to format time ago
function formatTimeAgo(dateString: string | Date): string {
  if (!dateString) return 'Unknown'
  
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo`
  return `${Math.floor(diffInSeconds / 31536000)}y`
}

interface SearchResultsProps {
  query: string
  searchType: 'all' | 'title' | 'author' | 'hashtag'
  genre: string
  sortBy?: string
  results?: any[]
  isLoading?: boolean
  hasSearched?: boolean
}

// Helper function to get display query
function getDisplayQuery(query: string, searchType: string): string {
  // The query passed here is the original user input, not the formatted query
  return query
}



export default function SearchResults({ query, searchType, genre, sortBy, results, isLoading, hasSearched }: SearchResultsProps) {
  // Use only real API results
  const displayResults = results || []
  const filteredResults = displayResults

  // Show loading state
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Searching...</p>
      </div>
    )
  }

  if (!query && genre === 'All' && !hasSearched) {
    return (
      <div className="text-center py-12">
        <div className="relative mx-auto mb-4 w-24 h-24">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full blur-sm opacity-30 animate-pulse"></div>
          <div className="relative w-24 h-24 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center shadow-lg">
            <Search size={32} className="text-purple-600" />
          </div>
        </div>
        <div className="relative">
          <h3 className="text-xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Start Your Discovery
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Search for stories, authors, or hashtags to find amazing content
          </p>
        </div>
      </div>
    )
  }

  if (filteredResults.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Search size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
        <p className="text-gray-600">
          Try adjusting your search terms or filters to find what you're looking for
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} found
          {query && ` for "${getDisplayQuery(query, searchType)}"`}
        </p>
      </div>

      <div className="grid gap-4 md:gap-6">
        {filteredResults.map((story) => (
          <div key={story._id || story.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="md:flex">
              {/* Story Image */}
              <div className="md:w-48 h-48 md:h-auto relative flex-shrink-0">
                <Link href={`/story/${story.slug || story._id || story.id}`}>
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
                    <Link href={`/profile/${story.author.username}`}>
                      <Image
                        src={getAvatarUrl(story.author.avatar)}
                        alt={story.author.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    </Link>
                    <div>
                      <Link 
                        href={`/profile/${story.author.username}`}
                        className="font-medium text-gray-900 hover:text-purple-600"
                      >
                        {story.author.name}
                      </Link>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>@{story.author.username}</span>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <Clock size={12} />
                          <span>{story.timeAgo || formatTimeAgo(story.publishedAt || story.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    {story.genre}
                  </span>
                </div>

                <Link href={`/story/${story.slug || story._id || story.id}`}>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 hover:text-purple-600 transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-gray-700 mb-3 line-clamp-2">
                    {story.excerpt}
                  </p>
                </Link>

                {story.hashtags && story.hashtags.length > 0 && (
                  <div className="flex items-center space-x-1 mb-4">
                    {story.hashtags.map((tag: string, index: number) => (
                      <span key={index} className="text-purple-600 text-sm hover:underline cursor-pointer">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Heart size={16} />
                      <span>{story.likes || story.stats?.likes || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle size={16} />
                      <span>{story.comments || story.stats?.comments || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Bookmark size={16} />
                      <span>{story.saves || story.stats?.saves || 0}</span>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/story/${story.slug || story._id || story.id}`}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 hover:scale-105 hover:shadow-md text-sm inline-block"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center py-8">
        <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-10 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 transform disabled:opacity-50 disabled:cursor-not-allowed">
          Load More Results
        </button>
      </div>
    </div>
  )
}
