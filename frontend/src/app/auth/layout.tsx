export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="auth-layout">
      {children}
    </div>
  )
}

export const metadata = {
  title: 'Authentication - Dhyey',
  description: 'Sign in or create your Dhyey storytelling account'
}
