'use client'

import { useState } from 'react'
import { Type, Minus, Plus } from 'lucide-react'

interface StoryContentProps {
  story: {
    content: string
    readTime: string
  }
}

export default function StoryContent({ story }: StoryContentProps) {
  const [fontSize, setFontSize] = useState(16)
  const [showReadingOptions, setShowReadingOptions] = useState(false)

  const increaseFontSize = () => {
    if (fontSize < 24) setFontSize(fontSize + 2)
  }

  const decreaseFontSize = () => {
    if (fontSize > 12) setFontSize(fontSize - 2)
  }

  const paragraphs = story.content.split('\n\n').filter(p => p.trim())

  return (
    <div className="px-6 py-8">
      {/* Reading Options */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Reading time: {story.readTime}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowReadingOptions(!showReadingOptions)}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Type size={16} />
            <span className="hidden sm:inline">Reading Options</span>
          </button>
        </div>
      </div>

      {/* Font Size Controls */}
      {showReadingOptions && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Font Size</span>
            <div className="flex items-center space-x-3">
              <button
                onClick={decreaseFontSize}
                disabled={fontSize <= 12}
                className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus size={16} />
              </button>
              <span className="text-sm text-gray-600 min-w-[3rem] text-center">
                {fontSize}px
              </span>
              <button
                onClick={increaseFontSize}
                disabled={fontSize >= 24}
                className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Story Content */}
      <article className="prose prose-lg max-w-none">
        <div 
          className="text-gray-800 leading-relaxed break-words overflow-wrap-anywhere"
          style={{ fontSize: `${fontSize}px`, lineHeight: '1.7' }}
        >
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="mb-6 break-words">
              {paragraph}
            </p>
          ))}
        </div>
      </article>

      {/* Reading Progress Indicator */}
      <div className="mt-12 pt-8 border-t border-gray-100">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span>End of Story</span>
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
