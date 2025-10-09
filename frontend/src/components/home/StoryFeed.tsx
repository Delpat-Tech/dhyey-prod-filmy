'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, Bookmark, Share2, MessageCircle, MoreHorizontal } from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { storyAPI } from '@/lib/api'
import { getImageUrl, getAvatarUrl } from '@/lib/imageUtils'
import { toast } from '@/lib/toast'

// Mock data - fallback for when API is not available
const mockStories = [
  {
    id: 1,
    title: "The Midnight Train",
    author: {
      name: "Emma Wilson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      username: "emmawrites"
    },
    content: "The old train station stood empty, its platforms echoing with memories of countless journeys. Sarah clutched her suitcase tighter as the midnight train approached, its headlight cutting through the darkness like a beacon of hope...",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&h=300&fit=crop",
    genre: "Fiction",
    likes: 234,
    saves: 45,
    comments: 12,
    timeAgo: "2h",
    hashtags: ["#fiction", "#mystery", "#train"]
  },
  {
    id: 2,
    title: "Code of the Heart",
    author: {
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      username: "davidcodes"
    },
    content: "In the world of algorithms and data structures, love was the one equation I couldn't solve. Every line of code I wrote seemed to spell out her name, every function returned memories of us...",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&h=300&fit=crop",
    genre: "Romance",
    likes: 189,
    saves: 67,
    comments: 23,
    timeAgo: "4h",
    hashtags: ["#romance", "#tech", "#love"]
  },
  {
    id: 3,
    title: "Whispers of the Forest",
    author: {
      name: "Luna Martinez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      username: "lunapoetry"
    },
    content: "Beneath the canopy of ancient oaks,\nWhere sunlight dances and shadow cloaks,\nThe forest speaks in whispered tones,\nOf secrets kept in earth and stones...",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=300&fit=crop",
    genre: "Poetry",
    likes: 156,
    saves: 89,
    comments: 8,
    timeAgo: "6h",
    hashtags: ["#poetry", "#nature", "#forest"]
  },
]

interface StoryFeedProps {
  genreFilter?: string | null
}

