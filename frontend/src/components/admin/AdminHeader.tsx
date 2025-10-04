'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Bell, Search, Settings, LogOut, User, Menu, X } from 'lucide-react'

export default function AdminHeader() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Mock admin data
  const admin = {
    name: "Admin User",
    email: "admin@dheyproductions.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    role: "Super Admin"
  }

  const notifications = [
    { id: 1, message: "New story submitted for review", time: "5 min ago", unread: true },
    { id: 2, message: "User reported inappropriate content", time: "1 hour ago", unread: true },
    { id: 3, message: "Monthly analytics report ready", time: "2 hours ago", unread: false }
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Logo */}
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FC</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-gray-900">Admin Panel</span>
                <div className="text-xs text-gray-500">DHEY Productions</div>
              </div>
            </Link>
          </div>

          {/* Center Section - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" />
              </div>
              <input
                type="text"
                placeholder="Search stories, users, or content..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 hover:shadow-md focus:shadow-lg"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none" />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${
                          notification.unread ? 'bg-blue-50' : ''
                        }`}
                      >
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-gray-100">
                    <button className="text-sm text-purple-600 hover:text-purple-700">
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <Link
              href="/admin/settings"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <Settings size={20} />
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded-lg"
              >
                <Image
                  src={admin.avatar}
                  alt={admin.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                  <div className="text-xs text-gray-500">{admin.role}</div>
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {showProfile && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-3 border-b border-gray-100">
                    <div className="font-medium text-gray-900">{admin.name}</div>
                    <div className="text-sm text-gray-500">{admin.email}</div>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/admin/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User size={16} />
                      <span>Profile Settings</span>
                    </Link>
                    <Link
                      href="/admin/settings"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings size={16} />
                      <span>Admin Settings</span>
                    </Link>
                    <hr className="my-1" />
                    <button className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" />
          </div>
          <input
            type="text"
            placeholder="Search stories, users, or content..."
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 hover:shadow-md focus:shadow-lg"
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none" />
        </div>
      </div>
    </header>
  )
}
