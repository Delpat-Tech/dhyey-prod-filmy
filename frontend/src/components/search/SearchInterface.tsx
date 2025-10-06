'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, X } from 'lucide-react'
import SearchResults from './SearchResults'
import { searchAPI } from '@/lib/api'

const genres = ['All', 'Fiction', 'Poetry', 'Romance', 'Mystery', 'Sci-Fi', 'Fantasy', 'Drama']
const sortOptions = ['Latest', 'Most Liked', 'Most Saved', 'Trending']

export default function SearchInterface() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [sortBy, setSortBy] = useState('Latest')
  const [showFilters, setShowFilters] = useState(false)
  const [searchType, setSearchType] = useState<'all' | 'title' | 'author' | 'hashtag'>('all')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setHasSearched(false)
      return
    }

    setIsSearching(true)
    setHasSearched(true)

    try {
      let results = []
      
      // Build search query based on search type
      let searchQuery = query
      
      // Build filters
      const filters: any = {
        genre: selectedGenre !== 'All' ? selectedGenre : undefined,
        sortBy: sortBy.toLowerCase().replace(' ', '_')
      }

      // Add specific filters based on search type
      if (searchType === 'author') {
        filters.author = query
      } else if (searchType === 'hashtag') {
        // For hashtag search, add # if not present
        searchQuery = query.startsWith('#') ? query : `#${query}`
      }
      // For 'title' and 'all', the backend will search in appropriate fields

      console.log('Searching with query:', searchQuery, 'type:', searchType, 'filters:', filters)
      const response = await searchAPI.searchStories(searchQuery, filters)
      console.log('Full search response:', response)
      
      // The backend returns { status: 'success', query, stories, pagination, filters } directly
      results = response.stories || []
      console.log('Found', results.length, 'stories:', results)

      setSearchResults(results)
    } catch (error) {
      console.error('Search failed:', error)
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
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, searchType, selectedGenre, sortBy])

  const clearSearch = () => {
    setSearchQuery('')
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
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
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
