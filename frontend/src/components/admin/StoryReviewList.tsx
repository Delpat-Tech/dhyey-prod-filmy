'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Search, 
  Filter, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Calendar,
  User,
  FileText,
  MoreHorizontal
} from 'lucide-react'
import { adminAPI } from '@/lib/api'
import { showNotification } from '@/lib/errorHandler'
import { getImageUrl, getAvatarUrl } from '@/lib/imageUtils'

// Mock data for stories pending review
const mockStories = [
  {
    id: 1,
    title: "The Last Digital Frontier",
    author: {
      name: "Alex Thompson",
      username: "alexthompson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    },
    excerpt: "In a world where technology has consumed every aspect of human life, one programmer discovers the last untouched digital realm...",
    genre: "Sci-Fi",
    wordCount: 3420,
    submittedAt: "2024-01-15T10:30:00Z",
    status: "pending",
    priority: "high",
    featuredImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop",
    hashtags: ["#scifi", "#technology", "#future"],
    reportCount: 0
  },
  {
    id: 2,
    title: "Midnight Coffee Chronicles",
    author: {
      name: "Sarah Chen",
      username: "sarahchen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
    },
    excerpt: "A collection of late-night conversations between strangers in a 24-hour coffee shop that never closes...",
    genre: "Drama",
    wordCount: 2890,
    submittedAt: "2024-01-15T08:15:00Z",
    status: "pending",
    priority: "medium",
    featuredImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop",
    hashtags: ["#drama", "#coffee", "#conversations"],
    reportCount: 1
  },
  {
    id: 3,
    title: "Ocean's Memory",
    author: {
      name: "Marcus Rivera",
      username: "marcusrivera",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
    },
    excerpt: "When marine biologist Dr. Elena discovers that whales can store human memories in their songs...",
    genre: "Fantasy",
    wordCount: 4150,
    submittedAt: "2024-01-14T16:45:00Z",
    status: "pending",
    priority: "low",
    featuredImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop",
    hashtags: ["#fantasy", "#ocean", "#memory"],
    reportCount: 0
  },
  {
    id: 4,
    title: "The Quantum Cookbook",
    author: {
      name: "Emma Wilson",
      username: "emmawilson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
    },
    excerpt: "A chef discovers that her grandmother's recipes can alter reality when cooked with quantum ingredients...",
    genre: "Sci-Fi",
    wordCount: 2750,
    submittedAt: "2024-01-14T14:20:00Z",
    status: "pending",
    priority: "high",
    featuredImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop",
    hashtags: ["#scifi", "#cooking", "#quantum"],
    reportCount: 0
  }
]

const statusColors: { [key: string]: string } = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
}

const priorityColors: { [key: string]: string } = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800'
}

