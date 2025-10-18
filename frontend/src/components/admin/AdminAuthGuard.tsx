'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { hasAdminAccess, getStoredUserData } from '@/lib/roleUtils'
import AdminLoading from './AdminLoading'

interface AdminAuthGuardProps {
  children: React.ReactNode
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const [isVerifying, setIsVerifying] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const verifyAdminAccess = async () => {
      // Wait for auth context to load
      if (isLoading) return

      // Double-check with stored data in case context is stale
      const storedUser = getStoredUserData()
      const currentUser = user || storedUser

      // Check if user is authenticated
      if (!isAuthenticated || !currentUser) {
        console.log('No authenticated user found, redirecting to login')
        router.replace('/auth/login')
        return
      }

      // Check if user has admin access
      if (!hasAdminAccess(currentUser)) {
        console.log(`User ${currentUser.email} with role ${currentUser.role} attempted to access admin panel`)
        // Redirect non-admin users to their dashboard
        router.replace('/dashboard')
        return
      }

      console.log(`Admin access granted for ${currentUser.email} with role ${currentUser.role}`)
      setIsVerifying(false)
    }

    verifyAdminAccess()
  }, [isLoading, isAuthenticated, user, router])

  // Show loading while verifying
  if (isLoading || isVerifying) {
    return <AdminLoading />
  }

  // Show loading if no user data yet
  if (!user) {
    return <AdminLoading />
  }

  // Only render admin content if user has admin access
  if (hasAdminAccess(user)) {
    return <>{children}</>
  }

  // Fallback loading (shouldn't reach here due to redirect)
  return <AdminLoading />
}