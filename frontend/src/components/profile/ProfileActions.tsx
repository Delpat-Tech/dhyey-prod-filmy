'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { Settings, Edit, Share, MoreHorizontal } from 'lucide-react'

interface ProfileActionsProps {
  isOwnProfile: boolean
  isFollowing: boolean
  onFollow: () => void
  onShare: (platform: string) => void
  userData: {
    username: string
    name: string
  }
}

export default function ProfileActions({ 
  isOwnProfile, 
  isFollowing, 
  onFollow, 
  onShare, 
  userData 
}: ProfileActionsProps) {
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const shareMenuRef = useRef<HTMLDivElement>(null)
  const moreMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false)
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleShare = () => {
    setShowShareMenu(!showShareMenu)
    setShowMoreMenu(false)
  }

  const handleMore = () => {
    setShowMoreMenu(!showMoreMenu)
    setShowShareMenu(false)
  }

  const shareProfile = (platform: string) => {
    onShare(platform)
    setShowShareMenu(false)
  }

  if (isOwnProfile) {
    return (
      <div className="flex space-x-2">
        <Link 
          href="/profile/edit"
          className="flex-1 md:flex-none bg-gray-100 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors inline-flex items-center justify-center"
        >
          <Edit size={16} className="inline mr-2" />
          Edit Profile
        </Link>
        <Link 
          href="/settings"
          className="px-3 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center justify-center"
        >
          <Settings size={16} />
        </Link>
      </div>
    )
  }

  return (
    <div className="flex space-x-2">
      <button
        onClick={onFollow}
        className={`flex-1 md:flex-none px-4 py-2 rounded-lg font-medium transition-colors ${
          isFollowing
            ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            : 'bg-purple-500 text-white hover:bg-purple-600'
        }`}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </button>
      
      <div className="relative" ref={shareMenuRef}>
        <button 
          onClick={handleShare}
          className="px-3 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Share size={16} />
        </button>
        
        {showShareMenu && (
          <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-50 min-w-[180px]">
            <button
              onClick={() => shareProfile('copy')}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              📋 Copy Profile Link
            </button>
            <button
              onClick={() => shareProfile('twitter')}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              🐦 Share on Twitter
            </button>
            <button
              onClick={() => shareProfile('facebook')}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              📘 Share on Facebook
            </button>
            <button
              onClick={() => shareProfile('linkedin')}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              💼 Share on LinkedIn
            </button>
          </div>
        )}
      </div>
      
      <div className="relative" ref={moreMenuRef}>
        <button 
          onClick={handleMore}
          className="px-3 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <MoreHorizontal size={16} />
        </button>
        
        {showMoreMenu && (
          <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-50 min-w-[160px]">
            <button
              onClick={() => {
                console.log('Send message')
                setShowMoreMenu(false)
              }}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              💬 Send Message
            </button>
            <button
              onClick={() => {
                console.log('Report user')
                setShowMoreMenu(false)
              }}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              🚨 Report User
            </button>
            <hr className="my-1 border-gray-100" />
            <button
              onClick={() => {
                console.log('Block user')
                setShowMoreMenu(false)
              }}
              className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
            >
              🚫 Block User
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
