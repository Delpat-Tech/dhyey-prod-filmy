import JudgingInterface from '@/components/admin/JudgingInterface'

export default function JudgingPage({ params }: { params: { id: string } }) {
  return <JudgingInterface competitionId={params.id} />
}
