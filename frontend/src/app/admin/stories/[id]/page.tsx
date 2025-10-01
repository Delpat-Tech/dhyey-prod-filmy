import StoryReviewDetail from '@/components/admin/StoryReviewDetail'

export default function StoryReviewPage({ params }: { params: { id: string } }) {
  return <StoryReviewDetail storyId={params.id} />
}
