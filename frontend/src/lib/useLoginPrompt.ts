'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { toast } from '@/lib/toast'

export function useLoginPrompt() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const requireAuth = (action: string = 'perform this action') => {
    if (!isAuthenticated) {
      toast.error(`Please sign in to ${action}`)
      router.push('/auth/login')
      return false
    }
    return true
  }

  return { requireAuth, isAuthenticated }
}