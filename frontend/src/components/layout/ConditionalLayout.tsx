'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import Navbar from './Navbar'
import BottomNav from './BottomNav'

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/auth/login' || pathname === '/auth/register' || pathname === '/auth/forgot-password' || pathname.startsWith('/admin')

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar Navigation - Hide on auth pages */}
      {!isAuthPage && sidebarOpen && (
        <div className="hidden md:block fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40">
          <Navbar />
        </div>
      )}
      
      {/* Main Content */}
      <main className={`flex-1 ${!isAuthPage && sidebarOpen ? 'md:ml-64' : ''} ${!isAuthPage ? 'pb-16 md:pb-0' : ''} relative w-full max-w-full overflow-x-hidden`}>
        {!isAuthPage && (
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="hidden md:block fixed top-4 left-4 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            <Menu size={20} />
          </button>
        )}
        {children}
      </main>
      
      {/* Mobile Bottom Navigation - Hide on auth pages */}
      {!isAuthPage && (
        <div className="md:hidden">
          <BottomNav />
        </div>
      )}
    </div>
  )
}
