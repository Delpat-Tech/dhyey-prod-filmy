import CreateStoryForm from '@/components/create/CreateStoryForm'

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 font-heading">
            Share Your Story
          </h1>
          <p className="text-gray-600 text-lg">
            Create and publish your story for the world to read
          </p>
        </div>
        
        <CreateStoryForm />
      </div>
    </div>
  )
}
