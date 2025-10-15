import StoryReviewDetail from '@/components/admin/StoryReviewDetail'

export default async function StoryReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <StoryReviewDetail storyId={id} />
}
