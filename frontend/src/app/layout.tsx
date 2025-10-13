// import type { Metadata } from 'next'
import { Inter, Poppins, Playfair_Display } from 'next/font/google'
import './globals.css'
import ConditionalLayout from '@/components/layout/ConditionalLayout'
import { AuthProvider } from '@/contexts/AuthContext'
import AuthGuard from '@/components/AuthGuard'
import ToastContainer from '@/components/ui/ToastContainer'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
})

const playfairDisplay = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata = {
  title: 'DHYEY - Storytelling Platform',
  description: 'A creative storytelling platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} ${playfairDisplay.variable} font-sans bg-gray-50 min-h-screen`}>
        <AuthProvider>
          <AuthGuard>
            <ConditionalLayout>{children}</ConditionalLayout>
          </AuthGuard>
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  )
}
