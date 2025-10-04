'use client'

import { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Flag,
  MoreHorizontal,
  Calendar,
  User,
  FileText,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// Types
type ReportStatus = 'pending' | 'investigating' | 'resolved' | 'rejected'
type ReportCategory = 'harassment' | 'spam' | 'inappropriate' | 'copyright' | 'misinformation' | 'other'

type Report = {
  id: number
  reporterId?: number
  reporterName?: string
  reporterAvatar?: string
  reportedContentId: number
  reportedContentType: 'story' | 'comment' | 'user'
  reportedContentTitle: string
  reportedContentAuthor: string
  category: ReportCategory
  reason: string
  description: string
  status: ReportStatus
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
  assignedTo?: string
  evidence?: string[]
}

const categoryLabels = {
  harassment: 'Harassment',
  spam: 'Spam',
  inappropriate: 'Inappropriate Content',
  copyright: 'Copyright Violation',
  misinformation: 'Misinformation',
  other: 'Other'
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  investigating: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-orange-100 text-orange-800',
  high: 'bg-red-100 text-red-800'
}

export default function ReportsManager() {
  const [reports, setReports] = useState<Report[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<ReportCategory | 'all'>('all')
  const [selectedReports, setSelectedReports] = useState<number[]>([])
  const [showReportModal, setShowReportModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const mockReports: Report[] = [
      {
        id: 1,
        reporterName: 'Anonymous',
        reportedContentId: 123,
        reportedContentType: 'story',
        reportedContentTitle: 'The Dark Forest',
        reportedContentAuthor: 'john_doe',
        category: 'harassment',
        reason: 'Harassing content towards minorities',
        description: 'This story contains discriminatory language and promotes hate speech.',
        status: 'pending',
        priority: 'high',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        evidence: ['screenshot1.jpg', 'screenshot2.jpg']
      },
      {
        id: 2,
        reporterId: 456,
        reporterName: 'Sarah Wilson',
        reporterAvatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        reportedContentId: 124,
        reportedContentType: 'comment',
        reportedContentTitle: 'Comment on "Lost in Time"',
        reportedContentAuthor: 'mike_chen',
        category: 'spam',
        reason: 'Spam and promotional content',
        description: 'Multiple identical comments promoting external websites.',
        status: 'investigating',
        priority: 'medium',
        createdAt: '2024-01-14T14:20:00Z',
        updatedAt: '2024-01-14T16:45:00Z',
        assignedTo: 'admin@dheyproduction.com'
      },
      {
        id: 3,
        reportedContentId: 125,
        reportedContentType: 'user',
        reportedContentTitle: 'User Profile: spam_account_123',
        reportedContentAuthor: 'spam_account_123',
        category: 'spam',
        reason: 'Fake account promoting scams',
        description: 'Account created solely for spam and fraudulent activities.',
        status: 'resolved',
        priority: 'high',
        createdAt: '2024-01-13T09:15:00Z',
        updatedAt: '2024-01-13T11:30:00Z',
        assignedTo: 'moderator@dheyproduction.com'
      }
    ]
    setReports(mockReports)
  }, [])

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.reportedContentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reportedContentAuthor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (report.reporterName && report.reporterName.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentReports = filteredReports.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage)

  const handleSelectReport = (reportId: number) => {
    setSelectedReports(prev =>
      prev.includes(reportId)
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    )
  }

  const handleSelectAll = () => {
    setSelectedReports(
      selectedReports.length === currentReports.length
        ? []
        : currentReports.map(report => report.id)
    )
  }

  const handleViewReport = (report: Report) => {
    setSelectedReport(report)
    setShowReportModal(true)
  }

  const handleStatusChange = (reportId: number, newStatus: ReportStatus) => {
    setReports(reports.map(report =>
      report.id === reportId
        ? { ...report, status: newStatus, updatedAt: new Date().toISOString() }
        : report
    ))
  }

  const handleBulkStatusChange = (newStatus: ReportStatus) => {
    setReports(reports.map(report =>
      selectedReports.includes(report.id)
        ? { ...report, status: newStatus, updatedAt: new Date().toISOString() }
        : report
    ))
    setSelectedReports([])
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

  const getStatusIcon = (status: ReportStatus) => {
    switch (status) {
      case 'pending': return <Clock size={16} />
      case 'investigating': return <Eye size={16} />
      case 'resolved': return <CheckCircle size={16} />
      case 'rejected': return <XCircle size={16} />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports Management</h1>
          <p className="text-gray-600">Review and manage user reports on content</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-3xl font-bold text-gray-900">{reports.length}</p>
            </div>
            <Flag className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-3xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Under Investigation</p>
              <p className="text-3xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'investigating').length}
              </p>
            </div>
            <Eye className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-3xl font-bold text-gray-900">
                {reports.filter(r => r.priority === 'high').length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
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
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 hover:shadow-md focus:shadow-lg"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ReportStatus | 'all')}
            className="px-4 py-3 border border-gray-200 rounded-xl bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white text-gray-900 shadow-sm transition-all duration-200 hover:shadow-md focus:shadow-lg appearance-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as ReportCategory | 'all')}
            className="px-4 py-3 border border-gray-200 rounded-xl bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white text-gray-900 shadow-sm transition-all duration-200 hover:shadow-md focus:shadow-lg appearance-none"
          >
            <option value="all">All Categories</option>
            <option value="harassment">Harassment</option>
            <option value="spam">Spam</option>
            <option value="inappropriate">Inappropriate</option>
            <option value="copyright">Copyright</option>
            <option value="misinformation">Misinformation</option>
            <option value="other">Other</option>
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm('')
              setStatusFilter('all')
              setCategoryFilter('all')
            }}
            className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-white text-gray-700 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300"
          >
            <Filter size={16} className="mr-2" />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedReports.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedReports.length} report(s) selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkStatusChange('investigating')}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Start Investigation
              </button>
              <button
                onClick={() => handleBulkStatusChange('resolved')}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Mark Resolved
              </button>
              <button
                onClick={() => handleBulkStatusChange('rejected')}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Reject Reports
              </button>
              <button
                onClick={() => setSelectedReports([])}
                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reports Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedReports.length > 0 && selectedReports.length === currentReports.length}
              onChange={handleSelectAll}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <span className="ml-3 text-sm font-medium text-gray-900">
              Reports ({filteredReports.length})
            </span>
          </div>
        </div>

        {currentReports.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {currentReports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedReports.includes(report.id)}
                    onChange={() => handleSelectReport(report.id)}
                    className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-gray-900">
                            {report.reportedContentType === 'story' && '📖 '}
                            {report.reportedContentType === 'comment' && '💬 '}
                            {report.reportedContentType === 'user' && '👤 '}
                            {report.reportedContentTitle}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[report.priority]}`}>
                            {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)}
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <span>By: {report.reportedContentAuthor}</span>
                          <span>•</span>
                          <span>Reported by: {report.reporterName || 'Anonymous'}</span>
                          <span>•</span>
                          <span>{categoryLabels[report.category]}</span>
                        </div>

                        <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                          {report.description}
                        </p>

                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Calendar size={12} className="mr-1" />
                            {formatDate(report.createdAt)}
                          </span>
                          {report.assignedTo && (
                            <>
                              <span>•</span>
                              <span className="flex items-center">
                                <User size={12} className="mr-1" />
                                Assigned to admin
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2 ml-4">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${statusColors[report.status]}`}>
                            {getStatusIcon(report.status)}
                            <span className="ml-1">{report.status.charAt(0).toUpperCase() + report.status.slice(1)}</span>
                          </span>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewReport(report)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>

                          <select
                            value={report.status}
                            onChange={(e) => handleStatusChange(report.id, e.target.value as ReportStatus)}
                            className="text-xs border border-gray-200 rounded px-2 py-1 bg-white"
                          >
                            <option value="pending">Pending</option>
                            <option value="investigating">Investigating</option>
                            <option value="resolved">Resolved</option>
                            <option value="rejected">Rejected</option>
                          </select>

                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Flag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
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
              {Math.min(indexOfLastItem, filteredReports.length)}
            </span>{' '}
            of <span className="font-medium">{filteredReports.length}</span> results
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

      {/* Report Detail Modal */}
      {showReportModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Report Details</h3>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Reported Content</h4>
                  <p className="text-sm text-gray-600">{selectedReport.reportedContentTitle}</p>
                  <p className="text-xs text-gray-500">Type: {selectedReport.reportedContentType} • Author: {selectedReport.reportedContentAuthor}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Report Category</h4>
                  <p className="text-sm text-gray-600">{categoryLabels[selectedReport.category]}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Reason</h4>
                  <p className="text-sm text-gray-600">{selectedReport.reason}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Description</h4>
                  <p className="text-sm text-gray-600">{selectedReport.description}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Reporter</h4>
                  <p className="text-sm text-gray-600">{selectedReport.reporterName || 'Anonymous'}</p>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Created: {formatDate(selectedReport.createdAt)}</span>
                  <span>Updated: {formatDate(selectedReport.updatedAt)}</span>
                  {selectedReport.assignedTo && (
                    <span>Assigned to: Admin</span>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowReportModal(false)}
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
