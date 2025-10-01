import CompetitionDetail from '@/components/competitions/CompetitionDetail'

export default function CompetitionDetailPage({ params }: { params: { id: string } }) {
  return <CompetitionDetail competitionId={params.id} />
}
