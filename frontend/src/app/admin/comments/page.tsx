import { Metadata } from 'next'
import CommentsManager from '@/components/admin/CommentsManager'

export const metadata: Metadata = {
  title: 'Comments | Dhey Production Admin',
  description: 'Manage and moderate story comments',
}

export default function CommentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <CommentsManager />
    </div>
  )
}

