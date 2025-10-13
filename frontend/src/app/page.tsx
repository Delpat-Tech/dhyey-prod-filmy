'use client'

import { useEffect } from 'react'

export default function HomePage() {
  useEffect(() => {
    // Always redirect to login page
    window.location.href = '/auth/login'
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}
