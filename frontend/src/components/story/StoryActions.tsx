'use client'

import { useState } from 'react'
import { Heart, Bookmark, MessageCircle, ThumbsUp } from 'lucide-react'
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
  const [isLoading, setIsLoading] = useState(false)

  // Check if story is under review
  const isUnderReview = story.status && !['approved'].includes(story.status)



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
    if (isLoading) return // Prevent double clicks
    
    try {
      setIsLoading(true)
      const response = await storyAPI.saveStory(story.id.toString())
      const newSavedState = response.data.isSaved
      setIsSaved(newSavedState)
      
      // Update the story stats in parent component if needed
      if (story.stats) {
        story.stats.saves = response.data.savesCount || (newSavedState ? story.stats.saves + 1 : story.stats.saves - 1)
      }
      
      // Show success message
      toast.success(newSavedState ? 'Story saved!' : 'Story removed from saved')
      
      // Trigger saved stories refresh
      window.dispatchEvent(new CustomEvent('savedStoriesUpdated'))
    } catch (error) {
      console.error('Failed to save story:', error)
      toast.error('Failed to save story. Please try again.')
    } finally {
      setIsLoading(false)
    }
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
              <button 
                onClick={() => {
                  const commentsSection = document.getElementById('comments-section')
                  commentsSection?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="flex items-center space-x-2 px-4 py-2 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
              >
                <MessageCircle size={20} />
                <span className="font-medium">{story.stats.comments}</span>
              </button>


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
            {/*
            <button className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-colors">
              <ThumbsUp size={16} />
              <span>Show appreciation</span>
            </button>
            */}
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
