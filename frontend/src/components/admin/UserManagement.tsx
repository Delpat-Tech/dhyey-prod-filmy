'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  UserCheck, 
  UserX, 
  Shield, 
  Mail, 
  Calendar,
  Eye,
  Ban,
  CheckCircle,
  AlertTriangle,
  Download
} from 'lucide-react'
import CustomSelect from '@/components/ui/CustomSelect'
import { adminAPI } from '@/lib/api'
import { showNotification } from '@/lib/errorHandler'



const statusColors = {
  active: 'bg-green-100 text-green-800',
  suspended: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800'
}

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterRole, setFilterRole] = useState('all')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showActionModal, setShowActionModal] = useState(false)
  const [actionType, setActionType] = useState<'suspend' | 'activate' | 'delete' | null>(null)
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  // Load users from backend
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true)
        const params = new URLSearchParams()
        if (filterStatus !== 'all') params.append('status', filterStatus)
        if (filterRole !== 'all') params.append('role', filterRole)
        if (searchTerm) params.append('search', searchTerm)
        
        const response = await adminAPI.getAllUsers(params)
        setUsers(response.data.users || [])
      } catch (error) {
        console.error('Failed to load users:', error)
        setUsers([])
        showNotification({
          type: 'error',
          title: 'Failed to load users',
          message: 'Please check your connection and try again.'
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [filterStatus, filterRole, searchTerm])

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    const matchesRole = filterRole === 'all' || user.role === filterRole
    return matchesSearch && matchesStatus && matchesRole
  })

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length 
        ? [] 
        : filteredUsers.map(user => user.id.toString())
    )
  }

  const handleBulkAction = (action: 'suspend' | 'activate' | 'delete') => {
    setActionType(action)
    setShowActionModal(true)
  }

  const confirmBulkAction = async () => {
    if (selectedUsers.length === 0 || !actionType) return
    
    setIsProcessing(true)
    try {
      for (const userId of selectedUsers) {
        if (actionType === 'suspend') {
          await adminAPI.suspendUser(userId, 'Bulk suspension by admin')
        } else if (actionType === 'activate') {
          await adminAPI.unsuspendUser(userId)
        } else if (actionType === 'delete') {
          await adminAPI.deleteUser(userId)
        }
      }
      
      showNotification({
        type: 'success',
        title: 'Action Completed',
        message: `${selectedUsers.length} users have been ${actionType}d.`
      })
      
      // Reload users
      const params = new URLSearchParams()
      if (filterStatus !== 'all') params.append('status', filterStatus)
      if (filterRole !== 'all') params.append('role', filterRole)
      if (searchTerm) params.append('search', searchTerm)
      
      const response = await adminAPI.getAllUsers(params)
      setUsers(response.data.users || [])
      
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Action Failed',
        message: `Failed to ${actionType} users. Please try again.`
      })
    } finally {
      setIsProcessing(false)
      setShowActionModal(false)
      setActionType(null)
      setSelectedUsers([])
    }
  }

  const handleSingleUserAction = async (userId: string, action: 'suspend' | 'activate' | 'delete') => {
    setIsProcessing(true)
    try {
      if (action === 'suspend') {
        await adminAPI.suspendUser(userId, 'Suspended by admin')
        showNotification({
          type: 'success',
          title: 'User Suspended',
          message: 'The user has been suspended.'
        })
      } else if (action === 'activate') {
        await adminAPI.unsuspendUser(userId)
        showNotification({
          type: 'success',
          title: 'User Activated',
          message: 'The user has been activated.'
        })
      } else if (action === 'delete') {
        await adminAPI.deleteUser(userId)
        showNotification({
          type: 'success',
          title: 'User Deleted',
          message: 'The user has been deleted.'
        })
      }
      
      // Reload users
      const params = new URLSearchParams()
      if (filterStatus !== 'all') params.append('status', filterStatus)
      if (filterRole !== 'all') params.append('role', filterRole)
      if (searchTerm) params.append('search', searchTerm)
      
      const response = await adminAPI.getAllUsers(params)
      setUsers(response.data.users || [])
      
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Action Failed',
        message: `Failed to ${action} user. Please try again.`
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatLastActive = (dateString: string) => {
    const now = new Date()
    const lastActive = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return formatDate(dateString)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage platform users and their permissions</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Download size={16} />
            <span>Export</span>
          </button>
          <Link
            href="/admin/admins"
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
          >
            <Shield size={16} />
            <span>Manage Admins</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{users.length}</p>
            </div>
            <UserCheck className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-gray-900">{users.filter(u => u.status === 'active').length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Suspended</p>
              <p className="text-3xl font-bold text-gray-900">{users.filter(u => u.status === 'suspended').length}</p>
            </div>
            <Ban className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reported Users</p>
              <p className="text-3xl font-bold text-gray-900">{users.filter(u => u.reportCount > 0).length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
            />
          </div>
          <CustomSelect
            value={filterStatus}
            onChange={(value) => setFilterStatus(value as string)}
            options={[
              { label: 'All Status', value: 'all' },
              { label: 'Active', value: 'active', emoji: '✅' },
              { label: 'Suspended', value: 'suspended', emoji: '⛔' },
              { label: 'Pending', value: 'pending', emoji: '⏳' }
            ]}
          />
          <CustomSelect
            value={filterRole}
            onChange={(value) => setFilterRole(value as string)}
            options={[
              { label: 'All Roles', value: 'all' },
              { label: 'User', value: 'user', emoji: '👤' },
              { label: 'Admin', value: 'admin', emoji: '👑' },
              { label: 'Moderator', value: 'moderator', emoji: '🛡️' }
            ]}
          />
          <button className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">
            <Filter size={16} className="mr-2" />
            More Filters
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedUsers.length} user(s) selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('suspend')}
                className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
              >
                Suspend
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedUsers([])}
                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
              onChange={handleSelectAll}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <span className="ml-3 text-sm font-medium text-gray-900">
              Users ({filteredUsers.length})
            </span>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleSelectUser(user.id)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />

                <div className="flex items-center space-x-4 flex-1">
                  <div className="relative">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    {user.verified && (
                      <CheckCircle className="absolute -bottom-1 -right-1 h-4 w-4 text-blue-500 bg-white rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{user.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[user.status]}`}>
                        {user.status}
                      </span>
                      {user.reportCount > 0 && (
                        <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                          {user.reportCount} report(s)
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      @{user.username} • {user.email}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {user.location} • Joined {formatDate(user.joinDate)}
                    </div>
                  </div>

                  <div className="hidden md:flex items-center space-x-6 text-sm text-gray-500">
                    <div className="text-center">
                      <div className="font-medium text-gray-900">{user.stats.stories}</div>
                      <div>Stories</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-900">{user.stats.followers}</div>
                      <div>Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-900">{user.stats.likes}</div>
                      <div>Likes</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      Last active: {formatLastActive(user.lastActive)}
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                        title="View Profile"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                        title="Send Message"
                      >
                        <Mail size={16} />
                      </button>
                      {user.email !== 'admin@dhyey.com' && (
                        <button
                          onClick={() => handleSingleUserAction(user.id, user.status === 'suspended' ? 'activate' : 'suspend')}
                          className={`p-1 rounded ${
                            user.status === 'suspended' 
                              ? 'text-green-400 hover:text-green-600 hover:bg-green-50' 
                              : 'text-red-400 hover:text-red-600 hover:bg-red-50'
                          }`}
                          title={user.status === 'suspended' ? 'Unsuspend User' : 'Suspend User'}
                          disabled={isProcessing}
                        >
                          <UserX size={16} />
                        </button>
                      )}
                      <button
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                        title="More Actions"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Confirmation Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm {actionType?.charAt(0).toUpperCase()}{actionType?.slice(1)} Action
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to {actionType} {selectedUsers.length} selected user(s)? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowActionModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmBulkAction}
                className={`px-4 py-2 rounded-lg text-white ${
                  actionType === 'delete' ? 'bg-red-600 hover:bg-red-700' :
                  actionType === 'suspend' ? 'bg-yellow-600 hover:bg-yellow-700' :
                  'bg-green-600 hover:bg-green-700'
                }`}
              >
                {actionType?.charAt(0).toUpperCase()}{actionType?.slice(1)} Users
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
