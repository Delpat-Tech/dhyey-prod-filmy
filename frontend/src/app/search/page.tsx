import SearchInterface from '@/components/search/SearchInterface'

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Discover Stories
          </h1>
          <p className="text-gray-600">
            Search by title, author, or hashtags to find your next great read
          </p>
        </div>
        
        <SearchInterface />
      </div>
    </div>
  )
}
