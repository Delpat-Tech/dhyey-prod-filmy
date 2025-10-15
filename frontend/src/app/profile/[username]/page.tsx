import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileTabs from '@/components/profile/ProfileTabs'

interface ProfilePageProps {
  params: Promise<{
    username: string
  }>
}

export default async function UserProfilePage({ params }: ProfilePageProps) {
  const { username } = await params
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <ProfileHeader username={username} />
        <ProfileTabs username={username} />
      </div>
    </div>
  )
}