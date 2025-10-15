'use client'

import { useState, useRef, useEffect } from 'react'
import { Type, Minus, Plus, Palette, Focus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

interface StoryContentProps {
  story: {
    content: string
    readTime: string
    image?: string
    title?: string
    author?: {
      name: string
      username: string
    }
  }
}

export default function StoryContent({ story }: StoryContentProps) {
  const [fontSize, setFontSize] = useState(16)
  const [showReadingOptions, setShowReadingOptions] = useState(false)
  const [backgroundTheme, setBackgroundTheme] = useState<'clean-white' | 'warm-paper' | 'cool-screen'>('clean-white')
  const [readingProgress, setReadingProgress] = useState(0)
  const [focusMode, setFocusMode] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
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

  const paragraphs = story.content.split('\n\n').filter(p => p.trim())

  // Calculate total words
  const totalWords = paragraphs.reduce((total, paragraph) => {
    return total + paragraph.trim().split(/\s+/).length
  }, 0)

  // Format word count with commas
  const formattedWordCount = totalWords.toLocaleString()

  // Check if story has featured image
  const hasFeaturedImage = Boolean(story.image)

  // Pagination logic - aim for ~150 words per page
  const WORDS_PER_PAGE = 150

  // Group paragraphs into pages
  const getPages = () => {
    const pages = []
    let currentPageWords = 0
    let currentPageParagraphs = []

    for (let i = 0; i < paragraphs.length; i++) {
      const paragraphWordCount = paragraphs[i].trim().split(/\s+/).length

      if (currentPageWords + paragraphWordCount > WORDS_PER_PAGE && currentPageParagraphs.length > 0) {
        pages.push(currentPageParagraphs)
        currentPageWords = 0
        currentPageParagraphs = []
      }

      currentPageParagraphs.push(paragraphs[i])
      currentPageWords += paragraphWordCount
    }

    if (currentPageParagraphs.length > 0) {
      pages.push(currentPageParagraphs)
    }

    return pages
  }

  // Adjust total pages based on whether there's a featured image
  const contentPages = getPages()
  const totalPages = hasFeaturedImage ? contentPages.length + 1 : contentPages.length

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      setReadingProgress((newPage / totalPages) * 100)

      // Scroll to top of content when changing pages
      if (contentRef.current) {
        contentRef.current.scrollTop = 0
      }
    }
  }

  const handleScroll = () => {
    // Keep reading progress in sync with current page
    setReadingProgress((currentPage / totalPages) * 100)
  }

  useEffect(() => {
    handleScroll()
  }, [currentPage, totalPages])

  // Determine what to show on current page
  const isFirstPage = currentPage === 1
  const showFeaturedImage = hasFeaturedImage && isFirstPage
  const showContent = !showFeaturedImage || currentPage > 1

  // Get content page index (adjust for featured image)
  // When we have featured image: Page 1 = image, Page 2+ = content
  // When no featured image: Page 1+ = content
  const contentPageIndex = currentPage === 1 && hasFeaturedImage ? -1 : (hasFeaturedImage ? currentPage - 2 : currentPage - 1)

  return (
    <div className="px-6 py-8">
      {/* Reading Options */}
      <div className={`flex items-center justify-between mb-8 pb-4 border-b border-gray-100 ${focusMode ? 'opacity-50' : ''}`}>
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Estimated reading time: {story.readTime} minutes</span>
          </div>
          <div className="text-xs text-gray-500">
            <span className="font-medium">Total words:</span> {formattedWordCount} • <span className="font-medium">Pages:</span> {totalPages}
          </div>
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
        <div className="sticky top-0 z-20 w-full h-2 bg-gray-200 mb-4">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300 ease-out"
            style={{ width: `${readingProgress}%` }}
          ></div>
        </div>

        {/* Pagination Controls */}
        <div className={`flex items-center justify-between mb-6 px-8 ${focusMode ? 'opacity-0 pointer-events-none' : ''}`}>
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronsLeft size={16} />
            <span>First</span>
          </button>

          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Page</span>
            <span className="font-semibold text-purple-600">{currentPage}</span>
            <span className="text-sm text-gray-600">of</span>
            <span className="font-semibold text-gray-900">{totalPages}</span>
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>

          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span>Last</span>
            <ChevronsRight size={16} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div
          ref={contentRef}
          className={`px-8 pb-8 max-h-[60vh] overflow-y-auto ${backgroundThemes[backgroundTheme].textColor}`}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: '2.5',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgb(147, 51, 234) rgb(243, 244, 246)'
          }}
        >
          <div className="break-words overflow-wrap-anywhere text-justify">
            {/* Show featured image on page 1 if it exists */}
            {showFeaturedImage && story.image && (
              <div className="mb-8">
                <img
                  src={story.image}
                  alt="Story featured image"
                  className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
                />
                {/* Show story title below the featured image */}
                {story.title && (
                  <div className="mt-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                      {story.title}
                    </h2>
                    {/* Show author name below the title */}
                    {story.author?.name && (
                      <p className="mt-2 text-lg text-gray-600 font-medium">
                        by {story.author.name}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Show content pages */}
            {showContent && contentPageIndex >= 0 && contentPages[contentPageIndex]?.map((paragraph: string, index: number) => (
              <p key={index} className="mb-6 break-words">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Pagination Controls (Bottom) */}
        <div className={`flex items-center justify-center mt-6 px-8 ${focusMode ? 'opacity-0 pointer-events-none' : ''}`}>
          <div className="flex items-center space-x-2 bg-gray-50 rounded-full px-4 py-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed rounded"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-purple-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed rounded"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </article>
    </div>
  )
}


























