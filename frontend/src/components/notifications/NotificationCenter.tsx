'use client'

import { useState, useEffect } from 'react'
import { Bell, Check, X, Clock, AlertCircle } from 'lucide-react'
import { userAPI } from '@/lib/api'

interface Notification {
  id: string
  type: 'story_approved' | 'story_rejected' | 'general'
  title: string
  message: string
  storyId?: string
  storyTitle?: string
  reason?: string
  createdAt: string
  read: boolean
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      setIsLoading(true)
      // This would be a real API call to get user notifications
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'story_approved',
          title: 'Story Approved!',
          message: 'Your story has been approved and is now live.',
          storyId: '123',
          storyTitle: 'The Digital Dreams',
          createdAt: new Date().toISOString(),
          read: false
        },
        {
          id: '2',
          type: 'story_rejected',
          title: 'Story Needs Revision',
          message: 'Your story requires some changes before publication.',
          storyId: '124',
          storyTitle: 'Midnight Tales',
          reason: 'Content does not meet community guidelines',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          read: false
        }
      ]
      setNotifications(mockNotifications)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      // API call to mark notification as read
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      )
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      // API call to mark all notifications as read
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'story_approved':
        return <Check className="w-5 h-5 text-green-500" />
      case 'story_rejected':
        return <X className="w-5 h-5 text-red-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-blue-500" />
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <Clock className="w-6 h-6 mx-auto mb-2 animate-spin" />
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      {notification.storyTitle && (
                        <p className="text-xs text-gray-500 mt-1">
                          Story: "{notification.storyTitle}"
                        </p>
                      )}
                      {notification.reason && (
                        <p className="text-xs text-red-600 mt-1 bg-red-50 p-2 rounded">
                          Reason: {notification.reason}
                        </p>
                      )}
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-100 text-center">
              <button className="text-sm text-purple-600 hover:text-purple-700">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
