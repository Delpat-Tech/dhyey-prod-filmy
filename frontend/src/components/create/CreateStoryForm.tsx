'use client'

import { useState } from 'react'
import { Send, Image as ImageIcon, Hash, X, Upload, Save, Eye } from 'lucide-react'
import CustomSelect from '@/components/ui/CustomSelect'
import Image from 'next/image'
import { storyAPI } from '@/lib/api'
import { showNotification } from '@/lib/errorHandler'

const genres = ['Fiction', 'Poetry', 'Romance', 'Mystery', 'Sci-Fi', 'Fantasy', 'Drama', 'Non-Fiction', 'Comedy']

export default function CreateStoryForm() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    genres: [] as string[],
    hashtags: '',
    featuredImage: null as File | null
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('unsaved')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setSaveStatus('unsaved')
  }

  const handleGenreChange = (value: string | string[]) => {
    const selectedGenres = value as string[]
    
    // Generate hashtags from selected genres
    const genreHashtags = selectedGenres.map(genre => 
      `#${genre.toLowerCase().replace(/[^a-z0-9]/g, '')}`
    ).join(' ')
    
    // Get existing hashtags (excluding genre-based ones)
    const currentHashtags = formData.hashtags
      .split(' ')
      .filter(tag => tag.trim() && !genres.some(genre => 
        tag.toLowerCase() === `#${genre.toLowerCase().replace(/[^a-z0-9]/g, '')}`
      ))
      .join(' ')
    
    // Combine existing hashtags with new genre hashtags
    const updatedHashtags = [currentHashtags, genreHashtags]
      .filter(part => part.trim())
      .join(' ')
    
    setFormData(prev => ({ 
      ...prev, 
      genres: selectedGenres,
      hashtags: updatedHashtags
    }))
    setSaveStatus('unsaved')
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, featuredImage: file }))
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFormData(prev => ({ ...prev, featuredImage: null }))
    setImagePreview(null)
  }

  const handleSaveDraft = async () => {
    alert('Coming Soon!')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('content', formData.content)
      formDataToSend.append('genre', formData.genres[0] || 'Fiction')
      
      // Send hashtags as individual form fields
      const hashtagsArray = formData.hashtags.split(' ').filter(tag => tag.trim())
      hashtagsArray.forEach((tag, index) => {
        formDataToSend.append(`hashtags[${index}]`, tag)
      })
      
      formDataToSend.append('status', 'pending')
      
      // Add image if selected
      if (formData.featuredImage) {
        formDataToSend.append('storyImage', formData.featuredImage)
      }
      
      const response = await storyAPI.createStoryWithImage(formDataToSend)
      
      showNotification({
        type: 'success',
        title: 'Story Submitted for Review!',
        message: 'Your story has been submitted and is pending admin approval. You will be notified once it is reviewed.'
      })
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        genres: [],
        hashtags: '',
        featuredImage: null
      })
      setImagePreview(null)
      
    } catch (error: any) {
      showNotification({
        type: 'error',
        title: 'Failed to Create Story',
        message: error.message || 'Something went wrong. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePreview = () => {
    // Open preview modal or navigate to preview page
    console.log('Preview story:', formData)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Story Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter your story title..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base transition-all duration-200 text-gray-900 bg-white placeholder:text-gray-500"
            required
          />
        </div>

        {/* Genre and Hashtags Row */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="genres" className="block text-sm font-medium text-gray-700 mb-2">
              Genres * <span className="text-sm font-normal text-gray-500">(Select multiple)</span>
            </label>
            <CustomSelect
              mode="multiple"
              value={formData.genres}
              onChange={handleGenreChange}
              placeholder="Select genres for your story"
              options={genres.map(genre => ({
                label: genre,
                value: genre,
                emoji: genre === 'Fiction' ? '📚' : 
                       genre === 'Poetry' ? '🎭' :
                       genre === 'Romance' ? '💕' :
                       genre === 'Mystery' ? '🔍' :
                       genre === 'Sci-Fi' ? '🚀' :
                       genre === 'Fantasy' ? '🧙‍♂️' :
                       genre === 'Drama' ? '🎬' :
                       genre === 'Non-Fiction' ? '📖' :
                       genre === 'Comedy' ? '😂' : '📝'
              }))}
              className="w-full"
            />
            {formData.genres.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Selected genres:</p>
                <div className="flex flex-wrap gap-1">
                  {formData.genres.map((genre) => (
                    <span
                      key={genre}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700"
                    >
                        <span className="mr-1">
                          {genre === 'Fiction' ? '📚' : 
                           genre === 'Poetry' ? '🎭' :
                           genre === 'Romance' ? '💕' :
                           genre === 'Mystery' ? '🔍' :
                           genre === 'Sci-Fi' ? '🚀' :
                           genre === 'Fantasy' ? '🧙‍♂️' :
                           genre === 'Drama' ? '🎬' :
                           genre === 'Non-Fiction' ? '📖' :
                           genre === 'Comedy' ? '😂' : '📝'}
                        </span>
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="hashtags" className="block text-sm font-medium text-gray-700 mb-2">
              Hashtags
            </label>
            <input
              type="text"
              id="hashtags"
              name="hashtags"
              value={formData.hashtags}
              onChange={handleInputChange}
              placeholder="#fiction #love #mystery"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-base text-gray-900 bg-white placeholder:text-gray-500"
            />
            <div className="mt-1">
              <p className="text-xs text-gray-500">
                Separate hashtags with spaces • Genre hashtags are added automatically
              </p>
              {formData.genres.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  <span className="text-xs text-purple-600">Auto-generated:</span>
                  {formData.genres.map(genre => (
                    <span
                      key={genre}
                      className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-purple-50 text-purple-600 border border-purple-200"
                    >
                      #{genre.toLowerCase().replace(/[^a-z0-9]/g, '')}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image
          </label>
          
          {imagePreview ? (
            <div className="relative">
              <div className="relative h-48 md:h-64 rounded-lg overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Featured image preview"
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
              <input
                type="file"
                id="featuredImage"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label htmlFor="featuredImage" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Click to upload featured image</p>
                <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </label>
            </div>
          )}
        </div>

        {/* Story Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Your Story *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Start writing your story here..."
            rows={12}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none transition-all duration-200 text-gray-900 bg-white"
            required
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-500">
              {formData.content.length} characters
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
          {/**
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saveStatus === 'saving'}
            className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50"
          >
            <Save size={16} />
            <span>{saveStatus === 'saving' ? 'Saving...' : 'Save Draft'}</span>
          </button>
          
          <button
            type="button"
            onClick={handlePreview}
            className="flex items-center justify-center space-x-2 px-6 py-3 border border-purple-300 text-purple-700 rounded-xl hover:bg-purple-50 hover:border-purple-400 transition-all duration-200"
          >
            <Eye size={16} />
            <span>Preview</span>
          </button>
          */}

          <button
            type="submit"
            disabled={isSubmitting || !formData.title || !formData.content || formData.genres.length === 0}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
          >
            <Send size={16} />
            <span>{isSubmitting ? 'Submitting...' : 'Submit for Review'}</span>
          </button>
        </div>

        {/* Submission Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Submission Guidelines</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• You can select multiple genres to better categorize your story</li>
            <li>• Genre hashtags are automatically added to help with discoverability</li>
            <li>• Stories will be reviewed by our team before publication</li>
            <li>• Please ensure your content is original and appropriate</li>
            <li>• You'll receive an email notification once your story is reviewed</li>
            <li>• Approved stories will be published and visible to all users</li>
          </ul>
        </div>
      </form>
    </div>
  )
}
