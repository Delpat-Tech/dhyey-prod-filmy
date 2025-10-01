import StoryFeed from '@/components/home/StoryFeed'
import FeaturedStories from '@/components/home/FeaturedStories'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Mobile optimized */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-8 md:py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 fade-in-up font-heading">
            Share Your Stories
          </h1>
          <p className="text-purple-100 text-sm md:text-lg fade-in-up" style={{ animationDelay: '0.2s' }}>
            Discover amazing stories from creative writers around the world
          </p>
        </div>
        {/* Floating elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-white opacity-10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Featured Stories Section */}
        <FeaturedStories />
        
        {/* Main Feed */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-display">Latest Stories</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-md">
                All
              </button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-300 hover:scale-105 hover:text-purple-600">
                Fiction
              </button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-300 hover:scale-105 hover:text-purple-600">
                Poetry
              </button>
            </div>
          </div>
          
          <StoryFeed />
        </div>
      </div>
    </div>
  )
}
