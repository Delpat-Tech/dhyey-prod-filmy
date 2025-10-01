'use client'

import { Filter, X } from 'lucide-react'

interface CompetitionFiltersProps {
  selectedCategory: string
  selectedDifficulty: string
  selectedStatus: string
  onCategoryChange: (category: string) => void
  onDifficultyChange: (difficulty: string) => void
  onStatusChange: (status: string) => void
  onClearFilters: () => void
}

export default function CompetitionFilters({
  selectedCategory,
  selectedDifficulty,
  selectedStatus,
  onCategoryChange,
  onDifficultyChange,
  onStatusChange,
  onClearFilters
}: CompetitionFiltersProps) {
  const categories = ['All', 'Writing', 'Film', 'Documentary', 'Poetry', 'Photography', 'Music']
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced']
  const statuses = ['All', 'Open', 'Closing Soon', 'Closed']

  const hasActiveFilters = selectedCategory !== 'All' || selectedDifficulty !== 'All' || selectedStatus !== 'All'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            <X size={16} />
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Difficulty Level</label>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => onDifficultyChange(difficulty)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedDifficulty === difficulty
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Status</label>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => onStatusChange(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedStatus === status
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
