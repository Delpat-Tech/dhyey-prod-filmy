'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, MessageCircle, Bookmark, Clock } from 'lucide-react'

// Mock saved stories data
const savedStories = [
  {
    id: 7,
    title: "The Art of Letting Go",
    author: {
      name: "Maya Patel",
      username: "mayapoetry",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face"
    },
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    genre: "Poetry",
    likes: 234,
    comments: 19,
    savedAt: "2 days ago",
    excerpt: "Like autumn leaves that dance on wind, our memories float away..."
  },
  {
    id: 8,
    title: "Midnight in Tokyo",
    author: {
      name: "Yuki Tanaka",
      username: "yukistories",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face"
    },
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&h=300&fit=crop",
    genre: "Fiction",
    likes: 567,
    comments: 45,
    savedAt: "1 week ago",
    excerpt: "The neon lights reflected off the wet streets as I walked through Shibuya..."
  },
  {
    id: 9,
    title: "The Digital Nomad's Journey",
    author: {
      name: "Alex Thompson",
      username: "alexwrites",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
    },
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300&h=300&fit=crop",
    genre: "Non-Fiction",
    likes: 342,
    comments: 28,
    savedAt: "2 weeks ago",
    excerpt: "Working from coffee shops around the world taught me more than any office..."
  }
]

export default function SavedStories() {
  if (savedStories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Bookmark size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Saved Stories</h3>
        <p className="text-gray-600">Stories you save will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {savedStories.map((story) => (
        <div key={story.id} className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
          <div className="md:flex">
            {/* Story Image */}
            <div className="md:w-48 h-48 md:h-auto relative flex-shrink-0">
              <Link href={`/story/${story.id}`}>
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </div>

            {/* Story Content */}
            <div className="flex-1 p-4 md:p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Link href={`/profile/${story.author.username}`}>
                    <Image
                      src={story.author.avatar}
                      alt={story.author.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </Link>
                  <div>
                    <Link 
                      href={`/profile/${story.author.username}`}
                      className="font-medium text-gray-900 hover:text-purple-600"
                    >
                      {story.author.name}
                    </Link>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>@{story.author.username}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>Saved {story.savedAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  {story.genre}
                </span>
              </div>

              <Link href={`/story/${story.id}`}>
                <h3 className="font-bold text-lg text-gray-900 mb-2 hover:text-purple-600 transition-colors">
                  {story.title}
                </h3>
                <p className="text-gray-700 mb-3 line-clamp-2">
                  {story.excerpt}
                </p>
              </Link>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Heart size={16} />
                    <span>{story.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle size={16} />
                    <span>{story.comments}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="text-purple-600 hover:text-purple-700 p-1">
                    <Bookmark size={16} className="fill-purple-600" />
                  </button>
                  <Link 
                    href={`/story/${story.id}`}
                    className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                  >
                    Read
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