export default function StoryReviewList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterGenre, setFilterGenre] = useState('all')
  const [selectedStories, setSelectedStories] = useState<string[]>([])
  const [stories, setStories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [wasFocused, setWasFocused] = useState(false)

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Restore focus after re-render
  useEffect(() => {
    if (wasFocused && searchInputRef.current && !isLoading) {
      searchInputRef.current.focus()
      setWasFocused(false)
    }
  }, [stories, wasFocused, isLoading])

  // Load stories from backend
  useEffect(() => {
    const loadStories = async () => {
      try {
        setIsLoading(true)
        const params = new URLSearchParams()
        params.append('status', filterStatus)
        if (filterGenre !== 'all') params.append('genre', filterGenre)
        
        const response = await adminAPI.getAllStories(params)
        setStories(response.data.stories || mockStories)
      } catch (error: any) {
        console.error('Failed to load stories:', error)
        
        // Check if it's a permission error
        if (error.message.includes('permission') || error.message.includes('403')) {
          showNotification({
            type: 'error',
            title: 'Access Denied',
            message: 'You need admin privileges to access this page. Please contact an administrator.'
          })
          // Redirect to home page after 3 seconds
          setTimeout(() => {
            window.location.href = '/'
          }, 3000)
        } else {
          // Fallback to mock data for other errors
          setStories(mockStories)
          showNotification({
            type: 'error',
            title: 'Failed to load stories',
            message: 'Using demo data. Please check your connection.'
          })
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadStories()
  }, [filterStatus, filterGenre])

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.author?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || story.status === filterStatus
    const matchesGenre = filterGenre === 'all' || story.genre === filterGenre
    return matchesSearch && matchesStatus && matchesGenre
  })

  const handleSelectStory = (storyId: string) => {
    setSelectedStories(prev => 
      prev.includes(storyId) 
        ? prev.filter(id => id !== storyId)
        : [...prev, storyId]
    )
  }

  const handleSelectAll = () => {
    setSelectedStories(
      selectedStories.length === filteredStories.length 
        ? [] 
        : filteredStories.map(story => story.id.toString())
    )
  }

  const handleBulkAction = async (action: 'approve' | 'reject') => {
    if (selectedStories.length === 0) return
    
    setIsProcessing(true)
    try {
      if (action === 'approve') {
        await adminAPI.bulkApproveStories(selectedStories)
        showNotification({
          type: 'success',
          title: 'Stories Approved',
          message: `${selectedStories.length} stories have been approved and published. Authors will be notified.`
        })
      } else {
        const reason = 'Stories do not meet community guidelines'
        await adminAPI.bulkRejectStories(selectedStories, reason)
        showNotification({
          type: 'success',
          title: 'Stories Rejected',
          message: `${selectedStories.length} stories have been rejected. Authors will be notified with the reason.`
        })
      }
      
      // Reload stories
      const params = new URLSearchParams()
      params.append('status', filterStatus)
      if (filterGenre !== 'all') params.append('genre', filterGenre)
      if (debouncedSearchTerm) params.append('search', debouncedSearchTerm)
      
      const response = await adminAPI.getAllStories(params)
      setStories(response.data.stories || [])
      setSelectedStories([])
      
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Action Failed',
        message: `Failed to ${action} stories. Please try again.`
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSingleAction = async (storyId: string, action: 'approve' | 'reject') => {
    setIsProcessing(true)
    try {
      if (action === 'approve') {
        await adminAPI.approveStory(storyId)
        showNotification({
          type: 'success',
          title: 'Story Approved',
          message: 'The story has been approved and published. The author will be notified.'
        })
      } else {
        // For rejection, we could add a reason input modal in the future
        const reason = 'Story does not meet community guidelines'
        await adminAPI.rejectStory(storyId, reason)
        showNotification({
          type: 'success',
          title: 'Story Rejected',
          message: 'The story has been rejected. The author will be notified with the reason.'
        })
      }
      
      // Reload stories
      const params = new URLSearchParams()
      params.append('status', filterStatus)
      if (filterGenre !== 'all') params.append('genre', filterGenre)
      if (debouncedSearchTerm) params.append('search', debouncedSearchTerm)
      
      const response = await adminAPI.getAllStories(params)
      setStories(response.data.stories || [])
      
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Action Failed',
        message: `Failed to ${action} story. Please try again.`
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date'
    
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return 'Invalid date'
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Story Reviews</h1>
            <p className="text-gray-600">Loading stories...</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex space-x-4">
                <div className="w-20 h-16 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Story Reviews</h1>
          <p className="text-gray-600">Review and manage submitted stories ({stories.length} total)</p>
        </div>

      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search stories or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setWasFocused(true)}
              onBlur={() => setWasFocused(false)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Genre Filter */}
          <select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
          >
            <option value="all">All Genres</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Drama">Drama</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Romance">Romance</option>
            <option value="Mystery">Mystery</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions - Commented out */}
      {/*
      {selectedStories.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedStories.length} story(ies) selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('approve')}
                disabled={isProcessing}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Bulk Approve'}
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                disabled={isProcessing}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Bulk Reject'}
              </button>
              <button
                onClick={() => setSelectedStories([])}
                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
      */}

      {/* Stories List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="flex items-center">
            {/* Checkbox commented out */}
            {/*
            <input
              type="checkbox"
              checked={selectedStories.length === filteredStories.length && filteredStories.length > 0}
              onChange={handleSelectAll}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            */}
            <span className="ml-3 text-sm font-medium text-gray-900">
              Story ({filteredStories.length})
            </span>
          </div>
        </div>

        {/* Stories */}
        <div className="divide-y divide-gray-200">
          {filteredStories.map((story) => (
            <div key={story.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start space-x-4">
                {/* Checkbox commented out */}
                {/*
                <input
                  type="checkbox"
                  checked={selectedStories.includes(story.id)}
                  onChange={() => handleSelectStory(story.id)}
                  className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                */}

                {/* Featured Image */}
                <div className="flex-shrink-0 w-20 h-16">
                  {(story.featuredImage || story.image) ? (
                    <>
                      <img
                        src={getImageUrl(story.featuredImage || story.image)}
                        alt={story.title}
                        className="rounded-lg object-cover w-full h-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.parentElement?.querySelector('.fallback-image') as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="fallback-image w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg items-center justify-center hidden">
                        <span className="text-purple-500 text-2xl">📖</span>
                      </div>
                    </>
                  ) : (
                    <div className="fallback-image w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-500 text-2xl">📖</span>
                    </div>
                  )}
                </div>

                {/* Story Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-4">
                      <Link 
                        href={`/admin/stories/${story._id || story.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-purple-600 block"
                      >
                        {story.title}
                      </Link>
                      
                      {/* Author Info */}
                      <div className="flex items-center mt-1 space-x-2">
                        {story.author?.avatar ? (
                          <img
                            src={getAvatarUrl(story.author.avatar)}
                            alt={story.author?.name || 'Author'}
                            className="rounded-full w-5 h-5 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={`w-5 h-5 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold ${story.author?.avatar ? 'hidden' : ''}`}>
                          {story.author?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <span className="text-sm text-gray-600">by {story.author.name}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-500">{story.genre}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-500">{story.wordCount} words</span>
                      </div>

                      {/* Excerpt */}
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {story.excerpt}
                      </p>

                      {/* Hashtags */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {story.hashtags?.map((tag: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex flex-col items-end space-y-2 ml-4 flex-shrink-0">
                      {/* Status Badge */}
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[story.status]}`}>
                          {story.status.charAt(0).toUpperCase() + story.status.slice(1)}
                        </span>
                      </div>

                      {/* Report Count */}
                      {story.reportCount > 0 && (
                        <div className="flex items-center text-red-600">
                          <AlertTriangle size={14} className="mr-1" />
                          <span className="text-xs">{story.reportCount} report(s)</span>
                        </div>
                      )}

                      {/* Submission Date */}
                      <div className="flex items-center text-gray-500">
                        <Calendar size={14} className="mr-1" />
                        <span className="text-xs">{formatDate(story.submittedAt || story.createdAt || story.publishedAt)}</span>
                      </div>


                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredStories.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No stories found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredStories.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredStories.length}</span> of{' '}
            <span className="font-medium">{filteredStories.length}</span> results
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
