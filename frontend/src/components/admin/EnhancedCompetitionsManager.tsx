'use client'

import { useState, useMemo } from 'react'
import { 
  Plus, Search, Filter, ChevronUp, 
  MoreVertical, Edit, Trash2, Eye, TrendingUp, 
  Users, Award, Clock, Calendar, BarChart2, 
  CheckCircle, XCircle, Clock as ClockIcon, AlertCircle,
  ArrowUpRight, Download, FileText, BarChart3, Sparkles, Star, Zap, Trophy
} from 'lucide-react'
import Link from 'next/link'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'

import { mockCompetitions } from '@/data/mockData'
import CustomSelect from '@/components/ui/CustomSelect'

// Stats cards data
const stats = [
  { 
    title: "Active Competitions", 
    value: "12", 
    change: "+2", 
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    color: "bg-yellow-50 text-yellow-600"
  },
  { 
    title: "Total Submissions", 
    value: "1,247", 
    change: "+15%", 
    icon: <FileText className="w-6 h-6 text-blue-500" />,
    color: "bg-blue-50 text-blue-600"
  },
  { 
    title: "Active Participants", 
    value: "856", 
    change: "+8%", 
    icon: <Users className="w-6 h-6 text-green-500" />,
    color: "bg-green-50 text-green-600"
  },
  { 
    title: "Total Prize Money", 
    value: "$48,500", 
    change: "+$5,000", 
    icon: <Award className="w-6 h-6 text-purple-500" />,
    color: "bg-purple-50 text-purple-600"
  }
]

// Submission trend data
const submissionTrendData = [
  { name: 'Jan', submissions: 65 },
  { name: 'Feb', submissions: 124 },
  { name: 'Mar', submissions: 87 },
  { name: 'Apr', submissions: 156 },
  { name: 'May', submissions: 98 },
  { name: 'Jun', submissions: 145 }
]

