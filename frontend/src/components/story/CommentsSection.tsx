'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Heart, Reply, MoreHorizontal, Send } from 'lucide-react'

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

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment = {
      id: Date.now(),
      author: {
        name: "You",
        username: "currentuser",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"
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
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face"
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

  return (
    <div className="px-6 py-8 border-t border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Comments ({comments.length})
      </h3>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="flex space-x-3">
          <Image
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"
            alt="Your avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this story..."
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-full font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
                <span>Comment</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-4">
            {/* Main Comment */}
            <div className="flex space-x-3">
              <Image
                src={comment.author.avatar}
                alt={comment.author.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900">{comment.author.name}</h4>
                      <span className="text-sm text-gray-500">@{comment.author.username}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{comment.timeAgo}</span>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
                
                {/* Comment Actions */}
                <div className="flex items-center space-x-4 mt-2 ml-4">
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className={`flex items-center space-x-1 text-sm transition-colors ${
                      comment.isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                    }`}
                  >
                    <Heart size={14} className={comment.isLiked ? 'fill-red-600' : ''} />
                    <span>{comment.likes}</span>
                  </button>
                  
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    <Reply size={14} />
                    <span>Reply</span>
                  </button>
                </div>

                {/* Reply Form */}
                {replyingTo === comment.id && (
                  <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="mt-3 ml-4">
                    <div className="flex space-x-2">
                      <Image
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face"
                        alt="Your avatar"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Reply to ${comment.author.name}...`}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                          rows={2}
                        />
                        <div className="flex justify-end space-x-2 mt-2">
                          <button
                            type="button"
                            onClick={() => setReplyingTo(null)}
                            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={!replyText.trim()}
                            className="px-3 py-1 bg-purple-500 text-white text-sm rounded-full hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}

                {/* Replies */}
                {comment.replies.length > 0 && (
                  <div className="mt-4 ml-4 space-y-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex space-x-2">
                        <Image
                          src={reply.author.avatar}
                          alt={reply.author.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-1">
                              <h5 className="font-medium text-gray-900 text-sm">{reply.author.name}</h5>
                              <span className="text-xs text-gray-500">@{reply.author.username}</span>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-500">{reply.timeAgo}</span>
                            </div>
                            <p className="text-gray-700 text-sm">{reply.content}</p>
                          </div>
                          <div className="flex items-center space-x-3 mt-1 ml-3">
                            <button className="flex items-center space-x-1 text-xs text-gray-600 hover:text-red-600 transition-colors">
                              <Heart size={12} />
                              <span>{reply.likes}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Comments */}
      <div className="text-center mt-8">
        <button className="text-purple-600 hover:text-purple-700 font-medium">
          Load more comments
        </button>
      </div>
    </div>
  )
}
