'use client'

import Link from 'next/link'
import { ArrowLeft, Bell, Shield, Eye, Palette, HelpCircle, LogOut, Settings } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'

export default function AdminSettingsPage() {
  const { logout } = useAuth()
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    comments: true,
    likes: true,
    follows: true,
    adminAlerts: true,
    systemNotifications: true
  })

  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showEmail: false,
    showStats: true,
    adminVisibility: true
  })

  const handleSignOut = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/admin/profile" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Admin Settings</h1>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-4 mt-4">
          {/* Admin Notifications */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Bell size={20} className="text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Admin Notifications</h2>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-600">Receive admin updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">System Alerts</h3>
                  <p className="text-sm text-gray-600">Critical system notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.systemNotifications}
                    onChange={(e) => setNotifications({...notifications, systemNotifications: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Admin Alerts</h3>
                  <p className="text-sm text-gray-600">User reports and moderation alerts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.adminAlerts}
                    onChange={(e) => setNotifications({...notifications, adminAlerts: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Admin Privacy */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Shield size={20} className="text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Admin Privacy</h2>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Admin Visibility</h3>
                  <p className="text-sm text-gray-600">Show admin badge on profile</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy.adminVisibility}
                    onChange={(e) => setPrivacy({...privacy, adminVisibility: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Public Profile</h3>
                  <p className="text-sm text-gray-600">Allow users to find your admin profile</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy.profilePublic}
                    onChange={(e) => setPrivacy({...privacy, profilePublic: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Admin Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="divide-y divide-gray-200">
              <Link href="/admin/profile/edit" className="flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors">
                <Eye size={20} className="text-gray-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Admin Account Settings</h3>
                  <p className="text-sm text-gray-600">Manage your admin account details</p>
                </div>
              </Link>

              <Link href="/admin/settings/change-password" className="flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors">
                <Settings size={20} className="text-gray-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Change Password</h3>
                  <p className="text-sm text-gray-600">Update your admin password</p>
                </div>
              </Link>

              <Link href="/admin" className="flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors">
                <Settings size={20} className="text-gray-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Admin Dashboard</h3>
                  <p className="text-sm text-gray-600">Access admin control panel</p>
                </div>
              </Link>

              <button className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors">
                <Palette size={20} className="text-gray-600" />
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Admin Theme</h3>
                  <p className="text-sm text-gray-600">Customize admin interface</p>
                </div>
              </button>

              <button className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors">
                <HelpCircle size={20} className="text-gray-600" />
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Admin Help</h3>
                  <p className="text-sm text-gray-600">Admin documentation and support</p>
                </div>
              </button>

              <button 
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 p-4 hover:bg-red-50 transition-colors text-red-600"
              >
                <LogOut size={20} />
                <div className="text-left">
                  <h3 className="font-medium">Sign Out</h3>
                  <p className="text-sm text-red-500">Sign out of admin account</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}