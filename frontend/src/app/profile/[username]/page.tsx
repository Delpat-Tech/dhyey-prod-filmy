import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileTabs from '@/components/profile/ProfileTabs'

interface ProfilePageProps {
  params: {
    username: string
  }
}

export default function UserProfilePage({ params }: ProfilePageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <ProfileHeader username={params.username} />
        <ProfileTabs username={params.username} />
      </div>
    </div>
  )
}