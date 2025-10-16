import JudgingInterface from '@/components/admin/JudgingInterface'

export default async function JudgingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <JudgingInterface competitionId={id} />
}
