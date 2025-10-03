'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, Bookmark, MessageCircle, Clock, Search } from 'lucide-react'

interface SearchResultsProps {
  query: string
  searchType: 'all' | 'title' | 'author' | 'hashtag'
  genre: string
  sortBy: string
  results?: any[]
  isLoading?: boolean
  hasSearched?: boolean
}

// Mock search results - replace with API calls later
const mockResults = [
  {
    id: 1,
    title: "The Digital Nomad's Journey",
    author: {
      name: "Alex Thompson",
      username: "alexwrites",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    },
    excerpt: "Working from coffee shops around the world taught me more than any office ever could...",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300&h=200&fit=crop",
    genre: "Non-Fiction",
    likes: 342,
    comments: 28,
    saves: 89,
    timeAgo: "3h",
    hashtags: ["#travel", "#work", "#lifestyle"]
  },
  {
    id: 2,
    title: "Midnight in Tokyo",
    author: {
      name: "Yuki Tanaka",
      username: "yukistories",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face"
    },
    excerpt: "The neon lights reflected off the wet streets as I walked through Shibuya, each step taking me further from my past...",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&h=200&fit=crop",
    genre: "Fiction",
    likes: 567,
    comments: 45,
    saves: 123,
    timeAgo: "5h",
    hashtags: ["#tokyo", "#fiction", "#urban"]
  },
  {
    id: 3,
    title: "The Art of Letting Go",
    author: {
      name: "Maya Patel",
      username: "mayapoetry",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
    },
    excerpt: "Like autumn leaves that dance on wind, our memories float away, leaving space for new growth...",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
    genre: "Poetry",
    likes: 234,
    comments: 19,
    saves: 67,
    timeAgo: "1d",
    hashtags: ["#poetry", "#healing", "#growth"]
  }
]

export default function SearchResults({ query, searchType, genre, sortBy }: SearchResultsProps) {
  // Filter results based on search criteria
  const filteredResults = mockResults.filter(story => {
    if (genre !== 'All' && story.genre !== genre) return false
    
    if (!query) return true
    
    const searchLower = query.toLowerCase()
    
    switch (searchType) {
      case 'title':
        return story.title.toLowerCase().includes(searchLower)
      case 'author':
        return story.author.name.toLowerCase().includes(searchLower) || 
               story.author.username.toLowerCase().includes(searchLower)
      case 'hashtag':
        return story.hashtags.some(tag => tag.toLowerCase().includes(searchLower))
      default:
        return story.title.toLowerCase().includes(searchLower) ||
               story.author.name.toLowerCase().includes(searchLower) ||
               story.hashtags.some(tag => tag.toLowerCase().includes(searchLower)) ||
               story.excerpt.toLowerCase().includes(searchLower)
    }
  })

  if (!query && genre === 'All') {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Search size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Your Discovery</h3>
        <p className="text-gray-600">Search for stories, authors, or hashtags to find amazing content</p>
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
          {query && ` for "${query}"`}
        </p>
      </div>

      <div className="grid gap-4 md:gap-6">
        {filteredResults.map((story) => (
          <div key={story.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="md:flex">
              {/* Story Image */}
              <div className="md:w-48 h-48 md:h-auto relative flex-shrink-0">
                <Link href={`/story/${story.id}`}>
                  <Image
                    src={story.image}
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
                        src={story.author.avatar}
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
                          <span>{story.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    {story.genre}
                  </span>
                </div>

                <Link href={`/story/${story.id}`}>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 hover:text-purple-600 transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-gray-700 mb-3 line-clamp-2">
                    {story.excerpt}
                  </p>
                </Link>

                <div className="flex items-center space-x-1 mb-4">
                  {story.hashtags.map((tag, index) => (
                    <span key={index} className="text-purple-600 text-sm hover:underline cursor-pointer">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Heart size={16} />
                      <span>{story.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle size={16} />
                      <span>{story.comments}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Bookmark size={16} />
                      <span>{story.saves}</span>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/story/${story.id}`}
                    className="text-purple-600 hover:text-purple-700 font-medium text-sm"
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
        <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
          Load More Results
        </button>
      </div>
    </div>
  )
}
