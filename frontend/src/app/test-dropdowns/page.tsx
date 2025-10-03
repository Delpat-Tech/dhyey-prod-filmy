'use client'

import { useState } from 'react'
import CustomSelect from '@/components/ui/CustomSelect'

export default function TestDropdowns() {
  const [singleValue, setSingleValue] = useState('')
  const [multipleValues, setMultipleValues] = useState<string[]>([])
  const [genreValue, setGenreValue] = useState('')
  const [statusValue, setStatusValue] = useState('all')

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Custom Dropdown Tests</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Single Select */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Single Select</h2>
            <CustomSelect
              value={singleValue}
              onChange={(value) => setSingleValue(value as string)}
              placeholder="Choose a country"
              options={[
                { label: 'China', value: 'china', emoji: '🇨🇳', desc: 'China (中国)' },
                { label: 'USA', value: 'usa', emoji: '🇺🇸', desc: 'USA (美国)' },
                { label: 'Japan', value: 'japan', emoji: '🇯🇵', desc: 'Japan (日本)' },
                { label: 'Korea', value: 'korea', emoji: '🇰🇷', desc: 'Korea (韩国)' }
              ]}
            />
            <p className="mt-2 text-sm text-gray-600">Selected: {singleValue || 'None'}</p>
          </div>

          {/* Multiple Select */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Multiple Select</h2>
            <CustomSelect
              mode="multiple"
              value={multipleValues}
              onChange={(value) => setMultipleValues(value as string[])}
              placeholder="Choose countries"
              options={[
                { label: 'China', value: 'china', emoji: '🇨🇳', desc: 'China (中国)' },
                { label: 'USA', value: 'usa', emoji: '🇺🇸', desc: 'USA (美国)' },
                { label: 'Japan', value: 'japan', emoji: '🇯🇵', desc: 'Japan (日本)' },
                { label: 'Korea', value: 'korea', emoji: '🇰🇷', desc: 'Korea (韩国)' }
              ]}
            />
            <p className="mt-2 text-sm text-gray-600">Selected: {multipleValues.join(', ') || 'None'}</p>
          </div>

          {/* Genre Select (from CreateStoryForm) */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Story Genre Select</h2>
            <CustomSelect
              value={genreValue}
              onChange={(value) => setGenreValue(value as string)}
              placeholder="Select a genre"
              options={[
                { label: 'Fiction', value: 'fiction', emoji: '📚' },
                { label: 'Poetry', value: 'poetry', emoji: '🎭' },
                { label: 'Romance', value: 'romance', emoji: '💕' },
                { label: 'Mystery', value: 'mystery', emoji: '🔍' },
                { label: 'Sci-Fi', value: 'sci-fi', emoji: '🚀' },
                { label: 'Fantasy', value: 'fantasy', emoji: '🧙‍♂️' }
              ]}
            />
            <p className="mt-2 text-sm text-gray-600">Selected: {genreValue || 'None'}</p>
          </div>

          {/* Status Filter (from Admin) */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Status Filter</h2>
            <CustomSelect
              value={statusValue}
              onChange={(value) => setStatusValue(value as string)}
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'Active', value: 'active', emoji: '🟢' },
                { label: 'Upcoming', value: 'upcoming', emoji: '🔵' },
                { label: 'Ended', value: 'ended', emoji: '🔴' },
                { label: 'Draft', value: 'draft', emoji: '⚪' }
              ]}
              className="w-full"
            />
            <p className="mt-2 text-sm text-gray-600">Selected: {statusValue}</p>
          </div>
        </div>

        {/* Custom Render Example */}
        <div className="bg-white p-6 rounded-lg shadow mt-8">
          <h2 className="text-xl font-semibold mb-4">Custom Option Rendering</h2>
          <CustomSelect
            value=""
            onChange={() => {}}
            placeholder="Custom rendered options"
            options={[
              { label: 'Premium', value: 'premium', emoji: '⭐', desc: 'Premium features included' },
              { label: 'Standard', value: 'standard', emoji: '📦', desc: 'Standard package' },
              { label: 'Basic', value: 'basic', emoji: '📝', desc: 'Basic features only' }
            ]}
            optionRender={(option) => (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <span>{option.emoji}</span>
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.desc}</div>
                  </div>
                </div>
                <span className="text-xs text-purple-600">✨</span>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  )
}
