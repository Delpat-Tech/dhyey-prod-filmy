'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Info, AlertCircle, X } from 'lucide-react'
import { toastManager } from '@/lib/toast'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastItem {
  id: number
  message: string
  type: ToastType
  duration: number
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    const unsubscribe = toastManager.subscribe((config) => {
      const id = Date.now()
      const newToast: ToastItem = {
        id,
        message: config.message,
        type: config.type,
        duration: config.duration || 3000
      }

      setToasts(prev => [...prev, newToast])

      // Auto remove after duration
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, config.duration || 3000)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <XCircle className="w-5 h-5 text-red-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-600" />
  }

  const styles = {
    success: 'bg-white border-green-500 shadow-green-100',
    error: 'bg-white border-red-500 shadow-red-100',
    info: 'bg-white border-blue-500 shadow-blue-100',
    warning: 'bg-white border-yellow-500 shadow-yellow-100'
  }

  return (
    <div className="fixed top-4 right-4 z-[99999] space-y-2 pointer-events-none">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className={`
            pointer-events-auto
            flex items-center gap-3
            px-4 py-3 rounded-lg
            border-l-4 shadow-lg
            min-w-[280px] max-w-md
            animate-slide-in-right
            ${styles[toast.type]}
          `}
          style={{
            animationDelay: `${index * 50}ms`
          }}
        >
          {icons[toast.type]}
          <p className="flex-1 text-sm font-medium text-gray-900">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
