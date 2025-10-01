'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Trophy, FileText, Calendar, Clock, Award, Eye, 
  Download, Edit, Trash2, CheckCircle, XCircle, 
  AlertCircle, TrendingUp, Filter, Search
} from 'lucide-react'

// Mock user submissions data
const mockSubmissions = [
  {
    id: 1,
    competitionId: 1,
    competitionTitle: "Short Story Challenge 2024",
    entryTitle: "The New Dawn",
    submittedDate: "2024-02-15T10:30:00",
    status: "Under Review",
    statusColor: "yellow",
    fileUrl: "/submissions/entry-1.pdf",
    description: "A story about finding hope in unexpected places during the darkest times of life.",
    wordCount: 987,
    canEdit: false,
    score: null,
    rank: null,
    feedback: null
  },
  {
    id: 2,
    competitionId: 2,
    competitionTitle: "Young Filmmaker Award",
    entryTitle: "Digital Dreams",
    submittedDate: "2024-01-20T14:15:00",
    status: "Scored",
    statusColor: "blue",
    fileUrl: "/submissions/film-1.mp4",
    description: "A short film exploring the intersection of technology and human connection.",
    wordCount: null,
    canEdit: false,
    score: 87.5,
    rank: 12,
    feedback: "Excellent cinematography and strong narrative. Some pacing issues in the middle section."
  },
  {
    id: 3,
    competitionId: 4,
    competitionTitle: "Poetry Slam Competition",
    entryTitle: "Voices of Tomorrow",
    submittedDate: "2024-02-01T09:30:00",
    status: "Winner - 1st Place",
    statusColor: "green",
    fileUrl: "/submissions/poem-1.mp4",
    description: "A powerful spoken word piece about climate change and youth activism.",
    wordCount: null,
    canEdit: false,
    score: 94.2,
    rank: 1,
    feedback: "Outstanding performance with powerful message. Excellent stage presence and delivery."
  },
  {
    id: 4,
    competitionId: 3,
    competitionTitle: "Documentary Challenge 2024",
    entryTitle: "Community Voices",
    submittedDate: "2024-02-28T23:45:00",
    status: "Draft",
    statusColor: "gray",
    fileUrl: null,
    description: "A documentary about local artisans preserving traditional crafts.",
    wordCount: null,
    canEdit: true,
    score: null,
    rank: null,
    feedback: null
  },
  {
    id: 5,
    competitionId: 101,
    competitionTitle: "Short Story Challenge 2023",
    entryTitle: "The Last Letter",
    submittedDate: "2023-03-10T16:20:00",
    status: "Not Selected",
    statusColor: "red",
    fileUrl: "/submissions/entry-old.pdf",
    description: "A historical fiction piece set during World War II.",
    wordCount: 1050,
    canEdit: false,
    score: 72.3,
    rank: 45,
    feedback: "Good historical research. Could benefit from stronger character development."
  }
]

export default function UserSubmissions() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'score'>('date')

  // Filter and sort submissions
  const filteredSubmissions = mockSubmissions
    .filter(sub => {
      const matchesSearch = sub.entryTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           sub.competitionTitle.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || sub.status.toLowerCase().includes(statusFilter.toLowerCase())
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime()
      } else if (sortBy === 'score') {
        return (b.score || 0) - (a.score || 0)
      }
      return 0
    })

  const stats = {
    total: mockSubmissions.length,
    pending: mockSubmissions.filter(s => s.status === 'Under Review').length,
    winners: mockSubmissions.filter(s => s.status.includes('Winner')).length,
    avgScore: mockSubmissions.filter(s => s.score).reduce((sum, s) => sum + (s.score || 0), 0) / 
              mockSubmissions.filter(s => s.score).length || 0
  }

  const getStatusIcon = (status: string) => {
    if (status.includes('Winner')) return <Award className="text-yellow-500" size={20} />
    if (status === 'Scored') return <CheckCircle className="text-blue-500" size={20} />
    if (status === 'Under Review') return <Clock className="text-yellow-500" size={20} />
    if (status === 'Draft') return <Edit className="text-gray-500" size={20} />
    if (status === 'Not Selected') return <XCircle className="text-red-500" size={20} />
    return <AlertCircle className="text-gray-500" size={20} />
  }

  const getStatusBadge = (status: string, color: string) => {
    const colors = {
      green: 'bg-green-100 text-green-700 border-green-200',
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      red: 'bg-red-100 text-red-700 border-red-200',
      gray: 'bg-gray-100 text-gray-700 border-gray-200'
    }
    return colors[color as keyof typeof colors] || colors.gray
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Trophy size={32} />
            <h1 className="text-3xl md:text-4xl font-bold">My Submissions</h1>
          </div>
          <p className="text-purple-100 text-lg">
            Track your competition entries and view results
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 pb-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Total Entries</div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Under Review</div>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Wins</div>
            <div className="text-3xl font-bold text-green-600">{stats.winners}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Avg Score</div>
            <div className="text-3xl font-bold text-purple-600">{stats.avgScore.toFixed(1)}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search submissions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="review">Under Review</option>
              <option value="scored">Scored</option>
              <option value="winner">Winners</option>
              <option value="draft">Drafts</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="score">Sort by Score</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>

        {/* Submissions List */}
        <div className="space-y-6">
          {filteredSubmissions.length > 0 ? (
            filteredSubmissions.map((submission) => (
              <div key={submission.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(submission.status)}
                        <h3 className="text-xl font-bold text-gray-900">{submission.entryTitle}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(submission.status, submission.statusColor)}`}>
                          {submission.status}
                        </span>
                      </div>
                      <Link 
                        href={`/competitions/${submission.competitionId}`}
                        className="text-purple-600 hover:text-purple-700 font-medium text-sm mb-2 inline-block"
                      >
                        {submission.competitionTitle}
                      </Link>
                      <p className="text-gray-600 text-sm mb-3">{submission.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          {new Date(submission.submittedDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        {submission.wordCount && (
                          <div className="flex items-center gap-1">
                            <FileText size={16} />
                            {submission.wordCount} words
                          </div>
                        )}
                        {submission.score && (
                          <div className="flex items-center gap-1 text-purple-600 font-semibold">
                            <TrendingUp size={16} />
                            Score: {submission.score}/100
                          </div>
                        )}
                        {submission.rank && (
                          <div className="flex items-center gap-1 text-yellow-600 font-semibold">
                            <Award size={16} />
                            Rank: #{submission.rank}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Feedback Section */}
                  {submission.feedback && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-blue-900 text-sm mb-1">Judge's Feedback</div>
                          <p className="text-blue-800 text-sm">{submission.feedback}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/competitions/${submission.competitionId}`}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                      <Eye size={16} />
                      View Competition
                    </Link>
                    {submission.fileUrl && (
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm font-medium">
                        <Download size={16} />
                        Download Entry
                      </button>
                    )}
                    {submission.canEdit && (
                      <>
                        <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2 text-sm font-medium">
                          <Edit size={16} />
                          Edit
                        </button>
                        <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2 text-sm font-medium">
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No submissions found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or enter a competition!</p>
              <Link
                href="/competitions"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                <Trophy size={20} />
                Browse Competitions
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
