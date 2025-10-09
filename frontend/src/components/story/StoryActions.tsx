'use client'

import { useState, useEffect, useRef } from 'react'
import { Heart, Bookmark, Share2, MessageCircle, ThumbsUp, MoreHorizontal } from 'lucide-react'
import { storyAPI } from '@/lib/api'
import { toast } from '@/lib/toast'

interface StoryActionsProps {
  story: {
    id: number
    status?: string
    stats: {
      likes: number
      saves: number
      comments: number
    }
    isLiked: boolean
    isSaved: boolean
  }
}

export default function StoryActions({ story }: StoryActionsProps) {
  const [isLiked, setIsLiked] = useState(story.isLiked)
  const [isSaved, setIsSaved] = useState(story.isSaved)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const shareMenuRef = useRef<HTMLDivElement>(null)
  const moreMenuRef = useRef<HTMLDivElement>(null)

  // Check if story is under review
  const isUnderReview = story.status && !['approved'].includes(story.status)

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

  const handleLike = async () => {
    try {
      const response = await storyAPI.likeStory(story.id.toString())
      setIsLiked(response.data.isLiked)
      // Update the story stats in parent component if needed
      if (story.stats) {
        story.stats.likes = response.data.likesCount
      }
    } catch (error) {
      console.error('Failed to like story:', error)
      toast.error('Failed to like story. Please try again.')
    }
  }

  const handleSave = async () => {
    try {
      const response = await storyAPI.saveStory(story.id.toString())
      setIsSaved(response.data.isSaved)
      // Update the story stats in parent component if needed
      if (story.stats) {
        story.stats.saves = response.data.savesCount
      }
    } catch (error) {
      console.error('Failed to save story:', error)
      toast.error('Failed to save story. Please try again.')
    }
  }

  const handleShare = () => {
    setShowShareMenu(!showShareMenu)
    setShowMoreMenu(false) // Close other menu
  }

  const handleMore = () => {
    setShowMoreMenu(!showMoreMenu)
    setShowShareMenu(false) // Close other menu
  }

  const shareStory = async (platform: string) => {
    const url = window.location.href
    const title = "Check out this amazing story!"
    
    try {
      // Track the share on backend
      await storyAPI.shareStory(story.id.toString(), { platform })
      
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
    setShowShareMenu(false)
  }

  return (
    <div className="px-6 py-6 border-t border-gray-100">
      {isUnderReview ? (
        /* Under Review Message */
        <div className="text-center py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center justify-center mb-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse mr-2"></div>
              <h3 className="text-lg font-semibold text-yellow-800">Story Under Review</h3>
            </div>
            <p className="text-yellow-700 mb-4">
              This story is currently being reviewed by our moderation team. 
              Interactions will be available once the story is approved and published.
            </p>
            <div className="text-sm text-yellow-600">
              <p>• Likes, comments, and sharing are temporarily disabled</p>
              <p>• You can still read and save the story</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Action Buttons */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                  isLiked
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                <Heart 
                  size={20} 
                  className={isLiked ? 'fill-red-600' : ''} 
                />
                <span className="font-medium">
                  {story.stats.likes}
                </span>
              </button>

              {/* Comment Button */}
              <button className="flex items-center space-x-2 px-4 py-2 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all">
                <MessageCircle size={20} />
                <span className="font-medium">{story.stats.comments}</span>
              </button>

              {/* Share Button */}
              <div className="relative" ref={shareMenuRef}>
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all"
                >
                  <Share2 size={20} />
                  <span className="font-medium">Share</span>
                </button>

                {/* Share Menu */}
                {showShareMenu && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-50 min-w-[180px]">
                    <button
                      onClick={() => shareStory('copy')}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Copy Link
                    </button>
                    <button
                      onClick={() => shareStory('twitter')}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Share on Twitter
                    </button>
                    <button
                      onClick={() => shareStory('facebook')}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Share on Facebook
                    </button>
                    <button
                      onClick={() => shareStory('linkedin')}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Share on LinkedIn
                    </button>
                  </div>
                )}
              </div>

              {/* More Options Button */}
              <div className="relative" ref={moreMenuRef}>
                <button
                  onClick={handleMore}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all"
                >
                  <MoreHorizontal size={20} />
                </button>

                {/* More Menu */}
                {showMoreMenu && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-50 min-w-[160px]">
                    <button
                      onClick={() => {
                        console.log('Report story')
                        setShowMoreMenu(false)
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Report Story
                    </button>
                    <button
                      onClick={() => {
                        console.log('Hide story')
                        setShowMoreMenu(false)
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Hide Story
                    </button>
                    <button
                      onClick={() => {
                        console.log('Not interested')
                        setShowMoreMenu(false)
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Not Interested
                    </button>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={() => {
                        console.log('Block author')
                        setShowMoreMenu(false)
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                    >
                      Block Author
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                isSaved
                  ? 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <Bookmark 
                size={20} 
                className={isSaved ? 'fill-purple-600' : ''} 
              />
              <span className="font-medium">
                {isSaved ? 'Saved' : 'Save'}
              </span>
            </button>
          </div>

          {/* Engagement Stats */}
          <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              <span>{story.stats.likes} likes</span>
              <span>{story.stats.comments} comments</span>
              <span>{story.stats.saves} saves</span>
            </div>
            
            {/* Appreciation Button */}
            <button className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-colors">
              <ThumbsUp size={16} />
              <span>Show appreciation</span>
            </button>
          </div>

          {/* Call to Action */}
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
            <div className="text-center">
              <p className="text-sm text-gray-700 mb-3">
                Enjoyed this story? Support the author and discover more amazing content.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <button className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-purple-600 transition-colors">
                  Follow Author
                </button>
                <button className="border border-purple-500 text-purple-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-purple-500 hover:text-white transition-colors">
                  Read More Stories
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
