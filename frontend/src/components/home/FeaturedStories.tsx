'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

const featuredStories = [
  {
    id: 1,
    title: "The Last Sunset",
    author: "Sarah Johnson",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    genre: "Fiction",
    excerpt: "A tale of love and loss in the mountains..."
  },
  {
    id: 2,
    title: "Digital Dreams",
    author: "Alex Chen",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
    genre: "Sci-Fi",
    excerpt: "In a world where reality and virtual merge..."
  },
  {
    id: 3,
    title: "Ocean's Whisper",
    author: "Maria Rodriguez",
    image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop",
    genre: "Poetry",
    excerpt: "Waves carry secrets from distant shores..."
  },
]

export default function FeaturedStories() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev + 1) % featuredStories.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const prevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev - 1 + featuredStories.length) % featuredStories.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  return (
    <div className="relative">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 font-display">Featured Stories</h2>
      
      {/* Mobile Carousel */}
      <div className="md:hidden relative overflow-hidden rounded-xl">
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {featuredStories.map((story) => (
            <div key={story.id} className="w-full flex-shrink-0">
              <Link href={`/story/${story.id}`} className="block">
                <div className="relative h-48 rounded-xl overflow-hidden">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="inline-block px-2 py-1 bg-purple-500 rounded-full text-xs font-medium mb-2">
                      {story.genre}
                    </span>
                    <h3 className="font-bold text-lg mb-1 font-display">{story.title}</h3>
                    <p className="text-sm text-gray-200">by {story.author}</p>
                    <p className="text-xs text-gray-300 mt-1">{story.excerpt}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        
        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50"
        >
          <ChevronRight size={16} />
        </button>
        
        {/* Dots Indicator */}
        <div className="flex justify-center space-x-2 mt-4">
          {featuredStories.map((_, index) => (
            <button
              key={index}
              onClick={() => !isTransitioning && setCurrentIndex(index)}
              disabled={isTransitioning}
              className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-125 ${
                index === currentIndex ? 'bg-purple-500 scale-110' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-3 gap-6">
        {featuredStories.map((story) => (
          <Link key={story.id} href={`/story/${story.id}`} className="group transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="relative h-48 rounded-xl overflow-hidden shadow-md">
              <Image
                src={story.image}
                alt={story.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="inline-block px-2 py-1 bg-purple-500 rounded-full text-xs font-medium mb-2">
                  {story.genre}
                </span>
                <h3 className="font-bold text-lg mb-1">{story.title}</h3>
                <p className="text-sm text-gray-200">by {story.author}</p>
                <p className="text-xs text-gray-300 mt-1">{story.excerpt}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
