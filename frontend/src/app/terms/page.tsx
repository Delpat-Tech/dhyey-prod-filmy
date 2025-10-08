import Link from 'next/link'
import {
  ShieldCheck,
  UserCheck,
  PenSquare,
  ShieldAlert,
  FileCheck2,
  Share2,
  BadgeCheck,
  Coins,
  ExternalLink,
  AlertTriangle,
  Shield,
  Power,
  Gavel,
  RefreshCcw,
  Mail
} from 'lucide-react'

const lastUpdated = 'October 8, 2025'

export const metadata = {
  title: 'Terms & Conditions | Dhyey Productions',
  description: 'Terms governing the use of the Dhyey Productions storytelling platform.'
}

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-950 via-slate-950 to-indigo-950 text-gray-100">
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.35),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(67,56,202,0.35),_transparent_55%)]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 sm:px-8 lg:px-12">
        <header className="text-center mb-12">
          <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 bg-white/10 border border-white/20 rounded-full">
            Dhyey Productions
          </span>
          <h1 className="mt-6 text-4xl font-bold text-white sm:text-5xl">Terms & Conditions</h1>
          <p className="mt-4 text-base text-white/80 sm:text-lg">
            Please read these Terms carefully. By creating an account, submitting stories, or otherwise using the Dhyey Productions platform, you agree to be bound by the terms below.
          </p>
          <p className="mt-2 text-sm text-purple-200">Last updated: {lastUpdated}</p>
        </header>

        <div className="space-y-10 bg-white/95 text-slate-900 rounded-3xl shadow-2xl border border-white/40 backdrop-blur-xl p-8 sm:p-10">
          <section id="introduction" className="space-y-3">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-purple-700">
              <ShieldCheck className="h-6 w-6 text-indigo-600" />
              <span>1. Introduction</span>
            </h2>
            <p>
              These Terms & Conditions ("Terms") govern your access to and use of the Dhyey Productions website, services, and any related applications (collectively, the "Platform"). The Platform is operated by Dhyey Productions and its affiliates ("we", "us", or "our"). By using the Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and our <Link href="/privacy" className="text-indigo-600 hover:text-indigo-700 font-medium">Privacy Policy</Link>.
            </p>
          </section>

          <section id="eligibility" className="space-y-3">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-purple-700">
              <UserCheck className="h-6 w-6 text-indigo-600" />
              <span>2. Eligibility &amp; Account Responsibilities</span>
            </h2>
            <p>
              You must be at least 13 years old (or the age of digital consent in your jurisdiction) to create an account. You are responsible for providing accurate registration details, maintaining the confidentiality of your login credentials, and for all activities that occur under your account. Notify us immediately at <a href="mailto:support@dhyeyproductions.com" className="text-indigo-600 hover:text-indigo-700 font-medium">support@dhyeyproductions.com</a> if you suspect unauthorized access.
            </p>
          </section>

          <section id="user-content" className="space-y-3">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-purple-700">
              <PenSquare className="h-6 w-6 text-indigo-600" />
              <span>3. User Content &amp; Ownership</span>
            </h2>
            <p>
              You retain ownership of the original stories, scripts, artwork, or other materials (collectively, "Content") you submit to the Platform. By submitting Content, you grant us a non-exclusive, worldwide, royalty-free license to host, store, reproduce, display, distribute, and promote the Content in connection with operating and marketing the Platform. You represent and warrant that you own or have the necessary rights to submit the Content and that it does not infringe any third-party rights.
            </p>
          </section>

          <section id="guidelines" className="space-y-3">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-purple-700">
              <ShieldAlert className="h-6 w-6 text-indigo-600" />
              <span>4. Content Guidelines &amp; Moderation</span>
            </h2>
            <p>
              You agree not to submit Content that is illegal, infringing, hateful, discriminatory, exploitative, explicit, or otherwise violates these Terms or applicable law. We reserve the right to review, moderate, edit, or remove any Content at our discretion and to suspend or terminate accounts that repeatedly violate our policies.
            </p>
          </section>

          <section id="review" className="space-y-3">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-purple-700">
              <FileCheck2 className="h-6 w-6 text-indigo-600" />
              <span>5. Review &amp; Publication Process</span>
            </h2>
            <p>
              All submissions are subject to editorial review by our team before publication. While we strive to review Content promptly, we cannot guarantee specific timelines. Content approved by our editors will be published to the Platform and made available to readers. You will be notified if your submission requires revisions or is declined.
            </p>
          </section>

          <section id="usage-rights" className="space-y-3">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-purple-700">
              <Share2 className="h-6 w-6 text-indigo-600" />
              <span>6. Usage Rights for Published Content</span>
            </h2>
            <p>
              Readers may access and share links to published Content for personal, non-commercial purposes. Republishing or distributing Content outside the Platform requires permission from the Content owner and compliance with applicable laws. Embedding or scraping Content is prohibited without our written consent.
            </p>
          </section>

          <section id="copyright" className="space-y-3">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-purple-700">
              <BadgeCheck className="h-6 w-6 text-indigo-600" />
              <span>7. Copyright &amp; Intellectual Property Claims</span>
            </h2>
            <p>
              We respect intellectual property rights and expect our users to do the same. If you believe Content on the Platform infringes your copyright or other rights, please submit a detailed notice to <a href="mailto:legal@dhyeyproductions.com" className="text-indigo-600 hover:text-indigo-700 font-medium">legal@dhyeyproductions.com</a>. We will investigate and respond in accordance with applicable law.
            </p>
          </section>

          <section id="payments" className="space-y-3">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-purple-700">
              <Coins className="h-6 w-6 text-indigo-600" />
              <span>8. Payments &amp; Monetization</span>
            </h2>
            <p>
              Access to the Platform is currently offered without charge. If we introduce paid features, subscriptions, or revenue-sharing programs, additional terms will apply and will be communicated before implementation. Continued use of such features will constitute acceptance of the applicable terms.
            </p>
          </section>

          <section id="third-parties" className="space-y-3">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-purple-700">
              <ExternalLink className="h-6 w-6 text-indigo-600" />
              <span>9. Third-Party Services &amp; Links</span>
            </h2>
            <p>
              The Platform may include links to third-party websites or services. We do not control and are not responsible for the content, policies, or practices of third parties. Accessing third-party services is at your own risk.
            </p>
          </section>

          <section id="disclaimers" className="space-y-3">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-purple-700">
              <AlertTriangle className="h-6 w-6 text-indigo-600" />
              <span>10. Disclaimers &amp; Limitation of Liability</span>
            </h2>
            <p>
              The Platform is provided on an "as-is" and "as-available" basis without warranties of any kind, express or implied. We do not guarantee that the Platform will be uninterrupted, error-free, or secure. To the fullest extent permitted by law, we are not liable for any indirect, incidental, consequential, or punitive damages arising from your use of the Platform.
            </p>
          </section>

          <section id="indemnification" className="space-y-3">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-purple-700">
              <Shield className="h-6 w-6 text-indigo-600" />
              <span>11. Indemnification</span>
            </h2>
            <p>
              You agree to indemnify, defend, and hold harmless Dhyey Productions, its affiliates, and their respective officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses arising from your Content, your use of the Platform, or your violation of these Terms.
            </p>
          </section>

          <section id="termination" className="space-y-3">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-purple-700">
              <Power className="h-6 w-6 text-indigo-600" />
              <span>12. Suspension &amp; Termination</span>
            </h2>
            <p>
              We may suspend or terminate your access to the Platform at any time, with or without notice, if we believe you have violated these Terms or applicable law. You may discontinue use of the Platform at any time by closing your account.
            </p>
          </section>

          <section id="law" className="space-y-3">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-purple-700">
              <Gavel className="h-6 w-6 text-indigo-600" />
              <span>13. Governing Law &amp; Dispute Resolution</span>
            </h2>
            <p>
              These Terms are governed by the laws of the Republic of India, without regard to conflict-of-law principles. Any disputes arising out of or relating to these Terms shall first be attempted to be resolved amicably. If unresolved, disputes shall be submitted to the courts located in Ahmedabad, Gujarat, subject to applicable arbitration or mediation requirements under Indian law.
            </p>
          </section>

          <section id="changes" className="space-y-3">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-purple-700">
              <RefreshCcw className="h-6 w-6 text-indigo-600" />
              <span>14. Changes to These Terms</span>
            </h2>
            <p>
              We may update these Terms from time to time. Material changes will be communicated via email or a prominent notice on the Platform. Your continued use of the Platform after changes take effect constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section id="contact" className="space-y-3">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-purple-700">
              <Mail className="h-6 w-6 text-indigo-600" />
              <span>15. Contact</span>
            </h2>
            <p>
              If you have questions about these Terms or need further information, please contact us at <a href="mailto:support@dhyeyproductions.com" className="text-indigo-600 hover:text-indigo-700 font-medium">support@dhyeyproductions.com</a>.
            </p>
          </section>

          <footer className="mt-14 rounded-3xl border border-white/30 bg-gradient-to-r from-purple-600/95 via-purple-600/90 to-indigo-600/95 p-8 text-white shadow-2xl shadow-purple-900/40">
            <h2 className="text-2xl font-semibold">Need further assistance?</h2>
            <p className="mt-3 text-white/80">
              Our team is here to help you navigate submissions, policies, and community guidelines. Reach out anytime or review our privacy commitments.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="mailto:support@dhyeyproductions.com"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/20"
              >
                <Mail className="h-5 w-5" />
                Contact Support
              </a>
              <Link
                href="/privacy"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-purple-700 transition hover:bg-purple-100"
              >
                <ExternalLink className="h-5 w-5" />
                View Privacy Policy
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
