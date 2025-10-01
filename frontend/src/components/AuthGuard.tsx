'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token') || getCookie('token')
      const publicRoutes = ['/login', '/register']
      const isPublicRoute = publicRoutes.includes(pathname)

      if (!token && !isPublicRoute) {
        router.replace('/login')
        return
      }

      if (token && isPublicRoute) {
        router.replace('/')
        return
      }

      setIsAuthenticated(!!token)
      setIsLoading(false)
    }

    checkAuth()
  }, [pathname, router])

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift()
    return null
  }

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <p>Loading...</p>
      </div>
    )
  }

  return <>{children}</>
}