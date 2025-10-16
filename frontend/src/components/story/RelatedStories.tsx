'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, MessageCircle, Clock } from 'lucide-react'

interface RelatedStoriesProps {
  currentStoryId: number
  genre: string
}

// Mock related stories data
const mockRelatedStories = [
  {
    id: 2,
    slug: "digital-dreams-1642234567890",
    title: "Digital Dreams",
    author: {
      name: "Alex Chen",
      username: "alexwrites",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
    },
    excerpt: "In the world of algorithms and data structures, love was the one equation I couldn't solve...",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop",
    genre: "Fiction",
    likes: 189,
    comments: 23,
    readTime: "6 min read",
    timeAgo: "4h"
  },
  {
    id: 3,
    slug: "oceans-whisper-1642234567891",
    title: "Ocean's Whisper",
    author: {
      name: "Luna Martinez",
      username: "lunapoetry",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
    },
    excerpt: "Beneath the canopy of ancient oaks, where sunlight dances and shadow cloaks...",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop",
    genre: "Fiction",
    likes: 156,
    comments: 8,
    readTime: "4 min read",
    timeAgo: "6h"
  },
  {
    id: 4,
    slug: "city-lights-1642234567892",
    title: "City Lights",
    author: {
      name: "Marcus Chen",
      username: "marcuswrites",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face"
    },
    excerpt: "The neon signs reflected in the rain-soaked streets, each light telling a different story...",
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=300&h=200&fit=crop",
    genre: "Fiction",
    likes: 298,
    comments: 15,
    readTime: "7 min read",
    timeAgo: "1d"
  }
]

export default function RelatedStories({ currentStoryId, genre }: RelatedStoriesProps) {
  // Filter out current story and get related stories
  const relatedStories = mockRelatedStories.filter(story => story.id !== currentStoryId)

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">More Stories You Might Like</h2>
          <Link 
            href={`/search?genre=${genre}`}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            View All {genre}
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedStories.map((story) => (
            <Link key={story.id} href={`/story/${story.slug || story.id}`} className="group">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Story Image */}
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs font-medium rounded-full">
                      {story.genre}
                    </span>
                  </div>
                </div>

                {/* Story Content */}
                <div className="p-4">
                  {/* Author Info */}
                  <div className="flex items-center space-x-2 mb-3">
                    <Image
                      src={story.author.avatar}
                      alt={story.author.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="text-sm text-gray-600">{story.author.name}</span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-500">{story.timeAgo}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {story.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {story.excerpt}
                  </p>

                  {/* Story Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Heart size={14} />
                        <span>{story.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle size={14} />
                        <span>{story.comments}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{story.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Browse More CTA */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Discover More Amazing Stories
            </h3>
            <p className="text-gray-600 mb-6">
              Explore thousands of stories from talented writers around the world
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                href="/"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Browse All Stories
              </Link>
              <Link 
                href="/search"
                className="border border-purple-500 text-purple-600 px-6 py-3 rounded-full font-medium hover:bg-purple-500 hover:text-white transition-all"
              >
                Search Stories
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
