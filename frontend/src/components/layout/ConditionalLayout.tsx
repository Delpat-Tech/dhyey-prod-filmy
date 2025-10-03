'use client'

import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import BottomNav from './BottomNav'

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [pathname, setPathname] = useState('')
  
  useEffect(() => {
    setPathname(window.location.pathname)
  }, [])
  
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/auth/login' || pathname === '/auth/register' || pathname === '/auth/forgot-password'

  return (
      <div className="flex flex-col min-h-screen">
        {/* Desktop/Tablet Navigation - Hide on auth pages */}
        {!isAuthPage && (
          <div className="hidden md:block">
            <Navbar />
          </div>
        )}
        
        {/* Main Content */}
        <main className={`flex-1 ${!isAuthPage ? 'pb-16 md:pb-0' : ''}`}>
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