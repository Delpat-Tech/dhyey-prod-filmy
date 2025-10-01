'use client'

import { useState } from 'react'
import { 
  Trophy, Plus, Edit, Trash2, Eye, Users, FileText, 
  TrendingUp, Calendar, Search, Filter, MoreVertical,
  CheckCircle, XCircle, Clock, Award
} from 'lucide-react'
import Link from 'next/link'

// Mock data
const mockCompetitions = [
  {
    id: 1,
    title: "Short Story Challenge 2024",
    status: "Open",
    category: "Writing",
    startDate: "2024-01-01",
    deadline: "2024-03-15",
    participants: 234,
    submissions: 156,
    maxParticipants: 500,
    prize: "$5,000",
    published: true
  },
  {
    id: 2,
    title: "Young Filmmaker Award",
    status: "Open",
    category: "Film",
    startDate: "2024-01-15",
    deadline: "2024-04-30",
    participants: 89,
    submissions: 67,
    maxParticipants: 200,
    prize: "$10,000",
    published: true
  },
  {
    id: 3,
    title: "Documentary Challenge 2024",
    status: "Open",
    category: "Documentary",
    startDate: "2024-02-01",
    deadline: "2024-05-31",
    participants: 45,
    submissions: 34,
    maxParticipants: 150,
    prize: "$7,500",
    published: true
  },
  {
    id: 4,
    title: "Poetry Slam Competition",
    status: "Closing Soon",
    category: "Poetry",
    startDate: "2023-12-01",
    deadline: "2024-02-28",
    participants: 178,
    submissions: 142,
    maxParticipants: 300,
    prize: "$3,000",
    published: true
  },
  {
    id: 5,
    title: "Photography Contest 2024",
    status: "Draft",
    category: "Photography",
    startDate: "2024-03-01",
    deadline: "2024-06-30",
    participants: 0,
    submissions: 0,
    maxParticipants: 400,
    prize: "$8,000",
    published: false
  }
]

export default function AdminCompetitionsManager() {
  const [activeTab, setActiveTab] = useState<'all' | 'open' | 'closed' | 'draft'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCompetitions, setSelectedCompetitions] = useState<number[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Filter competitions based on active tab and search
  const filteredCompetitions = mockCompetitions.filter(comp => {
    const matchesSearch = comp.title.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (activeTab === 'all') return matchesSearch
    if (activeTab === 'open') return matchesSearch && comp.status === 'Open'
    if (activeTab === 'closed') return matchesSearch && comp.status === 'Closed'
    if (activeTab === 'draft') return matchesSearch && comp.status === 'Draft'
    
    return matchesSearch
  })

  const stats = {
    total: mockCompetitions.length,
    active: mockCompetitions.filter(c => c.status === 'Open' || c.status === 'Closing Soon').length,
    totalParticipants: mockCompetitions.reduce((sum, c) => sum + c.participants, 0),
    totalSubmissions: mockCompetitions.reduce((sum, c) => sum + c.submissions, 0)
  }

  const toggleSelectAll = () => {
    if (selectedCompetitions.length === filteredCompetitions.length) {
      setSelectedCompetitions([])
    } else {
      setSelectedCompetitions(filteredCompetitions.map(c => c.id))
    }
  }

  const toggleSelect = (id: number) => {
    setSelectedCompetitions(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      'Open': 'bg-green-100 text-green-700',
      'Closing Soon': 'bg-yellow-100 text-yellow-700',
      'Closed': 'bg-red-100 text-red-700',
      'Draft': 'bg-gray-100 text-gray-700'
    }
    return styles[status as keyof typeof styles] || styles.Draft
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Competition Management</h1>
              <p className="text-gray-600">Manage all competitions, submissions, and judging</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
            >
              <Plus size={20} />
              Create Competition
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">Total Competitions</span>
                <Trophy className="text-purple-600" size={20} />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">Active</span>
                <Clock className="text-green-600" size={20} />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.active}</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">Total Participants</span>
                <Users className="text-blue-600" size={20} />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalParticipants}</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">Total Submissions</span>
                <FileText className="text-orange-600" size={20} />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalSubmissions}</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search competitions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Bulk Actions */}
            {selectedCompetitions.length > 0 && (
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2">
                  <Trash2 size={18} />
                  Delete ({selectedCompetitions.length})
                </button>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto">
            {(['all', 'open', 'closed', 'draft'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Competitions Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedCompetitions.length === filteredCompetitions.length && filteredCompetitions.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Competition</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Deadline</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Participants</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Submissions</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCompetitions.map((competition) => (
                  <tr key={competition.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedCompetitions.includes(competition.id)}
                        onChange={() => toggleSelect(competition.id)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">{competition.title}</div>
                        <div className="text-sm text-gray-500">Prize: {competition.prize}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(competition.status)}`}>
                        {competition.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{competition.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        {new Date(competition.deadline).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {competition.participants}/{competition.maxParticipants}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{competition.submissions}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/competitions/${competition.id}`}
                          className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} className="text-purple-600" />
                        </Link>
                        <Link
                          href={`/admin/competitions/${competition.id}/edit`}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} className="text-blue-600" />
                        </Link>
                        <Link
                          href={`/admin/competitions/${competition.id}/judge`}
                          className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                          title="Judge Submissions"
                        >
                          <Award size={18} className="text-green-600" />
                        </Link>
                        <button
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCompetitions.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No competitions found</h3>
              <p className="text-gray-500">Try adjusting your filters or create a new competition</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
