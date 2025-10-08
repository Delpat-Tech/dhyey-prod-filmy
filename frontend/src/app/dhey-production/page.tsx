import DHEYHero from '@/components/dhey/DHEYHero'
import AboutSection from '@/components/dhey/AboutSection'
import WorkShowcase from '@/components/dhey/WorkShowcase'
import CompetitionsSection from '@/components/dhey/CompetitionsSection'
import ContactSection from '@/components/dhey/ContactSection'

export default function DHEYProductionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <DHEYHero />
      <AboutSection />
      <WorkShowcase />
      <CompetitionsSection />
      <ContactSection />
    </div>
  )
}
