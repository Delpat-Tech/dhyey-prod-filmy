import CreateStoryForm from '@/components/create/CreateStoryForm'

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Share Your Story
          </h1>
          <p className="text-gray-600">
            Create and publish your story for the world to read
          </p>
        </div>
        
        <CreateStoryForm />
      </div>
    </div>
  )
}
