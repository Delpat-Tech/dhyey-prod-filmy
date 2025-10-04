'use client'

import { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  MessageSquare,
  Clock,
  User,
  FileText,
  MoreHorizontal,
  Calendar,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// Types
type CommentStatus = 'pending' | 'approved' | 'rejected' | 'flagged'

type Comment = {
  id: number
  content: string
  authorId: number
  authorName: string
  authorAvatar: string
  storyId: number
  storyTitle: string
  storyAuthor: string
  status: CommentStatus
  createdAt: string
  updatedAt: string
  likes: number
  replies: number
  parentId?: number // For nested replies
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  flagged: 'bg-orange-100 text-orange-800'
}

export default function CommentsManager() {
  const [comments, setComments] = useState<Comment[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<CommentStatus | 'all'>('all')
  const [selectedComments, setSelectedComments] = useState<number[]>([])
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const mockComments: Comment[] = [
      {
        id: 1,
        content: "This is an amazing story! The plot twists kept me engaged throughout. Great work!",
        authorId: 101,
        authorName: "Sarah Johnson",
        authorAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
        storyId: 201,
        storyTitle: "The Lost Kingdom",
        storyAuthor: "john_doe",
        status: "pending",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
        likes: 12,
        replies: 3
      },
      {
        id: 2,
        content: "I found some grammatical errors in paragraph 3. Otherwise, really enjoyed it!",
        authorId: 102,
        authorName: "Mike Chen",
        authorAvatar: "https://randomuser.me/api/portraits/men/2.jpg",
        storyId: 202,
        storyTitle: "Digital Dreams",
        storyAuthor: "jane_smith",
        status: "approved",
        createdAt: "2024-01-14T14:20:00Z",
        updatedAt: "2024-01-14T15:45:00Z",
        likes: 5,
        replies: 1
      },
      {
        id: 3,
        content: "This content is inappropriate and should not be on this platform.",
        authorId: 103,
        authorName: "Anonymous User",
        authorAvatar: "",
        storyId: 203,
        storyTitle: "Dark Secrets",
        storyAuthor: "mystery_writer",
        status: "flagged",
        createdAt: "2024-01-13T09:15:00Z",
        updatedAt: "2024-01-13T11:30:00Z",
        likes: 0,
        replies: 0
      },
      {
        id: 4,
        content: "Beautiful writing! Can't wait for the next chapter.",
        authorId: 104,
        authorName: "Emma Davis",
        authorAvatar: "https://randomuser.me/api/portraits/women/3.jpg",
        storyId: 201,
        storyTitle: "The Lost Kingdom",
        storyAuthor: "john_doe",
        status: "approved",
        createdAt: "2024-01-12T16:45:00Z",
        updatedAt: "2024-01-12T16:45:00Z",
        likes: 8,
        replies: 2
      }
    ]
    setComments(mockComments)
  }, [])

  const filteredComments = comments.filter(comment => {
    const matchesSearch = comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.storyTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || comment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentComments = filteredComments.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredComments.length / itemsPerPage)

  const handleSelectComment = (commentId: number) => {
    setSelectedComments(prev =>
      prev.includes(commentId)
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    )
  }

  const handleSelectAll = () => {
    setSelectedComments(
      selectedComments.length === currentComments.length
        ? []
        : currentComments.map(comment => comment.id)
    )
  }

  const handleViewComment = (comment: Comment) => {
    setSelectedComment(comment)
    setShowCommentModal(true)
  }

  const handleStatusChange = (commentId: number, newStatus: CommentStatus) => {
    setComments(comments.map(comment =>
      comment.id === commentId
        ? { ...comment, status: newStatus, updatedAt: new Date().toISOString() }
        : comment
    ))
  }

  const handleBulkStatusChange = (newStatus: CommentStatus) => {
    setComments(comments.map(comment =>
      selectedComments.includes(comment.id)
        ? { ...comment, status: newStatus, updatedAt: new Date().toISOString() }
        : comment
    ))
    setSelectedComments([])
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = (status: CommentStatus) => {
    switch (status) {
      case 'pending': return <Clock size={16} />
      case 'approved': return <CheckCircle size={16} />
      case 'rejected': return <XCircle size={16} />
      case 'flagged': return <MessageSquare size={16} />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Comments Management</h1>
          <p className="text-gray-600">Review and moderate story comments</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Comments</p>
              <p className="text-3xl font-bold text-gray-900">{comments.length}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-3xl font-bold text-gray-900">
                {comments.filter(c => c.status === 'pending').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-gray-900">
                {comments.filter(c => c.status === 'approved').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Flagged</p>
              <p className="text-3xl font-bold text-gray-900">
                {comments.filter(c => c.status === 'flagged').length}
              </p>
            </div>
            <MessageSquare className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" />
            </div>
            <input
              type="text"
              placeholder="Search comments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 hover:shadow-md focus:shadow-lg"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as CommentStatus | 'all')}
            className="px-4 py-3 border border-gray-200 rounded-xl bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white text-gray-900 shadow-sm transition-all duration-200 hover:shadow-md focus:shadow-lg appearance-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="flagged">Flagged</option>
          </select>

          {/* Placeholder columns for consistent layout */}
          <div></div>
          <div></div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedComments.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedComments.length} comment(s) selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkStatusChange('approved')}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Approve Selected
              </button>
              <button
                onClick={() => handleBulkStatusChange('rejected')}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Reject Selected
              </button>
              <button
                onClick={() => setSelectedComments([])}
                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedComments.length > 0 && selectedComments.length === currentComments.length}
              onChange={handleSelectAll}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <span className="ml-3 text-sm font-medium text-gray-900">
              Comments ({filteredComments.length})
            </span>
          </div>
        </div>

        {currentComments.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {currentComments.map((comment) => (
              <div key={comment.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedComments.includes(comment.id)}
                    onChange={() => handleSelectComment(comment.id)}
                    className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {comment.authorAvatar ? (
                            <Image
                              src={comment.authorAvatar}
                              alt={comment.authorName}
                              width={32}
                              height={32}
                              className="rounded-full h-8 w-8"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {comment.authorName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <h3 className="font-medium text-gray-900">{comment.authorName}</h3>
                            <p className="text-sm text-gray-500">on "{comment.storyTitle}" by {comment.storyAuthor}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[comment.status]}`}>
                            {comment.status.charAt(0).toUpperCase() + comment.status.slice(1)}
                          </span>
                        </div>

                        <p className="text-gray-700 mb-3 line-clamp-3">
                          {comment.content}
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {formatDate(comment.createdAt)}
                          </span>
                          <span className="flex items-center">
                            <ThumbsUp size={14} className="mr-1" />
                            {comment.likes}
                          </span>
                          <span className="flex items-center">
                            <MessageSquare size={14} className="mr-1" />
                            {comment.replies} replies
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleViewComment(comment)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>

                        <select
                          value={comment.status}
                          onChange={(e) => handleStatusChange(comment.id, e.target.value as CommentStatus)}
                          className="text-xs border border-gray-200 rounded px-2 py-1 bg-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                          <option value="flagged">Flagged</option>
                        </select>

                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No comments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(indexOfLastItem, filteredComments.length)}
            </span>{' '}
            of <span className="font-medium">{filteredComments.length}</span> results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Comment Detail Modal */}
      {showCommentModal && selectedComment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Comment Details</h3>
                <button
                  onClick={() => setShowCommentModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  {selectedComment.authorAvatar ? (
                    <Image
                      src={selectedComment.authorAvatar}
                      alt={selectedComment.authorName}
                      width={40}
                      height={40}
                      className="rounded-full h-10 w-10"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {selectedComment.authorName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedComment.authorName}</h4>
                    <p className="text-sm text-gray-500">Comment on "{selectedComment.storyTitle}"</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Comment Content</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{selectedComment.content}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <span className="flex items-center">
                    <ThumbsUp size={14} className="mr-1" />
                    {selectedComment.likes} likes
                  </span>
                  <span className="flex items-center">
                    <MessageSquare size={14} className="mr-1" />
                    {selectedComment.replies} replies
                  </span>
                  <span>Posted: {formatDate(selectedComment.createdAt)}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[selectedComment.status]}`}>
                    {selectedComment.status.charAt(0).toUpperCase() + selectedComment.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowCommentModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
