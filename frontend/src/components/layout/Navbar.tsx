'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, Plus, User, Menu, X } from 'lucide-react'
import NotificationCenter from '@/components/notifications/NotificationCenter'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-r border-gray-200 h-full w-full flex flex-col py-4">
      <div className="px-4 mb-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
            <span className="text-white font-bold text-sm">FC</span>
          </div>
          <span className="text-lg font-bold text-gray-900 transition-colors duration-300 group-hover:text-purple-600 font-display">Filmy Creatives</span>
        </Link>
      </div>

      {/* Desktop Navigation - Vertical */}
      <div className="flex flex-col space-y-2 px-4">
        <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium transition-all duration-300 hover:translate-x-2 hover:text-purple-600 flex items-center space-x-3 py-3 px-3 rounded-lg hover:bg-gray-50">
          <span>Home</span>
        </Link>
        <Link href="/search" className="text-gray-700 hover:text-gray-900 font-medium transition-all duration-300 hover:translate-x-2 hover:text-purple-600 flex items-center space-x-3 py-3 px-3 rounded-lg hover:bg-gray-50">
          <span>Discover</span>
        </Link>
        <Link href="/dhey-production" className="text-gray-700 hover:text-gray-900 font-medium transition-all duration-300 hover:translate-x-2 hover:text-purple-600 flex items-center space-x-3 py-3 px-3 rounded-lg hover:bg-gray-50">
          <span>DHEY Production</span>
        </Link>
      </div>

      {/* Desktop Actions */}
      <div className="flex flex-col space-y-2 px-4 mt-auto">
        <div className="flex space-x-12">
          <Link 
            href="/search" 
            className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
          >
            <Search size={20} />
          </Link>
          <div className="flex items-center justify-center">
            <NotificationCenter />
          </div>
          <Link 
            href="/profile" 
            className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
          >
            <User size={20} />
          </Link>
        </div>
        <Link 
          href="/create" 
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105 hover:shadow-lg active:scale-95 transform"
        >
          <Plus size={16} />
          <span>Create</span>
        </Link>
      </div>

      {/* Mobile Menu Button - Hide on desktop sidebar */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-110 active:scale-95 self-end mr-4 mt-4"
      >
        <div className="transition-transform duration-300">
          {isMenuOpen ? <X size={24} className="rotate-90" /> : <Menu size={24} />}
        </div>
      </button>

      {/* Mobile Menu - Hide on desktop sidebar */}
      {isMenuOpen && (
        <div className="md:hidden py-4 border-t border-gray-200 animate-in slide-in-from-top duration-300 absolute top-full left-0 right-0 bg-white">
          <div className="flex flex-col space-y-4 px-4">
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
    </nav>
  )
}
