'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter, X } from 'lucide-react'
import SearchResults from './SearchResults'
import { searchAPI } from '@/lib/api'

const genres = ['All', 'Fiction', 'Poetry', 'Romance', 'Mystery', 'Sci-Fi', 'Fantasy', 'Drama']
const sortOptions = ['Latest', 'Most Liked', 'Most Saved', 'Trending']

export default function SearchInterface() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || 'All')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'Latest')
  const [showFilters, setShowFilters] = useState(false)
  const [searchType, setSearchType] = useState<'all' | 'title' | 'author' | 'hashtag'>((searchParams.get('type') as any) || 'all')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  const updateURL = (query: string, type: string, genre: string, sort: string) => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (type !== 'all') params.set('type', type)
    if (genre !== 'All') params.set('genre', genre)
    if (sort !== 'Latest') params.set('sort', sort)
    
    const newURL = `/search${params.toString() ? '?' + params.toString() : ''}`
    router.replace(newURL, { scroll: false })
  }

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setHasSearched(false)
      updateURL('', searchType, selectedGenre, sortBy)
      return
    }
    
    updateURL(query, searchType, selectedGenre, sortBy)

    setIsSearching(true)
    setHasSearched(true)
    setSearchError(null)

    try {
      let results = []
      
      // Build filters for the API
      const filters: any = {
        genre: selectedGenre !== 'All' ? selectedGenre : undefined,
        sortBy: sortBy.toLowerCase().replace(' ', '_').replace('most_liked', 'popular').replace('most_saved', 'popular').replace('latest', 'newest')
      }

      if (searchType === 'all') {
        // For 'all' search, try multiple search types and combine results
        const searchPromises = [
          searchAPI.searchStories(query, filters), // General search
          searchAPI.searchStories(`title:${query}`, filters), // Title search
          searchAPI.searchStories(`author:${query}`, filters), // Author search
          searchAPI.searchStories(query.startsWith('#') ? query : `#${query}`, filters) // Hashtag search
        ]
        
        const responses = await Promise.allSettled(searchPromises)
        const allResults = new Map() // Use Map to avoid duplicates
        
        responses.forEach(response => {
          if (response.status === 'fulfilled' && response.value?.status === 'success') {
            const stories = response.value.stories || []
            stories.forEach(story => {
              const key = story._id || story.id
              if (key && !allResults.has(key)) {
                allResults.set(key, story)
              }
            })
          }
        })
        
        results = Array.from(allResults.values())
      } else {
        // Build search query based on search type
        let searchQuery = query
        
        if (searchType === 'author') {
          searchQuery = `author:${query}`
        } else if (searchType === 'title') {
          searchQuery = `title:${query}`
        } else if (searchType === 'hashtag') {
          searchQuery = query.startsWith('#') ? query : `#${query}`
        }
        
        console.log('Searching with query:', searchQuery, 'type:', searchType, 'filters:', filters)
        const response = await searchAPI.searchStories(searchQuery, filters)
        
        // Handle the response format from the backend
        if (response && response.status === 'success') {
          results = response.stories || []
        } else if (response && response.data && Array.isArray(response.data)) {
          results = response.data
        } else if (Array.isArray(response)) {
          results = response
        } else {
          results = []
        }
      }
      
      console.log('Found', results.length, 'stories:', results)

      setSearchResults(results)
    } catch (error) {
      console.error('Search failed:', error)
      // Show more detailed error information
      if (error instanceof Error) {
        console.error('Error message:', error.message)
        if (error.message.includes('fetch')) {
          setSearchError('Unable to connect to search service. Please check your internet connection.')
        } else if (error.message.includes('Session expired')) {
          setSearchError('Your session has expired. Please refresh the page and try again.')
        } else {
          setSearchError(`Search failed: ${error.message}`)
        }
      } else {
        setSearchError('Search failed: Unknown error')
      }
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(searchQuery)
  }

  // Auto-search when query changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        console.log('Auto-searching for:', searchQuery)
        performSearch(searchQuery)
      } else if (searchQuery.length === 0) {
        setSearchResults([])
        setHasSearched(false)
        setSearchError(null)
        updateURL('', searchType, selectedGenre, sortBy)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, searchType, selectedGenre, sortBy])

  // Load search results on component mount if URL has search params
  useEffect(() => {
    const query = searchParams.get('q')
    if (query && query.length >= 2 && searchResults.length === 0 && !hasSearched) {
      performSearch(query)
    }
  }, [])

  const clearSearch = () => {
    setSearchQuery('')
    setSearchError(null)
    setSearchResults([])
    setHasSearched(false)
    updateURL('', searchType, selectedGenre, sortBy)
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search stories, authors, or hashtags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg text-gray-900"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
            <button
              type="submit"
              className="bg-purple-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-600 transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {/* Search Type Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'All' },
          { key: 'title', label: 'Title' },
          { key: 'author', label: 'Author' },
          { key: 'hashtag', label: 'Hashtag' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSearchType(key as typeof searchType)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              searchType === key
                ? 'bg-purple-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter size={16} />
            <span className="text-sm font-medium">Filters</span>
          </button>
          
          {selectedGenre !== 'All' && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              <span>{selectedGenre}</span>
              <button onClick={() => setSelectedGenre('All')}>
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-gray-900"
        >
          {sortOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Filter by Genre</h3>
          <div className="flex flex-wrap gap-2">
            {genres.map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedGenre === genre
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {searchError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">!</span>
            </div>
            <p className="text-red-700 text-sm">{searchError}</p>
          </div>
          <p className="text-red-600 text-xs mt-2">
            The search service may be temporarily unavailable. Please try again later.
          </p>
        </div>
      )}

      {/* Search Results */}
      <SearchResults 
        query={searchQuery}
        searchType={searchType}
        genre={selectedGenre}
        sortBy={sortBy}
        results={searchResults}
        isLoading={isSearching}
        hasSearched={hasSearched}
      />
    </div>
  )
}
