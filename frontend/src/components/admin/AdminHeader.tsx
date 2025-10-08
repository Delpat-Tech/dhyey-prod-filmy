'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Settings, LogOut, User, Menu, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getAvatarUrl } from '@/lib/imageUtils'

export default function AdminHeader() {

  const [showProfile, setShowProfile] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { logout, user } = useAuth()
  const router = useRouter()

  // Use only actual user data from backend
  const admin = {
    name: user?.name || "Loading...",
    email: user?.email || "Loading...",
    avatar: getAvatarUrl(user?.avatar),
    role: user?.role === 'admin' ? "Admin" : "User"
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
      // Force redirect even if logout fails
      router.push('/auth/login')
    }
  }



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



          {/* Right Section */}
          <div className="flex items-center space-x-3">


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
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-max">
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
                    <button 
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
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


    </header>
  )
}
