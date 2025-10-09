'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Heart, Send } from 'lucide-react'
import { storyAPI } from '@/lib/api'
import { getAvatarUrl } from '@/lib/imageUtils'

interface CommentsSectionProps {
  storyId: number
  storyStatus?: string
}

// Mock comments data
const mockComments = [
  {
    id: 1,
    author: {
      name: "Alex Chen",
      username: "alexreads",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
    },
    content: "This story gave me chills! The way you described the train station brought back so many memories of my own travels. Beautiful writing! ✨",
    likes: 12,
    timeAgo: "2h",
    isLiked: false,
    replies: [
      {
        id: 11,
        author: {
          name: "Emma Wilson",
          username: "emmawrites",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face"
        },
        content: "Thank you so much! That means the world to me. I'm glad it resonated with you! 💜",
        likes: 3,
        timeAgo: "1h",
        isLiked: false
      }
    ]
  },
  {
    id: 2,
    author: {
      name: "Maya Patel",
      username: "mayareads",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
    },
    content: "The imagery in this piece is absolutely stunning. I could visualize every scene perfectly. Can't wait to read more of your work!",
    likes: 8,
    timeAgo: "4h",
    isLiked: true,
    replies: []
  },
  {
    id: 3,
    author: {
      name: "David Kim",
      username: "davidwrites",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    },
    content: "This reminds me of my own journey to the city years ago. The emotions you captured are so real and relatable. Excellent storytelling!",
    likes: 15,
    timeAgo: "6h",
    isLiked: false,
    replies: []
  }
]

