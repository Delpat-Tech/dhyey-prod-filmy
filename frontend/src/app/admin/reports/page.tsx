import { Metadata } from 'next'
import { Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Reports | Dhey Production Admin',
  description: 'Manage and review user reports on content',
}

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600">Manage and review user reports</p>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
        <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Coming Soon</h3>
        <p className="text-blue-700">The reports management feature is currently under development and will be available soon.</p>
      </div>
    </div>
  )
}
