'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import AdminChangePasswordForm from '@/components/admin/AdminChangePasswordForm'

export default function AdminChangePasswordPage() {
  const router = useRouter()

  const handleSuccess = () => {
    setTimeout(() => {
      router.push('/admin/settings')
    }, 2000)
  }

  const handleCancel = () => {
    router.push('/admin/settings')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4 rounded-t-lg">
          <div className="flex items-center space-x-4">
            <Link href="/admin/settings" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Change Admin Password</h1>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-b-lg border-l border-r border-b border-gray-200">
          <div className="p-4">
            <AdminChangePasswordForm onSuccess={handleSuccess} onCancel={handleCancel} />
          </div>
        </div>
      </div>
    </div>
  )
}