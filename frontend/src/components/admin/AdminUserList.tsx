'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Search, 
  Plus, 
  Shield, 
  UserX, 
  Mail, 
  Calendar,
  MoreHorizontal,
  Crown,
  Settings,
  AlertTriangle,
  CheckCircle,
  Edit
} from 'lucide-react'

// Mock admin data
const mockAdmins = [
  {
    id: 1,
    name: "John Smith",
    username: "johnsmith",
    email: "john.smith@dheyproductions.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    role: "super_admin",
    status: "active",
    joinDate: "2023-01-15T10:30:00Z",
    lastActive: "2024-01-15T16:20:00Z",
    permissions: ["all"],
    addedBy: "System",
    department: "Technology"
  },
  {
    id: 2,
    name: "Sarah Wilson",
    username: "sarahwilson",
    email: "sarah.wilson@dheyproductions.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    role: "admin",
    status: "active",
    joinDate: "2023-03-20T14:15:00Z",
    lastActive: "2024-01-15T15:45:00Z",
    permissions: ["content_management", "user_management"],
    addedBy: "John Smith",
    department: "Content"
  },
  {
    id: 3,
    name: "Emma Davis",
    username: "emmadavis",
    email: "emma.davis@dheyproductions.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    role: "admin",
    status: "inactive",
    joinDate: "2023-08-05T11:20:00Z",
    lastActive: "2024-01-10T08:30:00Z",
    permissions: ["analytics", "reporting"],
    addedBy: "John Smith",
    department: "Analytics"
  }
]

const roleColors = {
  super_admin: 'bg-purple-100 text-purple-800',
  admin: 'bg-blue-100 text-blue-800'
}

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  suspended: 'bg-red-100 text-red-800'
}

const roleIcons = {
  super_admin: Crown,
  admin: Shield
}

export default function AdminUserList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedAdmins, setSelectedAdmins] = useState<number[]>([])
  const [showRevokeModal, setShowRevokeModal] = useState(false)
  const [adminToRevoke, setAdminToRevoke] = useState<number | null>(null)

  const filteredAdmins = mockAdmins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || admin.role === filterRole
    const matchesStatus = filterStatus === 'all' || admin.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleRevokeAccess = (adminId: number) => {
    setAdminToRevoke(adminId)
    setShowRevokeModal(true)
  }

  const confirmRevokeAccess = () => {
    console.log('Revoking access for admin:', adminToRevoke)
    setShowRevokeModal(false)
    setAdminToRevoke(null)
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

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'super_admin': return 'Super Admin'
      case 'admin': return 'Admin'
      default: return role
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
          <p className="text-gray-600">Manage admin users and their permissions</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Link
            href="/admin/users"
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            View All Users
          </Link>
          <Link
            href="/admin/admins/add"
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
          >
            <Plus size={16} />
            <span>Add Admin</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Admins</p>
              <p className="text-3xl font-bold text-gray-900">{mockAdmins.length}</p>
            </div>
            <Shield className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Super Admins</p>
              <p className="text-3xl font-bold text-gray-900">{mockAdmins.filter(a => a.role === 'super_admin').length}</p>
            </div>
            <Crown className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Admins</p>
              <p className="text-3xl font-bold text-gray-900">{mockAdmins.filter(a => a.status === 'active').length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search admins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          <div className="text-sm text-gray-500 flex items-center">
            {filteredAdmins.length} admin(s) found
          </div>
        </div>
      </div>

      {/* Admins List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-900">
            Admin Users ({filteredAdmins.length})
          </span>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredAdmins.map((admin) => {
            const RoleIcon = roleIcons[admin.role as keyof typeof roleIcons]
            return (
              <div key={admin.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Image
                        src={admin.avatar}
                        alt={admin.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                        <RoleIcon className="h-3 w-3 text-purple-600" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-gray-900">{admin.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[admin.role as keyof typeof roleColors]}`}>
                          {getRoleDisplayName(admin.role)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[admin.status as keyof typeof statusColors]}`}>
                          {admin.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        @{admin.username} • {admin.email}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {admin.department} • Added by {admin.addedBy} on {formatDate(admin.joinDate)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right text-sm">
                      <div className="text-gray-900 font-medium">
                        {admin.permissions.includes('all') ? 'All Permissions' : `${admin.permissions.length} Permission(s)`}
                      </div>
                      <div className="text-gray-500">
                        Last active: {formatLastActive(admin.lastActive)}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="Edit Admin"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="Send Message"
                      >
                        <Mail size={16} />
                      </button>
                      {admin.role !== 'super_admin' && (
                        <button
                          onClick={() => handleRevokeAccess(admin.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Revoke Access"
                        >
                          <UserX size={16} />
                        </button>
                      )}
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="More Actions"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div className="mt-4 pl-16">
                  <div className="flex flex-wrap gap-2">
                    {admin.permissions.includes('all') ? (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                        All Permissions
                      </span>
                    ) : (
                      admin.permissions.map((permission, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredAdmins.length === 0 && (
          <div className="text-center py-12">
            <Shield className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No admins found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Revoke Access Modal */}
      {showRevokeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Revoke Admin Access</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to revoke admin access for this user? They will lose all administrative privileges immediately.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRevokeModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmRevokeAccess}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Revoke Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
