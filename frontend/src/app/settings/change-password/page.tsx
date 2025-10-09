'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ChangePasswordForm from '@/components/auth/ChangePasswordForm'

export default function ChangePasswordPage() {
  const router = useRouter()

  const handleSuccess = () => {
    setTimeout(() => {
      router.push('/settings')
    }, 2000)
  }

  const handleCancel = () => {
    router.push('/settings')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4 rounded-t-lg">
          <div className="flex items-center space-x-4">
            <Link href="/settings" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Change Password</h1>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-b-lg border-l border-r border-b border-gray-200">
          <div className="p-4">
            <ChangePasswordForm onSuccess={handleSuccess} onCancel={handleCancel} />
          </div>
        </div>
      </div>
    </div>
  )
}