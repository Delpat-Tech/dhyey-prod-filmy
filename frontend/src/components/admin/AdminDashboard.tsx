'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle 
} from 'lucide-react'
import Link from 'next/link'
import AdminLoading from './AdminLoading'
import StatCard from './StatCard'
import { adminAPI } from '@/lib/api'

// Mock dashboard data with trends and sparkline data
const dashboardStats = {
  totalStories: {
    value: 1247,
    change: 12,
    trend: 'up' as const,
    sparklineData: [1100, 1150, 1180, 1200, 1220, 1240, 1247]
  },
  totalUsers: {
    value: 8934,
    change: 8,
    trend: 'up' as const,
    sparklineData: [8200, 8350, 8500, 8650, 8750, 8850, 8934]
  },
  totalViews: {
    value: 125678,
    change: 23,
    trend: 'up' as const,
    sparklineData: [98000, 105000, 112000, 118000, 122000, 124000, 125678]
  },
  totalLikes: {
    value: 23456,
    change: 15,
    trend: 'up' as const,
    sparklineData: [19500, 20200, 21000, 21800, 22500, 23100, 23456]
  },
  pendingReviews: 12,
  todaySubmissions: 8,
  activeUsers: 234,
  reportedContent: 3
}

const recentActivity = [
  {
    id: 1,
    type: 'story_submitted',
    message: 'New story "Digital Dreams" submitted by Alex Chen',
    time: '5 minutes ago',
    status: 'pending'
  },
  {
    id: 2,
    type: 'user_registered',
    message: 'New user Sarah Johnson registered',
    time: '12 minutes ago',
    status: 'success'
  },
  {
    id: 3,
    type: 'content_reported',
    message: 'Story "Midnight Tales" reported for inappropriate content',
    time: '1 hour ago',
    status: 'warning'
  },
  {
    id: 4,
    type: 'story_approved',
    message: 'Story "Ocean Whispers" approved and published',
    time: '2 hours ago',
    status: 'success'
  }
]



export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState<any>(dashboardStats)
  const [isLoading, setIsLoading] = useState(true)
  const [pendingStories, setPendingStories] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)
    loadDashboardData()
    loadPendingStories()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      const response = await adminAPI.getDashboardStats()
      if (response.data) {
        setStats({
          ...response.data,
          pendingReviews: response.data.pendingReviews || 0,
          todaySubmissions: response.data.todaySubmissions || 0,
          activeUsers: response.data.activeUsers || 0,
          reportedContent: response.data.reportedContent || 0,
          suspendedUsers: response.data.suspendedUsers || 0,
          adminUsers: response.data.adminUsers || 0,
          totalAllUsers: response.data.totalAllUsers || 0
        })
      } else {
        setStats(dashboardStats)
      }
    } catch (error) {
      console.error('Failed to load dashboard stats:', error)
      // Fallback to mock data
      setStats(dashboardStats)
    } finally {
      setIsLoading(false)
    }
  }



  const loadPendingStories = async () => {
    try {
      const response = await adminAPI.getAllStories(new URLSearchParams({ limit: '3', status: 'pending' }))
      if (response.data?.stories) {
        setPendingStories(response.data.stories)
      }
    } catch (error) {
      console.error('Failed to load pending stories:', error)
    }
  }

  if (!mounted || isLoading) {
    return <AdminLoading />
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening on your platform.</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: Just now
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 gap-6">
        <StatCard
          title="Total Stories"
          value={stats.totalStories?.value || 0}
          change={stats.totalStories?.change || 0}
          changeType="percentage"
          trend={stats.totalStories?.trend || 'up'}
          icon={FileText}
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          sparklineData={stats.totalStories?.sparklineData || []}
        />
      </div>

      {/* Enhanced Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/stories" className="group relative overflow-hidden bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 hover:scale-105 hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-white/90">Pending Reviews</p>
                <p className="text-3xl font-bold text-white">{stats.pendingReviews || 0}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-white/80">Stories awaiting approval</p>
            <div className="mt-3 flex items-center text-xs text-white/70">
              <div className="flex-1 bg-white/20 rounded-full h-1">
                <div className="bg-white/60 h-1 rounded-full" style={{ width: stats.pendingReviews > 10 ? '75%' : '25%' }}></div>
              </div>
              <span className="ml-2">{stats.pendingReviews > 10 ? 'High Priority' : 'Low Priority'}</span>
            </div>
          </div>
        </Link>

        <Link href="/admin/stories" className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 hover:scale-105 hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-white/90">Today's Submissions</p>
                <p className="text-3xl font-bold text-white">{stats.todaySubmissions || 0}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-white/80">New stories submitted today</p>
            <div className="mt-3 flex items-center text-xs text-white/70">
              <div className="flex-1 bg-white/20 rounded-full h-1">
                <div className="bg-white/60 h-1 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <span className="ml-2">Above Average</span>
            </div>
          </div>
        </Link>

        <Link href="/admin/users" className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 hover:scale-105 hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-white/90">Total Users</p>
                <p className="text-3xl font-bold text-white">{stats.totalAllUsers || 0}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-white/80">Regular: {stats.totalUsers?.value || 0}, Suspended: {stats.suspendedUsers || 0}, Admins: {stats.adminUsers || 0}</p>
            <div className="mt-3 flex items-center text-xs text-white/70">
              <div className="flex-1 bg-white/20 rounded-full h-1">
                <div className="bg-white/60 h-1 rounded-full" style={{ width: stats.totalAllUsers > 20 ? '85%' : '45%' }}></div>
              </div>
              <span className="ml-2">{stats.totalAllUsers > 20 ? 'Excellent' : 'Good'}</span>
            </div>
          </div>
        </Link>


      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-400' :
                    activity.status === 'warning' ? 'bg-yellow-400' :
                    'bg-blue-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link href="/admin/activity" className="text-sm font-medium text-purple-600 hover:text-purple-700">
                View all activity →
              </Link>
            </div>
          </div>
        </div>

        {/* Pending Stories */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Pending Story Reviews</h3>
            <Link href="/admin/stories" className="text-sm font-medium text-purple-600 hover:text-purple-700">
              View All
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {pendingStories.length > 0 ? pendingStories.map((story) => (
                <div key={story._id} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">{story.title}</h4>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span>by {story.author?.name || 'Unknown'}</span>
                    <span>•</span>
                    <span>{story.genre}</span>
                    <span>•</span>
                    <span>{story.content?.length || 0} chars</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Submitted {new Date(story.createdAt).toLocaleDateString()}</p>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No pending stories</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
