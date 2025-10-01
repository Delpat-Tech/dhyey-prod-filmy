'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { Settings, Edit, Share, MoreHorizontal, MapPin, Calendar, Link as LinkIcon } from 'lucide-react'

// Mock user data - replace with API calls later
const userData = {
  name: "Sarah Johnson",
  username: "sarahjwrites",
  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  bio: "Storyteller | Fiction Writer | Coffee Enthusiast ☕\nLove crafting tales that touch hearts and minds ✨",
  location: "New York, NY",
  joinDate: "March 2023",
  website: "sarahjohnson.com",
  stats: {
    stories: 24,
    followers: 1247,
    following: 389,
    likes: 5632
  },
  isOwnProfile: true // This would be determined by auth
}

export default function ProfileHeader() {
  const [isFollowing, setIsFollowing] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const shareMenuRef = useRef<HTMLDivElement>(null)
  const moreMenuRef = useRef<HTMLDivElement>(null)

  // Close menus when clicking outside
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  const handleShare = () => {
    setShowShareMenu(!showShareMenu)
    setShowMoreMenu(false)
  }

  const handleMore = () => {
    setShowMoreMenu(!showMoreMenu)
    setShowShareMenu(false)
  }

  const shareProfile = async (platform: string) => {
    const url = `${window.location.origin}/profile/${userData.username}`
    const title = `Check out ${userData.name}'s profile on Dhyey`
    
    try {
      switch (platform) {
        case 'copy':
          await navigator.clipboard.writeText(url)
          alert('Profile link copied to clipboard!')
          break
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank')
          break
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
          break
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
          break
      }
    } catch (error) {
      console.error('Share failed:', error)
    }
    setShowShareMenu(false)
  }

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 py-6">
        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Profile Info */}
          <div className="flex items-start space-x-4 mb-4">
            <Image
              src={userData.avatar}
              alt={userData.name}
              width={80}
              height={80}
              className="rounded-full"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900 truncate">
                {userData.name}
              </h1>
              <p className="text-gray-600 mb-2">@{userData.username}</p>
              
              {/* Action Buttons */}
              <div className="flex space-x-2">
                {userData.isOwnProfile ? (
                  <>
                    <Link 
                      href="/profile/edit"
                      className="flex-1 bg-gray-100 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
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
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleFollow}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
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
                      
                      {/* Share Menu */}
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
                      
                      {/* More Menu */}
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
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-around py-4 border-y border-gray-100 mb-4">
            <button className="text-center hover:bg-gray-50 px-2 py-1 rounded transition-colors">
              <div className="font-bold text-lg text-gray-900">{userData.stats.stories}</div>
              <div className="text-sm text-gray-600">Stories</div>
            </button>
            <Link href="/profile/followers" className="text-center hover:bg-gray-50 px-2 py-1 rounded transition-colors">
              <div className="font-bold text-lg text-gray-900">{userData.stats.followers.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Followers</div>
            </Link>
            <Link href="/profile/following" className="text-center hover:bg-gray-50 px-2 py-1 rounded transition-colors">
              <div className="font-bold text-lg text-gray-900">{userData.stats.following}</div>
              <div className="text-sm text-gray-600">Following</div>
            </Link>
            <button className="text-center hover:bg-gray-50 px-2 py-1 rounded transition-colors">
              <div className="font-bold text-lg text-gray-900">{userData.stats.likes.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Likes</div>
            </button>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <p className="text-gray-900 whitespace-pre-line">{userData.bio}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin size={14} />
                <span>{userData.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>Joined {userData.joinDate}</span>
              </div>
              <div className="flex items-center space-x-1">
                <LinkIcon size={14} />
                <a href={`https://${userData.website}`} className="text-purple-600 hover:underline">
                  {userData.website}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="flex items-start space-x-8">
            {/* Avatar */}
            <Image
              src={userData.avatar}
              alt={userData.name}
              width={150}
              height={150}
              className="rounded-full"
            />

            {/* Profile Info */}
            <div className="flex-1">
              {/* Name and Actions */}
              <div className="flex items-center space-x-4 mb-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {userData.name}
                </h1>
                
                {userData.isOwnProfile ? (
                  <div className="flex space-x-2">
                    <Link 
                      href="/profile/edit"
                      className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors inline-flex items-center"
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
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleFollow}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
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
                      
                      {/* Share Menu */}
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
                      
                      {/* More Menu */}
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
                )}
              </div>

              {/* Username */}
              <p className="text-gray-600 mb-4">@{userData.username}</p>

              {/* Stats */}
              <div className="flex space-x-8 mb-4">
                <button className="hover:bg-gray-50 px-2 py-1 rounded transition-colors">
                  <span className="font-bold text-gray-900">{userData.stats.stories}</span>
                  <span className="text-gray-600 ml-1">stories</span>
                </button>
                <Link href="/profile/followers" className="hover:bg-gray-50 px-2 py-1 rounded transition-colors">
                  <span className="font-bold text-gray-900">{userData.stats.followers.toLocaleString()}</span>
                  <span className="text-gray-600 ml-1">followers</span>
                </Link>
                <Link href="/profile/following" className="hover:bg-gray-50 px-2 py-1 rounded transition-colors">
                  <span className="font-bold text-gray-900">{userData.stats.following}</span>
                  <span className="text-gray-600 ml-1">following</span>
                </Link>
                <button className="hover:bg-gray-50 px-2 py-1 rounded transition-colors">
                  <span className="font-bold text-gray-900">{userData.stats.likes.toLocaleString()}</span>
                  <span className="text-gray-600 ml-1">likes</span>
                </button>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <p className="text-gray-900 whitespace-pre-line">{userData.bio}</p>
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin size={14} />
                    <span>{userData.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>Joined {userData.joinDate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <LinkIcon size={14} />
                    <a href={`https://${userData.website}`} className="text-purple-600 hover:underline">
                      {userData.website}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