export default function StoryFeed({ genreFilter }: StoryFeedProps) {
  const [likedStories, setLikedStories] = useState<Set<string>>(new Set())
  const [savedStories, setSavedStories] = useState<Set<string>>(new Set())
  const [hiddenStories, setHiddenStories] = useState<Set<string>>(new Set())
  const [blockedAuthors, setBlockedAuthors] = useState<Set<string>>(new Set())
  const [reportedStories, setReportedStories] = useState<Set<string>>(new Set())
  const [showShareMenu, setShowShareMenu] = useState<string | null>(null)
  const [showMoreMenu, setShowMoreMenu] = useState<string | null>(null)
  const [displayedStories, setDisplayedStories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [likingStories, setLikingStories] = useState<Set<string>>(new Set())
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const shareMenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const moreMenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Load stories from API with genre filter
  useEffect(() => {
    const loadStories = async () => {
      try {
        setIsInitialLoading(true)
        const params = new URLSearchParams()
        params.append('status', 'approved')
        
        if (genreFilter) {
          params.append('genre', genreFilter)
        }
        
        const response = await storyAPI.getPublicStories(params)
        const stories = response.data.stories || mockStories
        console.log('First story isLiked:', stories[0]?.isLiked, 'isSaved:', stories[0]?.isSaved)
        console.log('First story full data:', stories[0])
        
        // Initialize liked/saved state from backend data
        const newLiked = new Set<string>()
        const newSaved = new Set<string>()
        stories.forEach((story: any) => {
          const storyId = story._id || story.id
          if (story.isLiked) {
            newLiked.add(storyId)
          }
          if (story.isSaved) {
            newSaved.add(storyId)
          }
        })
        setLikedStories(newLiked)
        setSavedStories(newSaved)
        console.log('Initialized liked stories:', Array.from(newLiked))
        console.log('Initialized saved stories:', Array.from(newSaved))
        setDisplayedStories(stories)
      } catch (error) {
        console.error('Failed to load stories:', error)
        const filtered = genreFilter 
          ? mockStories.filter(story => story.genre === genreFilter)
          : mockStories
        setDisplayedStories(filtered)
      } finally {
        setIsInitialLoading(false)
      }
    }

    loadStories()
  }, [genreFilter])

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check share menus
      if (showShareMenu !== null) {
        const shareRef = shareMenuRefs.current[showShareMenu]
        if (shareRef && !shareRef.contains(event.target as Node)) {
          setShowShareMenu(null)
        }
      }
      
      // Check more menus
      if (showMoreMenu !== null) {
        const moreRef = moreMenuRefs.current[showMoreMenu]
        if (moreRef && !moreRef.contains(event.target as Node)) {
          setShowMoreMenu(null)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showShareMenu, showMoreMenu])

  const toggleLike = useCallback(async (storyId: string) => {
    const actualStoryId = storyId.startsWith('story-') ? storyId : storyId
    
    if (likingStories.has(actualStoryId)) return
    
    try {
      setLikingStories(prev => new Set(prev).add(actualStoryId))
      
      const response = await storyAPI.likeStory(actualStoryId)
      const isLiked = response.data.isLiked
      const likesCount = response.data.likesCount
      
      setLikedStories(prev => {
        const newSet = new Set(prev)
        if (isLiked) {
          newSet.add(actualStoryId)
        } else {
          newSet.delete(actualStoryId)
        }
        return newSet
      })
      
      setDisplayedStories(prev => prev.map(story => {
        const currentStoryId = story._id || story.id
        if (currentStoryId === actualStoryId) {
          return {
            ...story,
            likes: likesCount,
            isLiked: isLiked,
            stats: {
              ...story.stats,
              likes: likesCount
            }
          }
        }
        return story
      }))
    } catch (error) {
      console.error('Failed to like story:', error)
      toast.error('Failed to like story. Please try again.')
    } finally {
      setLikingStories(prev => {
        const newSet = new Set(prev)
        newSet.delete(actualStoryId)
        return newSet
      })
    }
  }, [likingStories])

  const toggleSave = async (storyId: string) => {
    if (isLoading) return // Prevent multiple calls
    
    try {
      setIsLoading(true)
      // Use the correct ID format (_id for backend)
      const actualStoryId = storyId.startsWith('story-') ? storyId : storyId
      console.log('Toggling save for story:', actualStoryId)
      const response = await storyAPI.saveStory(actualStoryId)
      const isSaved = response.data.isSaved
      const savesCount = response.data.savesCount
      console.log('Save response:', { isSaved, savesCount })
      console.log('Story ID being processed:', actualStoryId)
      
      setSavedStories(prev => {
        const newSet = new Set(prev)
        if (isSaved) {
          newSet.add(actualStoryId)
        } else {
          newSet.delete(actualStoryId)
        }
        console.log('Updated saved stories set:', Array.from(newSet))
        return newSet
      })
      
      // Show toast after state update
      if (isSaved) {
        toast.success('Story saved successfully!')
      } else {
        toast.success('Story removed from saved!')
      }
      
      setDisplayedStories(prev => prev.map(story => {
        const currentStoryId = story._id || story.id
        if (currentStoryId === actualStoryId) {
          return {
            ...story,
            saves: savesCount,
            isSaved: isSaved,
            stats: {
              ...story.stats,
              saves: savesCount
            }
          }
        }
        return story
      }))
    } catch (error) {
      console.error('Failed to save story:', error)
      toast.error('Failed to save story. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = (storyId: string) => {
    console.log('Share button clicked for story:', storyId) // Debug log
    setShowShareMenu(showShareMenu === storyId ? null : storyId)
    setShowMoreMenu(null) // Close other menu
  }

  const handleMore = (storyId: string) => {
    setShowMoreMenu(showMoreMenu === storyId ? null : storyId)
    setShowShareMenu(null) // Close other menu
  }

  const handleReportStory = async (storyId: string) => {
    try {
      setReportedStories(prev => new Set(prev).add(storyId))
      setShowMoreMenu(null)
      toast.success('Story reported. Thank you for your feedback!')
    } catch (error) {
      console.error('Failed to report story:', error)
      toast.error('Failed to report story. Please try again.')
    }
  }

  const handleNotInterested = async (storyId: string) => {
    try {
      setHiddenStories(prev => new Set(prev).add(storyId))
      setShowMoreMenu(null)
      toast.success('Story marked as not interested')

      // Remove from displayed stories
      setDisplayedStories(prev => prev.filter(story => (story._id || story.id) !== storyId))
    } catch (error) {
      console.error('Failed to mark as not interested:', error)
      toast.error('Failed to update preferences. Please try again.')
    }
  }

  const handleBlockAuthor = async (authorId: string) => {
    try {
      setBlockedAuthors(prev => new Set(prev).add(authorId))
      setShowMoreMenu(null)
      toast.success('Author blocked successfully')

      // Remove all stories by this author
      setDisplayedStories(prev => prev.filter(story => story.author.id !== authorId))
    } catch (error) {
      console.error('Failed to block author:', error)
      toast.error('Failed to block author. Please try again.')
    }
  }

  const shareStory = async (platform: string, story: any) => {
    const url = `${window.location.origin}/story/${story.id}`
    const title = `Check out "${story.title}" by ${story.author.name}`
    
    try {
      // Track the share on backend
      await storyAPI.shareStory(story.id, { platform })
      
      switch (platform) {
        case 'copy':
          await navigator.clipboard.writeText(url)
          toast.success('Link copied to clipboard!')
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
      toast.error('Failed to share story. Please try again.')
    }
    setShowShareMenu(null)
  }

  const loadMoreStories = async () => {
    setIsLoading(true)
    try {
      // In a real app, you'd pass pagination parameters
      // Only load approved stories
      const params = new URLSearchParams()
      params.append('status', 'approved')
      
      const response = await storyAPI.getPublicStories(params)
      const newStories = response.data.stories || mockStories.map((story: any, index: number) => ({
        ...story,
        id: story.id + displayedStories.length + index,
        timeAgo: Math.floor(Math.random() * 12) + 1 + 'h'
      }))
      
      setDisplayedStories(prev => [...prev, ...newStories])
    } catch (error) {
      console.error('Failed to load more stories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isInitialLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {displayedStories.map((story: any, index: number) => (
        <div 
          key={story.id} 
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden story-card transform transition-all duration-500 hover:shadow-lg hover:-translate-y-1"
          style={{ 
            animationDelay: `${index * 100}ms`,
            animation: 'fadeInUp 0.6s ease-out forwards'
          }}
        >
          {/* Story Header - Title and Tags */}
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Link href={`/story/${story.id}`}>
                  <h3 className="font-bold text-lg text-gray-900 hover:text-purple-600 transition-colors duration-300 font-display">
                    {story.title}
                  </h3>
                </Link>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-medium">
                  {story.genre}
                </span>
                <div className="flex space-x-1">
                  {story.hashtags?.map((tag: string, index: number) => (
                    <span key={index} className="text-purple-600 text-sm hover:underline cursor-pointer transition-all duration-200 hover:text-purple-800 hover:scale-105">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* More Menu - Top Right */}
                <div className="relative" ref={el => { moreMenuRefs.current[story.id] = el }}>
                  <button
                    onClick={() => handleMore(story.id)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
                  >
                    <MoreHorizontal size={16} className="text-gray-500" />
                  </button>

                  {/* More Menu */}
                  {showMoreMenu === story.id && (
                    <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-50 min-w-[160px]">
                      <button
                        onClick={() => {
                          console.log('Save story:', story.title)
                          toggleSave(story._id || story.id)
                          setShowMoreMenu(null)
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        {savedStories.has(story._id || story.id) ? 'Unsave Story' : 'Save Story'}
                      </button>
                      <button
                        onClick={() => {
                          console.log('Report story:', story.title)
                          handleReportStory(story._id || story.id)
                        }}
                        className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                          reportedStories.has(story._id || story.id)
                            ? 'text-green-600 bg-green-50'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {reportedStories.has(story._id || story.id) ? '✓ Reported' : 'Report Story'}
                      </button>
                      <button
                        onClick={() => {
                          console.log('Hide story:', story.title)
                          handleNotInterested(story._id || story.id)
                        }}
                        className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                          hiddenStories.has(story._id || story.id)
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {hiddenStories.has(story._id || story.id) ? '✓ Hidden' : 'Hide Story'}
                      </button>
                      <button
                        onClick={() => {
                          console.log('Not interested in:', story.title)
                          handleNotInterested(story._id || story.id)
                        }}
                        className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                          hiddenStories.has(story._id || story.id)
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {hiddenStories.has(story._id || story.id) ? '✓ Not Interested' : 'Not Interested'}
                      </button>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={() => {
                          console.log('Block author:', story.author.name)
                          handleBlockAuthor(story.author.id)
                        }}
                        className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                          blockedAuthors.has(story.author.id)
                            ? 'text-red-600 bg-red-50'
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        {blockedAuthors.has(story.author.id) ? '✓ Author Blocked' : 'Block Author'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Story Content */}
          <div className="px-4 pb-3">
            <Link href={`/story/${story.id}`}>
              <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3 font-body">
                {story.content}
              </p>
            </Link>
          </div>

          {/* Story Image */}
          {story.image && (
            <Link href={`/story/${story.id}`} className="block overflow-hidden">
              <div className="relative h-64 md:h-80 group">
                <Image
                  src={getImageUrl(story.image)}
                  alt={story.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"

                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </div>
            </Link>
          )}

          {/* Story Footer - Author Info and Actions */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              {/* Author Info - Bottom Left */}
              <Link href={`/profile/${story.author.username}`} className="flex items-center space-x-3 group">
                <div className="relative">
                  <Image
                    src={getAvatarUrl(story.author.avatar)}
                    alt={story.author.name}
                    width={40}
                    height={40}
                    className="rounded-full transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{story.author.name}</h4>
                  <p className="text-sm text-gray-500">@{story.author.username} • {story.timeAgo}</p>
                </div>
              </Link>

              {/* Actions - Bottom Right */}
              <div className="flex items-center space-x-6">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleLike(story._id || story.id)
                  }}
                  disabled={likingStories.has(story._id || story.id)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50"
                >
                  <Heart
                    size={20}
                    className={`transition-all duration-300 ${likedStories.has(story._id || story.id) ? 'fill-red-500 text-red-500 animate-pulse' : 'hover:scale-110'}`}
                  />
                  <span className="text-sm font-medium">
                    {story.stats?.likes || story.likes || 0}
                  </span>
                </button>

                <Link
                  href={`/story/${story._id || story.id}#comments`}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-all duration-300 hover:scale-110 active:scale-95"
                >
                  <MessageCircle size={20} className="transition-transform duration-300 hover:scale-110" />
                  <span className="text-sm font-medium">{story.stats?.comments || story.comments || 0}</span>
                </Link>

                <button
                  onClick={() => toggleSave(story._id || story.id)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-purple-500 transition-all duration-300 hover:scale-110 active:scale-95"
                >
                  <Bookmark
                    size={20}
                    className={`transition-all duration-300 ${savedStories.has(story._id || story.id) ? 'fill-purple-500 text-purple-500 animate-bounce' : 'hover:scale-110'}`}
                  />
                </button>

                <div className="relative" ref={el => { shareMenuRefs.current[story.id] = el }}>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log('Share button clicked - event triggered')
                      handleShare(story._id || story.id)
                    }}
                    className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
                  >
                    <Share2 size={20} className="transition-transform duration-300 hover:scale-110" />
                    <span className="text-sm font-medium">Share</span>
                  </button>

                  {/* Share Menu */}
                  {showShareMenu === (story._id || story.id) && (
                    <div
                      className="fixed bg-white border border-gray-200 rounded-lg shadow-2xl py-1 min-w-[180px]"
                      style={{
                        zIndex: 9999,
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <div className="text-xs text-gray-500 px-4 py-2 border-b border-gray-100">
                        Share "{story.title}"
                      </div>
                      <button
                        onClick={() => {
                          console.log('Copy link clicked')
                          shareStory('copy', story)
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        📋 Copy Link
                      </button>
                      <button
                        onClick={() => {
                          console.log('Twitter share clicked')
                          shareStory('twitter', story)
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        🐦 Share on Twitter
                      </button>
                      <button
                        onClick={() => {
                          console.log('Facebook share clicked')
                          shareStory('facebook', story)
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        📘 Share on Facebook
                      </button>
                      <button
                        onClick={() => {
                          console.log('LinkedIn share clicked')
                          shareStory('linkedin', story)
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        💼 Share on LinkedIn
                      </button>
                      <button
                        onClick={() => setShowShareMenu(null)}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  )}

                  {/* Backdrop */}
                  {showShareMenu === (story._id || story.id) && (
                    <div
                      className="fixed inset-0 bg-black bg-opacity-50"
                      style={{ zIndex: 9998 }}
                      onClick={() => setShowShareMenu(null)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Load More Button */}
      <div className="text-center py-8">
        <button 
          onClick={loadMoreStories}
          disabled={isLoading}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-10 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Loading...' : 'Load More Stories'}
        </button>
      </div>
    </div>
  )
}
