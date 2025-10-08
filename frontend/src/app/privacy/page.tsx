import Link from 'next/link'
import {
  ShieldCheck,
  Database,
  Radar,
  Cookie,
  Share2,
  Clock3,
  Lock,
  UserCheck,
  Baby,
  RefreshCcw,
  Mail
} from 'lucide-react'

const lastUpdated = 'October 8, 2025'

export const metadata = {
  title: 'Privacy Policy | Dhyey Productions',
  description: 'Learn how Dhyey Productions collects, uses, and protects your personal information.'
}

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 text-gray-100">
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.35),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(139,92,246,0.35),_transparent_55%)]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 sm:px-8 lg:px-12">
        <header className="text-center mb-12">
          <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 bg-white/10 border border-white/20 rounded-full">
            Dhyey Productions
          </span>
          <h1 className="mt-6 text-4xl font-bold text-white sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-base text-white/80 sm:text-lg">
            We respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains what data we collect, how we use it, and the choices you have.
          </p>
          <p className="mt-2 text-sm text-indigo-200">Last updated: {lastUpdated}</p>
        </header>

        <div className="space-y-10 bg-white/95 text-slate-900 rounded-3xl shadow-2xl border border-white/40 backdrop-blur-xl p-8 sm:p-10">
          <section id="introduction" className="space-y-3">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-indigo-700">
              <ShieldCheck className="h-6 w-6 text-purple-600" />
              <span>1. Introduction</span>
            </h2>
            <p>
              This Privacy Policy ("Policy") describes how Dhyey Productions ("we", "us", or "our") collects, uses, discloses, and safeguards personal information in connection with our storytelling platform, products, and services (collectively, the "Platform"). By accessing or using the Platform, you consent to the practices described in this Policy and our <Link href="/terms" className="text-purple-600 hover:text-purple-700 font-medium">Terms & Conditions</Link>.
            </p>
          </section>

          <section id="data-we-collect" className="space-y-3">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-indigo-700">
              <Database className="h-6 w-6 text-purple-600" />
              <span>2. Information We Collect</span>
            </h2>
            <p>
              We collect information that you provide directly to us when you create an account, submit stories, or communicate with our team. This may include your name, username, email address, profile details, story content, and any feedback you share. We also automatically collect technical data such as device type, browser version, IP address, approximate location, and usage patterns to improve the Platform.
            </p>
          </section>

          <section id="how-we-use" className="space-y-3">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-indigo-700">
              <Radar className="h-6 w-6 text-purple-600" />
              <span>3. How We Use Your Information</span>
            </h2>
            <p>
              We use personal information to operate, maintain, and enhance the Platform; review and publish stories; manage your account; communicate updates, security alerts, and support responses; analyze usage trends; personalize your experience; and develop new features. We may also use aggregated, anonymized data for analytics and performance reporting.
            </p>
          </section>

          <section id="cookies" className="space-y-3">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-indigo-700">
              <Cookie className="h-6 w-6 text-purple-600" />
              <span>4. Cookies & Tracking Technologies</span>
            </h2>
            <p>
              We use cookies and similar technologies to remember your preferences, authenticate sessions, analyze traffic, and measure the effectiveness of our campaigns. You can adjust your browser settings to refuse cookies or alert you when cookies are being sent. However, disabling cookies may impact certain features of the Platform.
            </p>
          </section>

          <section id="sharing" className="space-y-3">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-indigo-700">
              <Share2 className="h-6 w-6 text-purple-600" />
              <span>5. How We Share Information</span>
            </h2>
            <p>
              We do not sell your personal information. We may share limited data with trusted service providers who assist us with hosting, analytics, email delivery, and customer support. These providers are bound by confidentiality obligations. We may also disclose information if required by law, to enforce our policies, or to protect the rights, property, or safety of Dhyey Productions, our users, or the public.
            </p>
          </section>

          <section id="retention" className="space-y-3">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-indigo-700">
              <Clock3 className="h-6 w-6 text-purple-600" />
              <span>6. Data Retention</span>
            </h2>
            <p>
              We retain personal information for as long as necessary to fulfill the purposes described in this Policy, comply with our legal obligations, resolve disputes, and enforce agreements. When data is no longer required, we will securely delete or anonymize it.
            </p>
          </section>

          <section id="security" className="space-y-3">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-indigo-700">
              <Lock className="h-6 w-6 text-purple-600" />
              <span>7. Security</span>
            </h2>
            <p>
              We implement administrative, technical, and physical safeguards designed to protect personal information against unauthorized access, loss, or misuse. While we strive to maintain robust security, no method of transmission or storage is completely secure. We encourage you to use strong passwords and promptly notify us of any suspected compromise.
            </p>
          </section>

          <section id="rights" className="space-y-3">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-indigo-700">
              <UserCheck className="h-6 w-6 text-purple-600" />
              <span>8. Your Rights & Choices</span>
            </h2>
            <p>
              Depending on your jurisdiction, you may have rights to access, correct, or delete your personal information; object to or restrict processing; request data portability; and withdraw consent where processing is based on consent. To exercise these rights, contact us at <a href="mailto:privacy@dhyeyproductions.com" className="text-purple-600 hover:text-purple-700 font-medium">privacy@dhyeyproductions.com</a>. We will respond in accordance with applicable laws.
            </p>
          </section>

          <section id="children" className="space-y-3">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-indigo-700">
              <Baby className="h-6 w-6 text-purple-600" />
              <span>9. Children&apos;s Privacy</span>
            </h2>
            <p>
              The Platform is not directed to children under the age of 13. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal data, we will take steps to delete such information. Parents or guardians who believe their child has provided personal data should contact us immediately.
            </p>
          </section>

          <section id="updates" className="space-y-3">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-indigo-700">
              <RefreshCcw className="h-6 w-6 text-purple-600" />
              <span>10. Updates to This Policy</span>
            </h2>
            <p>
              We may revise this Policy from time to time to reflect changes in our practices or legal requirements. When we make material updates, we will notify you via email or a prominent notice on the Platform. Your continued use of the Platform following the effective date of the revised Policy constitutes acceptance of the changes.
            </p>
          </section>

          <section id="contact" className="space-y-3">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-indigo-700">
              <Mail className="h-6 w-6 text-purple-600" />
              <span>11. Contact Us</span>
            </h2>
            <p>
              If you have questions or concerns about this Policy or our privacy practices, please contact us at <a href="mailto:privacy@dhyeyproductions.com" className="text-purple-600 hover:text-purple-700 font-medium">privacy@dhyeyproductions.com</a> or write to Dhyey Productions, Ahmedabad, Gujarat, India.
            </p>
          </section>

          <footer className="mt-14 rounded-3xl border border-white/30 bg-gradient-to-r from-indigo-600/95 via-purple-600/90 to-indigo-700/95 p-8 text-white shadow-2xl shadow-indigo-900/40">
            <h2 className="text-2xl font-semibold">Stay in control of your data</h2>
            <p className="mt-3 text-white/80">
              Review your account settings to manage notifications, update profile details, or request data changes. Need help? Our team is ready to assist.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/settings"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-purple-700 transition hover:bg-purple-100"
              >
                Manage Settings
              </Link>
              <a
                href="mailto:privacy@dhyeyproductions.com"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/20"
              >
                <Mail className="h-5 w-5" />
                Contact Privacy Team
              </a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
