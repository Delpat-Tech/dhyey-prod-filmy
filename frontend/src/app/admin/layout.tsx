'use client'

import { useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <AdminHeader />
      
      <div className="flex">
        {/* Admin Sidebar */}
        <AdminSidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        
        {/* Main Content */}
        <main className={`flex-1 p-6 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}>
          {children}
        </main>
      </div>
    </div>
  )
}
