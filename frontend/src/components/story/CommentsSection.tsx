'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Heart, Send } from 'lucide-react'

interface CommentsSectionProps {
  storyId: number
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

export default function CommentsSection({ storyId }: CommentsSectionProps) {
  const [comments, setComments] = useState(mockComments)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')
  const [showAllComments, setShowAllComments] = useState(false)
  const [likedReplies, setLikedReplies] = useState<Set<number>>(new Set())

  const handleLikeComment = (commentId: number) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          }
        : comment
    ))
  }

  const handleLikeReply = (replyId: number) => {
    const newLikedReplies = new Set(likedReplies)
    if (likedReplies.has(replyId)) {
      newLikedReplies.delete(replyId)
    } else {
      newLikedReplies.add(replyId)
    }
    setLikedReplies(newLikedReplies)

    setComments(prev => prev.map(comment => ({
      ...comment,
      replies: comment.replies.map(reply => 
        reply.id === replyId 
          ? { 
              ...reply, 
              isLiked: !reply.isLiked,
              likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1
            }
          : reply
      )
    })))
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submit comment:', newComment) // Debug log
    if (!newComment.trim()) return

    const comment = {
      id: Date.now(),
      author: {
        name: "You",
        username: "currentuser",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face"
      },
      content: newComment,
      likes: 0,
      timeAgo: "now",
      isLiked: false,
      replies: []
    }

    setComments(prev => [comment, ...prev])
    setNewComment('')
  }

  const handleSubmitReply = (e: React.FormEvent, commentId: number) => {
    e.preventDefault()
    if (!replyText.trim()) return

    const reply = {
      id: Date.now(),
      author: {
        name: "You",
        username: "currentuser",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=24&h=24&fit=crop&crop=face"
      },
      content: replyText,
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
  }

  const visibleComments = showAllComments ? comments : comments.slice(0, 3)

  return (
    <div className="bg-white">
      {/* Like count and time - Instagram style */}
      <div className="px-4 py-2 border-b border-gray-100">
        <div className="font-semibold text-sm text-black mb-1">
          370 likes
        </div>
        <div className="text-xs text-gray-500">
          2 hours ago
        </div>
      </div>

      {/* Comments List - Instagram Style */}
      <div className="px-4 py-3">
        {visibleComments.map((comment) => (
          <div key={comment.id} className="mb-4">
            {/* Main Comment */}
            <div className="flex items-start space-x-3">
              <Image
                src={comment.author.avatar}
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
                  {comment.likes > 0 && (
                    <span className="text-xs text-gray-500 font-medium">
                      {comment.likes} {comment.likes === 1 ? 'like' : 'likes'}
                    </span>
                  )}
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="text-xs text-gray-500 font-medium hover:text-gray-700"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className="p-1"
                  >
                    <Heart 
                      size={12} 
                      className={`${comment.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-gray-600'} transition-colors`} 
                    />
                  </button>
                </div>

                {/* Replies */}
                {comment.replies.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start space-x-3 ml-6">
                        <Image
                          src={reply.author.avatar}
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
                            {reply.likes > 0 && (
                              <span className="text-xs text-gray-500 font-medium">
                                {reply.likes} {reply.likes === 1 ? 'like' : 'likes'}
                              </span>
                            )}
                            <button
                              onClick={() => handleLikeReply(reply.id)}
                              className="p-1"
                            >
                              <Heart 
                                size={10} 
                                className={`${reply.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-gray-600'} transition-colors`} 
                              />
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
