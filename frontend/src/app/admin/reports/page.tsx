import { Metadata } from 'next'
import ReportsManager from '@/components/admin/ReportsManager'

export const metadata: Metadata = {
  title: 'Reports | Dhey Production Admin',
  description: 'Manage and review user reports on content',
}

export default function ReportsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ReportsManager />
    </div>
  )
}
