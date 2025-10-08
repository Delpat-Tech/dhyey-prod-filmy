'use client'

import { useEffect } from 'react'
import CreateStoryForm from '@/components/create/CreateStoryForm'
import { useAuth } from '@/contexts/AuthContext'

export default function CreatePage() {
  const { isAuthenticated, isLoading, checkTokenValidity } = useAuth()

  useEffect(() => {
    const verifyAuth = async () => {
      if (!isLoading && isAuthenticated) {
        const isValid = await checkTokenValidity()
        if (!isValid) {
          window.location.href = '/auth/login'
        }
      }
    }
    
    verifyAuth()
  }, [isAuthenticated, isLoading, checkTokenValidity])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login'
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-700 bg-clip-text text-transparent mb-3">
            Create Your Story
          </h1>
          <p className="text-gray-600 text-lg">
            Create and publish your story for the world to read
          </p>
        </div>
        
        <CreateStoryForm />
      </div>
    </div>
  )
}
