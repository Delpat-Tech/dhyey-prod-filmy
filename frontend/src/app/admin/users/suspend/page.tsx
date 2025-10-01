import { Metadata } from 'next'
import SuspendUsers from '@/components/admin/SuspendUsers'

export const metadata: Metadata = {
  title: 'Suspended Users | Dhey Production',
  description: 'Manage suspended user accounts',
}

export default function SuspendUsersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <SuspendUsers />
    </div>
  )
}
