'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import BottomNav from './BottomNav'
import AuthGuard from '../AuthGuard'

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/login' || pathname === '/register'

  return (
    <AuthGuard>
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
    </AuthGuard>
  )
}