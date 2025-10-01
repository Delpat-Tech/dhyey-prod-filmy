'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, Bookmark, Share2, MessageCircle, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'

// Mock data - replace with API calls later
const stories = [
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

export default function StoryFeed() {
  const [likedStories, setLikedStories] = useState<Set<number>>(new Set())
  const [savedStories, setSavedStories] = useState<Set<number>>(new Set())

  const toggleLike = (storyId: number) => {
    setLikedStories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(storyId)) {
        newSet.delete(storyId)
      } else {
        newSet.add(storyId)
      }
      return newSet
    })
  }

  const toggleSave = (storyId: number) => {
    setSavedStories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(storyId)) {
        newSet.delete(storyId)
      } else {
        newSet.add(storyId)
      }
      return newSet
    })
  }

  return (
    <div className="space-y-6">
      {stories.map((story, index) => (
        <div 
          key={story.id} 
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden story-card transform transition-all duration-500 hover:shadow-lg hover:-translate-y-1"
          style={{ 
            animationDelay: `${index * 100}ms`,
            animation: 'fadeInUp 0.6s ease-out forwards'
          }}
        >
          {/* Story Header */}
          <div className="flex items-center justify-between p-4">
            <Link href={`/profile/${story.author.username}`} className="flex items-center space-x-3 group">
              <div className="relative">
                <Image
                  src={story.author.avatar}
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
            <button className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110 active:scale-95">
              <MoreHorizontal size={16} className="text-gray-500" />
            </button>
          </div>

          {/* Story Content */}
          <div className="px-4 pb-3">
            <Link href={`/story/${story.id}`}>
              <h3 className="font-bold text-lg text-gray-900 mb-2 hover:text-purple-600 transition-colors duration-300 font-display">
                {story.title}
              </h3>
              <div className="flex items-center space-x-2 mb-3">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  {story.genre}
                </span>
                <div className="flex space-x-1">
                  {story.hashtags.map((tag, index) => (
                    <span key={index} className="text-purple-600 text-sm hover:underline cursor-pointer transition-all duration-200 hover:text-purple-800 hover:scale-105">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
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
                  src={story.image}
                  alt={story.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </div>
            </Link>
          )}

          {/* Story Actions */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => toggleLike(story.id)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-all duration-300 hover:scale-110 active:scale-95"
                >
                  <Heart 
                    size={20} 
                    className={`transition-all duration-300 ${likedStories.has(story.id) ? 'fill-red-500 text-red-500 animate-pulse' : 'hover:scale-110'}`} 
                  />
                  <span className="text-sm font-medium">
                    {story.likes + (likedStories.has(story.id) ? 1 : 0)}
                  </span>
                </button>
                
                <Link 
                  href={`/story/${story.id}#comments`}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-all duration-300 hover:scale-110 active:scale-95"
                >
                  <MessageCircle size={20} className="transition-transform duration-300 hover:scale-110" />
                  <span className="text-sm font-medium">{story.comments}</span>
                </Link>
                
                <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-all duration-300 hover:scale-110 active:scale-95">
                  <Share2 size={20} className="transition-transform duration-300 hover:scale-110" />
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>
              
              <button
                onClick={() => toggleSave(story.id)}
                className="text-gray-600 hover:text-purple-500 transition-all duration-300 hover:scale-110 active:scale-95"
              >
                <Bookmark 
                  size={20} 
                  className={`transition-all duration-300 ${savedStories.has(story.id) ? 'fill-purple-500 text-purple-500 animate-bounce' : 'hover:scale-110'}`} 
                />
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {/* Load More Button */}
      <div className="text-center py-8">
        <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 transform">
          Load More Stories
        </button>
      </div>
    </div>
  )
}
