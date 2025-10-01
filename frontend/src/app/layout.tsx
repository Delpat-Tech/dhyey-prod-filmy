import type { Metadata } from 'next'
import { Inter, Poppins, Playfair_Display } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'

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

export const metadata: Metadata = {
  metadataBase: new URL('https://filmy-creatives.vercel.app'),
  title: 'Filmy Creatives - Share Your Stories',
  description: 'A creative storytelling platform where writers share their stories and readers discover amazing content.',
  keywords: 'stories, creative writing, storytelling, DHEY Productions',
  authors: [{ name: 'DHEY Productions' }],
  openGraph: {
    title: 'Filmy Creatives - Share Your Stories',
    description: 'A creative storytelling platform where writers share their stories and readers discover amazing content.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} ${playfairDisplay.variable} font-sans bg-gray-50 min-h-screen`}>
        <div className="flex flex-col min-h-screen">
          {/* Desktop/Tablet Navigation */}
          <div className="hidden md:block">
            <Navbar />
          </div>
          
          {/* Main Content */}
          <main className="flex-1 pb-16 md:pb-0">
            {children}
          </main>
          
          {/* Mobile Bottom Navigation */}
          <div className="md:hidden">
            <BottomNav />
          </div>
        </div>
      </body>
    </html>
  )
}
