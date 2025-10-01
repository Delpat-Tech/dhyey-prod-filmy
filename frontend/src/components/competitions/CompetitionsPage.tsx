'use client'

import { useState } from 'react'
import { Trophy, Calendar, Users, Filter, Search, Award, Clock, TrendingUp } from 'lucide-react'
import CompetitionCard from './CompetitionCard'
import CompetitionFilters from './CompetitionFilters'

// Mock data - Replace with API calls
const mockCompetitions = [
  {
    id: 1,
    title: "Short Story Challenge 2024",
    description: "Write a compelling short story in under 1000 words. Theme: 'New Beginnings'",
    longDescription: "This competition seeks to discover new voices in short fiction. Write a story that explores the theme of new beginnings in any genre. Your story should be original, engaging, and demonstrate strong narrative skills.",
    deadline: "2024-03-15T23:59:59",
    startDate: "2024-01-01T00:00:00",
    prize: "$5,000 + Publication",
    prizeDetails: {
      first: "$5,000 + Publication in our annual anthology",
      second: "$2,000 + Online feature",
      third: "$1,000 + Honorable mention"
    },
    participants: 234,
    maxParticipants: 500,
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop",
    status: "Open",
    category: "Writing",
    difficulty: "Intermediate",
    requirements: [
      "Original story between 500-1000 words",
      "Theme must be 'New Beginnings'",
      "Submit in PDF or DOCX format",
      "One entry per person"
    ],
    judgingCriteria: [
      { name: "Originality", weight: 30 },
      { name: "Narrative Structure", weight: 25 },
      { name: "Character Development", weight: 25 },
      { name: "Theme Interpretation", weight: 20 }
    ],
    judges: [
      { name: "Sarah Williams", role: "Award-winning Author", image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop" },
      { name: "James Chen", role: "Literary Critic", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" }
    ],
    submissions: 156
  },
  {
    id: 2,
    title: "Young Filmmaker Award",
    description: "Create a 5-minute film showcasing your unique perspective on modern life.",
    longDescription: "This award celebrates emerging filmmakers who bring fresh perspectives to storytelling. Create a short film that captures the essence of modern life through your unique lens.",
    deadline: "2024-04-30T23:59:59",
    startDate: "2024-01-15T00:00:00",
    prize: "$10,000 + Mentorship",
    prizeDetails: {
      first: "$10,000 + 6-month mentorship with industry professionals",
      second: "$5,000 + Production equipment package",
      third: "$2,500 + Film festival submission package"
    },
    participants: 89,
    maxParticipants: 200,
    image: "https://images.unsplash.com/photo-1489599904472-84b0e19e8b0c?w=800&h=600&fit=crop",
    status: "Open",
    category: "Film",
    difficulty: "Advanced",
    requirements: [
      "Film must be 3-5 minutes long",
      "Original content only",
      "HD quality (1080p minimum)",
      "Include title card and credits"
    ],
    judgingCriteria: [
      { name: "Creativity", weight: 30 },
      { name: "Technical Execution", weight: 25 },
      { name: "Story Impact", weight: 25 },
      { name: "Production Quality", weight: 20 }
    ],
    judges: [
      { name: "Marcus Johnson", role: "Film Director", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop" },
      { name: "Emma Davis", role: "Producer", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop" }
    ],
    submissions: 67
  },
  {
    id: 3,
    title: "Documentary Challenge 2024",
    description: "Create a mini-documentary highlighting an untold story from your community.",
    longDescription: "Documentary filmmaking has the power to reveal hidden stories and create social impact. Share an untold story from your community that deserves to be heard.",
    deadline: "2024-05-31T23:59:59",
    startDate: "2024-02-01T00:00:00",
    prize: "$7,500 + Distribution",
    prizeDetails: {
      first: "$7,500 + Distribution on major platforms",
      second: "$3,500 + Festival submission package",
      third: "$1,500 + Online premiere"
    },
    participants: 45,
    maxParticipants: 150,
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=600&fit=crop",
    status: "Open",
    category: "Documentary",
    difficulty: "Intermediate",
    requirements: [
      "10-15 minutes duration",
      "Focus on community stories",
      "Include interviews and b-roll",
      "Proper licensing for all content"
    ],
    judgingCriteria: [
      { name: "Story Significance", weight: 35 },
      { name: "Research & Accuracy", weight: 25 },
      { name: "Cinematography", weight: 20 },
      { name: "Editing", weight: 20 }
    ],
    judges: [
      { name: "Lisa Rodriguez", role: "Documentary Filmmaker", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop" }
    ],
    submissions: 34
  },
  {
    id: 4,
    title: "Poetry Slam Competition",
    description: "Perform your original spoken word poetry and captivate the audience.",
    longDescription: "Poetry slam brings together the power of words and performance. Share your voice and connect with audiences through the art of spoken word.",
    deadline: "2024-02-28T23:59:59",
    startDate: "2023-12-01T00:00:00",
    prize: "$3,000 + Performance Tour",
    prizeDetails: {
      first: "$3,000 + 10-city performance tour",
      second: "$1,500 + Recording session",
      third: "$750 + Feature spot"
    },
    participants: 178,
    maxParticipants: 300,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    status: "Closing Soon",
    category: "Poetry",
    difficulty: "Beginner",
    requirements: [
      "Original poetry only",
      "3-5 minutes performance time",
      "Video submission required",
      "No props or costumes"
    ],
    judgingCriteria: [
      { name: "Content & Originality", weight: 30 },
      { name: "Performance", weight: 30 },
      { name: "Voice & Delivery", weight: 25 },
      { name: "Audience Impact", weight: 15 }
    ],
    judges: [
      { name: "Maya Thompson", role: "Poet Laureate", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop" }
    ],
    submissions: 142
  }
]

const pastCompetitions = [
  {
    id: 101,
    title: "Short Story Challenge 2023",
    winner: "Emma Thompson",
    winningEntry: "The Last Letter",
    deadline: "2023-03-15T23:59:59",
    prize: "$5,000",
    participants: 412,
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=600&fit=crop",
    category: "Writing"
  },
  {
    id: 102,
    title: "Young Filmmaker Award 2023",
    winner: "Marcus Chen",
    winningEntry: "Digital Dreams",
    deadline: "2023-04-30T23:59:59",
    prize: "$10,000",
    participants: 156,
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=600&fit=crop",
    category: "Film"
  }
]

export default function CompetitionsPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All')

  // Filter competitions
  const filteredCompetitions = mockCompetitions.filter(comp => {
    const matchesSearch = comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comp.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || comp.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'All' || comp.difficulty === selectedDifficulty
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const categories = ['All', ...Array.from(new Set(mockCompetitions.map(c => c.category)))]
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Trophy className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Competitions & Awards
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto mb-8">
              Showcase your talent, compete with the best, and win amazing prizes
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold">{mockCompetitions.length}</div>
                <div className="text-purple-200 mt-1">Active Competitions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold">
                  {mockCompetitions.reduce((sum, c) => sum + c.participants, 0)}
                </div>
                <div className="text-purple-200 mt-1">Total Participants</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold">$35.5K+</div>
                <div className="text-purple-200 mt-1">Prize Money</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search competitions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white min-w-[150px]"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="relative">
              <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white min-w-[150px]"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-8 shadow-sm">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-3 px-6 rounded-md font-medium transition-all ${
              activeTab === 'active'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Clock size={18} />
              Active Competitions ({filteredCompetitions.length})
            </span>
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-3 px-6 rounded-md font-medium transition-all ${
              activeTab === 'past'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Award size={18} />
              Past Winners ({pastCompetitions.length})
            </span>
          </button>
        </div>

        {/* Active Competitions Grid */}
        {activeTab === 'active' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 pb-16">
            {filteredCompetitions.length > 0 ? (
              filteredCompetitions.map((competition) => (
                <CompetitionCard key={competition.id} competition={competition} />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No competitions found</h3>
                <p className="text-gray-500">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
        )}

        {/* Past Competitions Grid */}
        {activeTab === 'past' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
            {pastCompetitions.map((competition) => (
              <div key={competition.id} className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all">
                <div className="relative h-48">
                  <img
                    src={competition.image}
                    alt={competition.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-gray-900 bg-opacity-75 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Closed
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-sm text-purple-600 font-medium mb-1">{competition.category}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{competition.title}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Winner:</span>
                      <span className="font-semibold text-gray-900">{competition.winner}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Entry:</span>
                      <span className="font-medium text-gray-700">"{competition.winningEntry}"</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Prize:</span>
                      <span className="font-semibold text-purple-600">{competition.prize}</span>
                    </div>
                  </div>

                  <button className="w-full py-2 border-2 border-purple-500 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-all">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
