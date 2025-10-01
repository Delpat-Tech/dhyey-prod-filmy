'use client'

import { useState } from 'react'
import { Grid, Bookmark, Heart, Upload } from 'lucide-react'
import StoriesGrid from './StoriesGrid'
import SavedStories from './SavedStories'
import LikedStories from './LikedStories'

const tabs = [
  { id: 'stories', label: 'Stories', icon: Grid },
  { id: 'saved', label: 'Saved', icon: Bookmark },
  { id: 'liked', label: 'Liked', icon: Heart },
]

export default function ProfileTabs() {
  const [activeTab, setActiveTab] = useState('stories')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'stories':
        return <StoriesGrid />
      case 'saved':
        return <SavedStories />
      case 'liked':
        return <LikedStories />
      default:
        return <StoriesGrid />
    }
  }

  return (
    <div className="bg-white">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex justify-center">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {renderTabContent()}
      </div>
    </div>
  )
}
