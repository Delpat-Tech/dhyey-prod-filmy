'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'

export default function DebugInfo() {
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    const info: any = {
      hasToken: !!localStorage.getItem('token'),
      token: localStorage.getItem('token')?.substring(0, 20) + '...',
      apiBaseURL: '/api/v1',
      timestamp: new Date().toISOString()
    }

    try {
      // Test API connection
      const response = await api.get('/users/me')
      info.apiStatus = 'Connected'
      info.userData = response.data.data.user
    } catch (error: any) {
      info.apiStatus = 'Failed'
      info.apiError = error.response?.data?.message || error.message
      info.statusCode = error.response?.status
    }

    setDebugInfo(info)
    setLoading(false)
  }

  if (loading) {
    return <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">Loading debug info...</div>
  }

  return (
    <div className="p-4 bg-gray-100 border border-gray-300 rounded mb-4">
      <h3 className="font-bold mb-2">Debug Information</h3>
      <pre className="text-xs overflow-auto">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
      <button 
        onClick={checkStatus}
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
      >
        Refresh
      </button>
    </div>
  )
}