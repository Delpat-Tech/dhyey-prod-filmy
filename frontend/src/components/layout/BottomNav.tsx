'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Plus, User, Building, LogIn } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useLoginPrompt } from '@/lib/useLoginPrompt'

export default function BottomNav() {
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()
  const { requireAuth } = useLoginPrompt()

  const authenticatedNavItems = [
    { href: '/dashboard', icon: Home, label: 'Home' },
    { href: '/search', icon: Search, label: 'Search' },
    { href: '/create', icon: Plus, label: 'Create' },
    { href: '/dhey-production', icon: Building, label: 'DHEY' },
    { href: '/profile', icon: User, label: 'Profile' },
  ]

  const guestNavItems = [
    { href: '/dashboard', icon: Home, label: 'Home' },
    { href: '/search', icon: Search, label: 'Search', requiresAuth: true },
    { href: '/auth/login', icon: LogIn, label: 'Sign In' },
    { href: '/dhey-production', icon: Building, label: 'DHEY' },
  ]

  const navItems = isAuthenticated ? authenticatedNavItems : guestNavItems

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map(({ href, icon: Icon, label, requiresAuth }: any) => {
          const isActive = pathname === href || (href === '/dashboard' && pathname === '/')
          
          const handleClick = (e: React.MouseEvent) => {
            if (requiresAuth && !requireAuth(`access ${label.toLowerCase()}`)) {
              e.preventDefault()
              return
            }
          }
          
          return (
            <Link
              key={href}
              href={href}
              onClick={handleClick}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                isActive
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon 
                size={20} 
                className={`transition-all duration-300 ${
                  isActive ? 'text-purple-600 animate-bounce' : 'text-gray-600'
                }`}
              />
              <span className={`text-xs mt-1 transition-all duration-300 ${
                isActive ? 'text-purple-600 font-medium scale-105' : 'text-gray-600'
              }`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