// Category distribution data
const categoryData = [
  { name: 'Fiction', value: 35 },
  { name: 'Poetry', value: 25 },
  { name: 'Non-Fiction', value: 20 },
  { name: 'Drama', value: 15 },
  { name: 'Other', value: 5 }
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export default function EnhancedCompetitionsManager() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortConfig, setSortConfig] = useState<{key: string; direction: 'asc' | 'desc'} | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  // Filter and sort competitions
  const filteredCompetitions = useMemo(() => {
    let result = [...mockCompetitions]
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(comp => 
        comp.title.toLowerCase().includes(query) ||
        comp.categories?.some(cat => cat.toLowerCase().includes(query))
      )
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(comp => comp.status === statusFilter)
    }
    
    // Apply sorting
    if (sortConfig !== null) {
      result.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }
    
    return result
  }, [searchQuery, statusFilter, sortConfig])

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; className: string }> = {
      active: { text: 'Active', className: 'bg-green-100 text-green-800' },
      upcoming: { text: 'Upcoming', className: 'bg-blue-100 text-blue-800' },
      ended: { text: 'Ended', className: 'bg-gray-100 text-gray-800' },
      draft: { text: 'Draft', className: 'bg-yellow-100 text-yellow-800' },
      'closing-soon': { text: 'Closing Soon', className: 'bg-purple-100 text-purple-800' }
    }
    const { text, className } = statusMap[status] || { text: status, className: 'bg-gray-100 text-gray-800' }
    return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${className}`}>{text}</span>
  }

  const getDifficultyBadge = (difficulty: string) => {
    const difficultyMap: Record<string, string> = {
      beginner: 'bg-blue-50 text-blue-700 border border-blue-200',
      intermediate: 'bg-purple-50 text-purple-700 border border-purple-200',
      advanced: 'bg-pink-50 text-pink-700 border border-pink-200',
      expert: 'bg-yellow-50 text-yellow-700 border border-yellow-200'
    }
    return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${difficultyMap[difficulty] || 'bg-gray-100'}`}>
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </span>
  }

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Competition Manager</h1>
          <p className="text-gray-600">Create, manage, and monitor all competitions</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/competitions/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            New Competition
          </Link>
          <button className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-lg ${stat.color.replace('text-', 'bg-opacity-20 ')}`}>
                {stat.icon}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{stat.title}</p>
                <div className="flex items-center justify-end gap-2">
                  <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                    stat.change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                style={{ width: `${Math.min(100, 70 + index * 10)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Submission Trends</h3>
            <span className="text-sm text-purple-600 flex items-center gap-1">
              <TrendingUp size={16} />
              12.5% from last month
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={submissionTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #E5E7EB'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="submissions" 
                  stroke="#8B5CF6" 
                  strokeWidth={2} 
                  dot={{ r: 4, fill: '#8B5CF6' }}
                  activeDot={{ r: 6, fill: '#7C3AED' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Categories Distribution</h3>
            <span className="text-sm text-gray-500">Total: 100%</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #E5E7EB'
                  }}
                  formatter={(value: any) => [`${value}%`]}
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value: any, entry: any, index: number) => (
                    <span className="text-xs text-gray-600">
                      {categoryData[index]?.name}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Competitions Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search competitions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-80"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <CustomSelect
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as string)}
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'Active', value: 'active', emoji: '🟢' },
                { label: 'Upcoming', value: 'upcoming', emoji: '🔵' },
                { label: 'Ended', value: 'ended', emoji: '🔴' },
                { label: 'Draft', value: 'draft', emoji: '⚪' }
              ]}
              className="w-48"
            />
            
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-2 ${viewMode === 'grid' ? 'bg-purple-50 text-purple-600' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`p-2 ${viewMode === 'list' ? 'bg-purple-50 text-purple-600' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Title', 'Status', 'Submissions', 'Participants', 'Prize', 'Dates', ''].map((header) => (
                    <th
                      key={header}
                      scope="col"
                      className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center gap-1">
                        {header}
                        {['Title', 'Submissions', 'Participants', 'Prize'].includes(header) && (
                          <button 
                            onClick={() => requestSort(header.toLowerCase())}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {sortConfig?.key === header.toLowerCase() && sortConfig.direction === 'asc' ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCompetitions.map((competition) => (
                  <tr key={competition.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
                          <Trophy className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            {competition.title}
                            {competition.featured && (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-50 text-yellow-700 border border-yellow-100">
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {competition.categories?.join(', ') || competition.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(competition.status)}
                      {competition.difficulty && (
                        <div className="mt-1">
                          {getDifficultyBadge(competition.difficulty)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{competition.submissions}</div>
                      <div className="text-xs text-gray-500">+12 this week</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{competition.participants}</div>
                      <div className="text-xs text-gray-500">Active</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {competition.prize}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>Start: {new Date(competition.startDate).toLocaleDateString()}</div>
                      <div>End: {new Date(competition.deadline).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/competitions/${competition.id}`}
                          className="text-purple-600 hover:text-purple-900"
                          title="View"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          href={`/admin/competitions/${competition.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredCompetitions.map((competition) => (
              <div key={competition.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <Trophy className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{competition.title}</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(competition.categories || [competition.category]).map((cat, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="relative">
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <div className="text-xs text-gray-500">Status</div>
                      {getStatusBadge(competition.status)}
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Difficulty</div>
                      {competition.difficulty && getDifficultyBadge(competition.difficulty)}
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Prize</div>
                      <div className="font-semibold text-purple-600">{competition.prize}</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <Users size={14} className="mr-1" />
                        <span>{competition.participants}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FileText size={14} className="mr-1" />
                        <span>{competition.submissions} Submissions</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-2">Timeline</div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Start</span>
                        <span className="font-medium">
                          {new Date(competition.startDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">End</span>
                        <span className="font-medium">
                          {new Date(competition.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-2">
                    <Link
                      href={`/admin/competitions/${competition.id}`}
                      className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg text-center transition-colors"
                    >
                      Manage
                    </Link>
                    <button className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredCompetitions.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
              <Trophy className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No competitions found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or create a new competition</p>
            <Link
              href="/admin/competitions/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <Plus size={18} />
              New Competition
            </Link>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredCompetitions.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
            <span className="font-medium">24</span> results
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1.5 border border-purple-600 rounded-md text-sm font-medium text-white bg-purple-600">
              1
            </button>
            <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
