'use client'

import { useState, useRef, useEffect } from 'react'
import { Type, Minus, Plus, Palette, Focus } from 'lucide-react'

interface StoryContentProps {
  story: {
    content: string
    readTime: string
  }
}

export default function StoryContent({ story }: StoryContentProps) {
  const [fontSize, setFontSize] = useState(16)
  const [showReadingOptions, setShowReadingOptions] = useState(false)
  const [backgroundTheme, setBackgroundTheme] = useState<'clean-white' | 'warm-paper' | 'cool-screen'>('clean-white')
  const [readingProgress, setReadingProgress] = useState(0)
  const [focusMode, setFocusMode] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const backgroundThemes = {
    'clean-white': {
      name: 'Clean White',
      background: 'bg-white',
      textColor: 'text-gray-800'
    },
    'warm-paper': {
      name: 'Warm Paper',
      background: 'bg-amber-50',
      textColor: 'text-gray-900'
    },
    'cool-screen': {
      name: 'Cool Screen',
      background: 'bg-slate-50',
      textColor: 'text-gray-800'
    }
  }

  const increaseFontSize = () => {
    if (fontSize < 24) setFontSize(fontSize + 2)
  }

  const decreaseFontSize = () => {
    if (fontSize > 12) setFontSize(fontSize - 2)
  }

  const handleScroll = () => {
    if (contentRef.current) {
      const element = contentRef.current
      const scrollTop = element.scrollTop
      const scrollHeight = element.scrollHeight - element.clientHeight
      const progress = (scrollTop / scrollHeight) * 100
      setReadingProgress(Math.min(100, Math.max(0, progress)))
    }
  }

  useEffect(() => {
    const element = contentRef.current
    if (element) {
      element.addEventListener('scroll', handleScroll)
      return () => element.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const paragraphs = story.content.split('\n\n').filter(p => p.trim())

  return (
    <div className="px-6 py-8">
      {/* Reading Options */}
      <div className={`flex items-center justify-between mb-8 pb-4 border-b border-gray-100 ${focusMode ? 'opacity-50' : ''}`}>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Estimated reading time: {story.readTime} minutes</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFocusMode(!focusMode)}
            className={`flex items-center space-x-1 px-3 py-1 text-sm rounded-full font-medium transition-all ${
              focusMode
                ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Focus size={16} />
            <span className="hidden sm:inline">{focusMode ? 'Exit Focus' : 'Focus Mode'}</span>
          </button>

          <button
            onClick={() => setShowReadingOptions(!showReadingOptions)}
            className={`flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors ${focusMode ? 'opacity-0 pointer-events-none' : ''}`}
          >
            <Type size={16} />
            <span className="hidden sm:inline">Reading Options</span>
          </button>
        </div>
      </div>

      {/* Reading Options Panel */}
      <div className={`${focusMode ? 'opacity-0 pointer-events-none transition-opacity duration-300' : ''}`}>
        {showReadingOptions && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Type size={16} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Font Size</span>
              </div>
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

            {/* Background Theme Selection */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Palette size={16} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Background</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(backgroundThemes).map(([key, theme]) => (
                  <button
                    key={key}
                    onClick={() => setBackgroundTheme(key as typeof backgroundTheme)}
                    className={`p-2 rounded-lg border-2 text-xs font-medium transition-all ${
                      backgroundTheme === key
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{
                      backgroundColor: key === 'clean-white' ? '#ffffff' :
                                       key === 'warm-paper' ? '#fef3c7' :
                                       key === 'cool-screen' ? '#f1f5f9' :
                                       '#ffffff'
                    }}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Story Content */}
      <article className={`prose prose-lg max-w-none rounded-lg ${backgroundThemes[backgroundTheme].background} relative`}>
        {/* Reading Progress Bar */}
        <div className="sticky top-0 z-20 w-full h-1 bg-gray-200 mb-4">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300 ease-out"
            style={{ width: `${readingProgress}%` }}
          ></div>
        </div>

        {/* Scrollable Content */}
        <div
          ref={contentRef}
          className={`p-8 max-h-[70vh] overflow-y-auto ${backgroundThemes[backgroundTheme].textColor}`}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: '2.0',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgb(147, 51, 234) rgb(243, 244, 246)'
          }}
        >
          <div className="break-words overflow-wrap-anywhere text-justify">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="mb-6 break-words">
                {paragraph}
              </p>
            ))}
          </div>
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