export default function CommentsSection({ storyId, storyStatus }: CommentsSectionProps) {
  // Check if story is under review
  const isUnderReview = storyStatus && !['approved'].includes(storyStatus)
  
  // Don't render comments section for stories under review
  if (isUnderReview) {
    return null
  }
  const [comments, setComments] = useState(mockComments)
  const [isLoading, setIsLoading] = useState(false)

  // Load comments from API
  useEffect(() => {
    const loadComments = async () => {
      try {
        setIsLoading(true)
        const response = await storyAPI.getStoryComments(storyId.toString())
        setComments(response.data.comments || [])
      } catch (error) {
        console.error('Failed to load comments:', error)
        // Keep mock comments as fallback
      } finally {
        setIsLoading(false)
      }
    }

    loadComments()
  }, [storyId])
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')
  const [showAllComments, setShowAllComments] = useState(false)


  const handleLikeComment = async (commentId: number) => {
    try {
      const response = await storyAPI.likeComment(storyId.toString(), commentId.toString())
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { 
              ...comment, 
              isLiked: response.data.isLiked,
              likes: response.data.likesCount
            }
          : comment
      ))
    } catch (error) {
      console.error('Failed to like comment:', error)
    }
  }

  const handleLikeReply = async (replyId: number) => {
    try {
      const response = await storyAPI.likeComment(storyId.toString(), replyId.toString())
      
      setComments(prev => prev.map(comment => ({
        ...comment,
        replies: comment.replies.map(reply => 
          reply.id === replyId 
            ? { 
                ...reply, 
                isLiked: response.data.isLiked,
                likes: response.data.likesCount
              }
            : reply
        )
      })))
    } catch (error) {
      console.error('Failed to like reply:', error)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      const response = await storyAPI.addComment(storyId.toString(), newComment)
      const comment = {
        id: response.data.comment._id,
        author: response.data.comment.author,
        content: response.data.comment.content,
        likes: 0,
        timeAgo: "now",
        isLiked: false,
        replies: []
      }

      setComments(prev => [comment, ...prev])
      setNewComment('')
      
      // Trigger a refresh of the story data to update comment count
      window.dispatchEvent(new CustomEvent('storyUpdated', { detail: { storyId } }))
    } catch (error) {
      console.error('Failed to add comment:', error)
    }
  }

  const handleSubmitReply = async (e: React.FormEvent, commentId: number) => {
    e.preventDefault()
    if (!replyText.trim()) return

    try {
      const response = await storyAPI.addComment(storyId.toString(), replyText, commentId.toString())
      const reply = {
        id: response.data.comment._id,
        author: response.data.comment.author,
        content: response.data.comment.content,
        likes: 0,
        timeAgo: "now",
        isLiked: false
      }

      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, replies: [...comment.replies, reply] }
          : comment
      ))
      
      setReplyText('')
      setReplyingTo(null)
      
      // Trigger a refresh of the story data to update comment count
      window.dispatchEvent(new CustomEvent('storyUpdated', { detail: { storyId } }))
    } catch (error) {
      console.error('Failed to add reply:', error)
    }
  }

  const visibleComments = showAllComments ? comments : comments.slice(0, 3)

  if (isLoading) {
    return (
      <div className="bg-white px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div id="comments-section" className="bg-white">


      {/* Comments List - Instagram Style */}
      <div className="px-4 py-3">
        {visibleComments.map((comment) => (
          <div key={comment.id} className="mb-4">
            {/* Main Comment */}
            <div className="flex items-start space-x-3">
              <Image
                src={getAvatarUrl(comment.author.avatar)}
                alt={comment.author.name}
                width={32}
                height={32}
                className="rounded-full flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline flex-wrap">
                  <span className="font-semibold text-black text-sm mr-2">
                    {comment.author.username}
                  </span>
                  <span className="text-black text-sm break-words">
                    {comment.content}
                  </span>
                </div>
                
                {/* Comment metadata */}
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-xs text-gray-500">{comment.timeAgo}</span>
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="text-xs text-gray-500 font-medium hover:text-gray-700"
                  >
                    Reply
                  </button>
                </div>

                {/* Replies */}
                {comment.replies.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start space-x-3 ml-6">
                        <Image
                          src={getAvatarUrl(reply.author.avatar)}
                          alt={reply.author.name}
                          width={24}
                          height={24}
                          className="rounded-full flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline flex-wrap">
                            <span className="font-semibold text-black text-sm mr-2">
                              {reply.author.username}
                            </span>
                            <span className="text-black text-sm break-words">
                              {reply.content}
                            </span>
                          </div>
                          
                          {/* Reply metadata */}
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500">{reply.timeAgo}</span>
                            <button
                              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                              className="text-xs text-gray-500 font-medium hover:text-gray-700"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                {replyingTo === comment.id && (
                  <div className="mt-3 ml-6">
                    <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="flex items-center space-x-3">
                      <Image
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=24&h=24&fit=crop&crop=face"
                        alt="Your avatar"
                        width={24}
                        height={24}
                        className="rounded-full flex-shrink-0"
                      />
                      <div className="flex-1 flex items-center">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Reply to ${comment.author.username}...`}
                          className="flex-1 text-sm border-none outline-none bg-transparent placeholder-gray-500"
                          autoFocus
                        />
                        {replyText.trim() && (
                          <button
                            type="submit"
                            className="text-blue-500 hover:text-blue-600 font-semibold text-sm ml-2"
                          >
                            Post
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View More Comments */}
      {!showAllComments && comments.length > 3 && (
        <div className="px-4 pb-3">
          <button
            onClick={() => setShowAllComments(true)}
            className="text-gray-500 text-sm hover:text-gray-700"
          >
            View all {comments.length} comments
          </button>
        </div>
      )}

      {/* Add Comment Form - Instagram Style */}
      <div className="border-t border-gray-200 px-4 py-3">
        <form onSubmit={handleSubmitComment} className="flex items-center space-x-3">
          <Image
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face"
            alt="Your avatar"
            width={32}
            height={32}
            className="rounded-full flex-shrink-0"
          />
          <div className="flex-1 flex items-center">
            <input
              type="text"
              value={newComment}
              onChange={(e) => {
                const value = e.target.value;
                setNewComment(value)
              }}
              placeholder="Add a comment..."
              className="flex-1 text-sm py-2 px-0 border-none outline-none bg-transparent text-black placeholder-gray-400"
              autoComplete="off"
            />
            
            {newComment.trim().length > 0 && (
              <button
                type="submit"
                className="text-blue-500 hover:text-blue-600 font-semibold text-sm ml-2"
                onClick={(e) => {
                  handleSubmitComment(e)
                }}
              >
                Post
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
