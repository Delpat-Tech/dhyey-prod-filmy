'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  UserCheck, 
  Ban,
  AlertTriangle,
  Clock,
  Eye,
  Undo2,
  CalendarDays,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// Types
type UserStatus = 'active' | 'suspended' | 'pending'

type User = {
  id: number
  name: string
  username: string
  email: string
  avatar: string
  status: UserStatus
  suspensionReason?: string
  suspensionDate?: string
  suspensionEnds?: string
  suspendedBy?: string
  notes?: string
  reportCount: number
}

export default function SuspendUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [showUnsuspendModal, setShowUnsuspendModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: 1,
        name: "Alex Johnson",
        username: "alexj",
        email: "alex.johnson@example.com",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        status: "suspended",
        suspensionReason: "Violation of community guidelines",
        suspensionDate: "2024-01-15T10:30:00Z",
        suspensionEnds: "2024-02-15T10:30:00Z",
        suspendedBy: "admin@dheyproduction.com",
        reportCount: 3,
        notes: "Multiple reports of inappropriate content"
      },
      {
        id: 2,
        name: "Sarah Williams",
        username: "sarahw",
        email: "sarah.w@example.com",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        status: "suspended",
        suspensionReason: "Spam account",
        suspensionDate: "2024-01-10T14:20:00Z",
        suspensionEnds: "Permanent",
        suspendedBy: "moderator@dheyproduction.com",
        reportCount: 12,
        notes: "Automated spam account, multiple violations"
      },
      // Add more mock users as needed
    ]
    setUsers(mockUsers)
  }, [])

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === currentUsers.length 
        ? [] 
        : currentUsers.map(user => user.id)
    )
  }

  const handleUnsuspend = (user: User) => {
    setSelectedUser(user)
    setShowUnsuspendModal(true)
  }

  const confirmUnsuspend = () => {
    if (selectedUser) {
      // In a real app, this would be an API call
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, status: 'active', suspensionReason: undefined } 
          : user
      ))
      setShowUnsuspendModal(false)
      setSelectedUser(null)
      setSelectedUsers(selectedUsers.filter(id => id !== selectedUser.id))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTimeRemaining = (endDate: string) => {
    if (endDate === 'Permanent') return 'Permanent suspension'
    
    const now = new Date()
    const end = new Date(endDate)
    const diffInMs = end.getTime() - now.getTime()
    
    if (diffInMs <= 0) return 'Suspension ended'
    
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ${hours}h remaining`
    if (hours > 0) return `${hours}h remaining`
    
    const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${minutes}m remaining`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Suspended Users</h1>
          <p className="text-gray-600">Manage suspended user accounts and review suspension details</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/admin/users"
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <UserCheck size={16} />
            <span>Back to All Users</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Suspended</p>
              <p className="text-3xl font-bold text-gray-900">
                {users.filter(u => u.status === 'suspended').length}
              </p>
            </div>
            <Ban className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Temporary Suspensions</p>
              <p className="text-3xl font-bold text-gray-900">
                {users.filter(u => u.status === 'suspended' && u.suspensionEnds !== 'Permanent').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Permanent Bans</p>
              <p className="text-3xl font-bold text-gray-900">
                {users.filter(u => u.suspensionEnds === 'Permanent').length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-700" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search suspended users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Suspended Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedUsers.length > 0 && selectedUsers.length === currentUsers.length}
              onChange={handleSelectAll}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <span className="ml-3 text-sm font-medium text-gray-900">
              {selectedUsers.length > 0 ? `${selectedUsers.length} selected` : `Suspended Users (${filteredUsers.length})`}
            </span>
            {selectedUsers.length > 0 && (
              <div className="ml-4 flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedUser(users.find(u => u.id === selectedUsers[0]) || null)
                    setShowUnsuspendModal(true)
                  }}
                  className="flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                >
                  <Undo2 size={16} className="mr-1.5" />
                  Reinstate {selectedUsers.length > 1 ? `${selectedUsers.length} users` : 'user'}
                </button>
              </div>
            )}
          </div>
        </div>

        {currentUsers.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {currentUsers.map((user) => (
              <div key={user.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />

                    <div className="flex items-center space-x-4">
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={48}
                        height={48}
                        className="rounded-full h-12 w-12"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">{user.name}</h3>
                          <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                            Suspended
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">@{user.username} • {user.email}</p>
                        {user.suspensionReason && (
                          <div className="mt-1 text-sm text-gray-600">
                            <span className="font-medium">Reason:</span> {user.suspensionReason}
                            {user.suspensionEnds && (
                              <span className="ml-3">
                                <span className="font-medium">Until:</span> {user.suspensionEnds === 'Permanent' 
                                  ? 'Permanent' 
                                  : `${formatDate(user.suspensionEnds)} (${formatTimeRemaining(user.suspensionEnds)})`}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUnsuspend(user)}
                      className="flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                    >
                      <Undo2 size={16} className="mr-1.5" />
                      Reinstate
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(user)
                        // View details would be implemented here
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Ban className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No suspended users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try a different search term' : 'No users are currently suspended'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200 rounded-b-lg">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredUsers.length)}
                </span>{' '}
                of <span className="font-medium">{filteredUsers.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show first page, last page, current page, and pages around current page
                  let pageNum: number | null = null
                  
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    // First 3 pages
                    if (i < 4) pageNum = i + 1
                    else if (i === 4) pageNum = totalPages
                  } else if (currentPage >= totalPages - 2) {
                    // Last 3 pages
                    if (i === 0) pageNum = 1
                    else if (i >= 1) pageNum = totalPages - (4 - i)
                  } else {
                    // Middle pages
                    if (i === 0) pageNum = 1
                    else if (i === 4) pageNum = totalPages
                    else pageNum = currentPage - 2 + i
                  }
                  
                  if (pageNum === null) return null
                  
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(pageNum as number)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNum
                          ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Unsuspend Confirmation Modal */}
      {showUnsuspendModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Reinstate User Account</h3>
              <button
                onClick={() => setShowUnsuspendModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                Are you sure you want to reinstate the account for <span className="font-medium">{selectedUser.name}</span>?
              </p>
              {selectedUser.suspensionReason && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Suspension Details</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>Reason: {selectedUser.suspensionReason}</p>
                        <p className="mt-1">
                          Suspended on: {selectedUser.suspensionDate ? formatDate(selectedUser.suspensionDate) : 'N/A'}
                        </p>
                        {selectedUser.suspensionEnds && selectedUser.suspensionEnds !== 'Permanent' && (
                          <p className="mt-1">
                            Original end date: {formatDate(selectedUser.suspensionEnds)}
                          </p>
                        )}
                        {selectedUser.notes && (
                          <p className="mt-2 font-medium">Notes: <span className="font-normal">{selectedUser.notes}</span></p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:col-start-2 sm:text-sm"
                onClick={confirmUnsuspend}
              >
                Yes, reinstate account
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                onClick={() => setShowUnsuspendModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
