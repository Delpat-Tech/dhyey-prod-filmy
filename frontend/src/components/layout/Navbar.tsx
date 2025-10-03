'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, Plus, User, Menu, X } from 'lucide-react'
import NotificationCenter from '@/components/notifications/NotificationCenter'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
              <span className="text-white font-bold text-sm">FC</span>
            </div>
            <span className="text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-purple-600 font-display">Filmy Creatives</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium transition-all duration-300 hover:scale-105 relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/search" className="text-gray-700 hover:text-gray-900 font-medium transition-all duration-300 hover:scale-105 relative group">
              Discover
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/dhey-production" className="text-gray-700 hover:text-gray-900 font-medium transition-all duration-300 hover:scale-105 relative group">
              DHEY Production
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/search" 
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <Search size={20} />
            </Link>
            <Link 
              href="/create" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center space-x-2 hover:scale-105 hover:shadow-lg active:scale-95 transform"
            >
              <Plus size={16} />
              <span>Create</span>
            </Link>
            <NotificationCenter />
            <Link 
              href="/profile" 
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <User size={20} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <div className="transition-transform duration-300">
              {isMenuOpen ? <X size={24} className="rotate-90" /> : <Menu size={24} />}
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-in slide-in-from-top duration-300">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-gray-900 font-medium px-2 py-1 transition-all duration-300 hover:translate-x-2 hover:text-purple-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/search" 
                className="text-gray-700 hover:text-gray-900 font-medium px-2 py-1 transition-all duration-300 hover:translate-x-2 hover:text-purple-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Discover
              </Link>
              <Link 
                href="/dhey-production" 
                className="text-gray-700 hover:text-gray-900 font-medium px-2 py-1 transition-all duration-300 hover:translate-x-2 hover:text-purple-600"
                onClick={() => setIsMenuOpen(false)}
              >
                DHEY Production
              </Link>
              <Link 
                href="/create" 
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-medium text-center transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 transform"
                onClick={() => setIsMenuOpen(false)}
              >
                Create Story
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
