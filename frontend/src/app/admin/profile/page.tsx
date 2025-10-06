'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Edit, Settings, Shield } from 'lucide-react'
import { adminAPI } from '../../../lib/api'
import { getAvatarUrl } from '../../../lib/imageUtils'

export default function AdminProfilePage() {
  const [adminData, setAdminData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      const response = await adminAPI.getAdminProfile()
      setAdminData(response.data.user)
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border-b border-gray-200">
            <div className="px-4 py-6">
              <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
                <div className="w-20 h-20 md:w-[150px] md:h-[150px] bg-gray-200 rounded-full animate-pulse mb-4 md:mb-0"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!adminData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border-b border-gray-200">
            <div className="px-4 py-6 text-center">
              <p className="text-gray-600">Failed to load admin profile.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Admin Profile Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
              {/* Avatar */}
              <Image
                src={getAvatarUrl(adminData.avatar)}
                alt={adminData.name || 'Admin'}
                width={80}
                height={80}
                className="rounded-full md:w-[150px] md:h-[150px] mb-4 md:mb-0"
              />

              {/* Profile Info */}
              <div className="flex-1">
                {/* Name and Username */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                      {adminData.name || 'Admin User'}
                    </h1>
                    <Shield className="text-purple-600" size={20} />
                  </div>
                  <p className="text-gray-600 mb-3 md:mb-4">@{adminData.username || 'admin'}</p>
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mb-4">
                    <Shield size={12} className="mr-1" />
                    Administrator
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href="/admin/profile/edit"
                      className="bg-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-600 transition-colors flex items-center space-x-2"
                    >
                      <Edit size={16} />
                      <span>Edit Profile</span>
                    </Link>
                    <Link
                      href="/admin/settings"
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center space-x-2"
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </Link>
                  </div>
                </div>

                {/* Admin Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg md:text-xl font-bold text-gray-900">
                      {adminData.stats?.storiesCount || 0}
                    </div>
                    <div className="text-sm text-gray-600">Stories Managed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg md:text-xl font-bold text-gray-900">
                      {adminData.stats?.followersCount || 0}
                    </div>
                    <div className="text-sm text-gray-600">Users Managed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg md:text-xl font-bold text-gray-900">
                      {adminData.stats?.followingCount || 0}
                    </div>
                    <div className="text-sm text-gray-600">Reports Handled</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg md:text-xl font-bold text-gray-900">
                      {adminData.stats?.likesCount || 0}
                    </div>
                    <div className="text-sm text-gray-600">Actions Taken</div>
                  </div>
                </div>

                {/* Bio and Info */}
                <div className="space-y-2">
                  {adminData.bio && (
                    <p className="text-gray-900">{adminData.bio}</p>
                  )}
                  {adminData.location && (
                    <p className="text-gray-600">📍 {adminData.location}</p>
                  )}
                  {adminData.website && (
                    <p className="text-gray-600">
                      🔗 <a href={adminData.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                        {adminData.website}
                      </a>
                    </p>
                  )}
                  <p className="text-gray-600">
                    🛡️ Admin since {new Date(adminData.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Quick Actions */}
        <div className="bg-white mt-4 rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/stories"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900 mb-2">Manage Stories</h3>
              <p className="text-sm text-gray-600">Review and moderate user stories</p>
            </Link>
            <Link
              href="/admin/users"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900 mb-2">Manage Users</h3>
              <p className="text-sm text-gray-600">View and manage user accounts</p>
            </Link>
            <Link
              href="/admin/analytics"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900 mb-2">View Analytics</h3>
              <p className="text-sm text-gray-600">Platform statistics and insights</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}