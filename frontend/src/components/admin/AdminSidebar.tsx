'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  UserCheck, 
  Settings, 
  BarChart3, 
  Flag, 
  MessageSquare,
  Trophy,
  Building,
  Shield,
  Plus,
  UserMinus,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: any
  badge?: string
}

interface NavSection {
  title: string
  items: NavItem[]
}

const navigationItems: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    ]
  },
  {
    title: 'Content Management',
    items: [
      { name: 'Story Reviews', href: '/admin/stories', icon: FileText, badge: '12' },
      // { name: 'Reports', href: '/admin/reports', icon: Flag, badge: '2' },
    ]
  },
  {
    title: 'User Management',
    items: [
      { name: 'All Users', href: '/admin/users', icon: Users },
      { name: 'Admin Users', href: '/admin/admins', icon: UserCheck },
      { name: 'Add Admin', href: '/admin/admins/add', icon: Plus },
      { name: 'Suspended Users', href: '/admin/users/suspend', icon: UserMinus },
    ]
  },
  {
    title: 'DHEY Production',
    items: [
      { name: 'Competitions', href: '/admin/competitions', icon: Trophy },
      { name: 'Portfolio', href: '/admin/portfolio', icon: Building },
    ]
  }
]

interface AdminSidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export default function AdminSidebar({ isCollapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:pt-16 bg-white border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'lg:w-16' : 'lg:w-64'
    }`}>
      {/* Toggle Button */}
      <div className="absolute -right-3 top-6 z-10">
        <button
          onClick={onToggle}
          className="bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:shadow-md transition-shadow"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          )}
        </button>
      </div>

      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        <nav className="flex-1 px-4 py-6 space-y-8">
          {navigationItems.map((section) => (
            <div key={section.title}>
              {!isCollapsed && (
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.title}
                </h3>
              )}
              <div className={`${!isCollapsed ? 'mt-3' : ''} space-y-1`}>
                {section.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-purple-100 text-purple-700 border-r-2 border-purple-500'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      } ${isCollapsed ? 'justify-center' : ''}`}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <item.icon
                        className={`flex-shrink-0 h-5 w-5 ${
                          isCollapsed ? '' : '-ml-1 mr-3'
                        } ${
                          isActive ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                      />
                      {!isCollapsed && (
                        <>
                          <span className="truncate">{item.name}</span>
                          {item.badge && (
                            <span className="ml-auto inline-block py-0.5 px-2 text-xs font-medium rounded-full bg-red-100 text-red-600">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                      {isCollapsed && item.badge && (
                        <span className="absolute -top-1 -right-1 inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          {!isCollapsed ? (
            <div className="space-y-2">
              <Link
                href="/admin/stories"
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors"
              >
                Review Stories
              </Link>
              <Link
                href="/"
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                View Site
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href="/admin/stories"
                className="w-full flex items-center justify-center p-2 border border-transparent rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                title="Review Stories"
              >
                <FileText className="h-4 w-4" />
              </Link>
              <Link
                href="/"
                className="w-full flex items-center justify-center p-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                title="View Site"
              >
                <Eye className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
