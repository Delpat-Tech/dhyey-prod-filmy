// Centralized mock data for the application
// TODO: Replace with actual API calls

export interface User {
  id: number
  name: string
  username: string
  email?: string
  avatar: string
  bio?: string
  location?: string
  joinDate?: string
  website?: string
  role?: 'user' | 'admin'
  isOwnProfile?: boolean
  stats: {
    stories: number
    followers: number
    following: number
    likes: number
  }
}

export interface Story {
  id: number
  title: string
  content: string
  excerpt?: string
  author: {
    name: string
    username: string
    avatar: string
  }
  image?: string
  genre: string
  genres?: string[]
  likes: number
  saves: number
  comments: number
  timeAgo: string
  hashtags: string[]
  status?: 'draft' | 'published' | 'review'
}

export interface Competition {
  id: number
  title: string
  description: string
  longDescription?: string
  deadline: string
  startDate: string
  prize: string
  prizeDetails?: {
    first: string
    second: string
    third: string
  }
  participants: number
  maxParticipants?: number
  submissions: number
  image?: string
  status: 'active' | 'upcoming' | 'ended' | 'draft' | 'closing-soon'
  category: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  featured?: boolean
  categories?: string[]
  requirements?: string[]
  judgingCriteria?: Array<{ name: string; weight: number }>
  judges?: Array<{ name: string; role: string; image: string }>
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    username: "sarahjwrites",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    bio: "Storyteller | Fiction Writer | Coffee Enthusiast ☕\nLove crafting tales that touch hearts and minds ✨",
    location: "New York, NY",
    joinDate: "March 2023",
    website: "sarahjohnson.com",
    isOwnProfile: true,
    stats: {
      stories: 24,
      followers: 1247,
      following: 389,
      likes: 5632
    }
  }
]

// Mock Stories
export const mockStories: Story[] = [
  {
    id: 1,
    title: "The Midnight Train",
    author: {
      name: "Emma Wilson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      username: "emmawrites"
    },
    content: "The old train station stood empty, its platforms echoing with memories of countless journeys. Sarah clutched her suitcase tighter as the midnight train approached, its headlight cutting through the darkness like a beacon of hope...",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&h=300&fit=crop",
    genre: "Fiction",
    genres: ["Fiction", "Mystery"],
    likes: 234,
    saves: 45,
    comments: 12,
    timeAgo: "2h",
    hashtags: ["#fiction", "#mystery", "#train"]
  },
  {
    id: 2,
    title: "Code of the Heart",
    author: {
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      username: "davidcodes"
    },
    content: "In the world of algorithms and data structures, love was the one equation I couldn't solve. Every line of code I wrote seemed to spell out her name, every function returned memories of us...",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&h=300&fit=crop",
    genre: "Romance",
    genres: ["Romance", "Fiction"],
    likes: 189,
    saves: 67,
    comments: 23,
    timeAgo: "4h",
    hashtags: ["#romance", "#tech", "#love"]
  }
]

// Mock Competitions
export const mockCompetitions: Competition[] = [
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
    submissions: 156,
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop",
    status: "active",
    category: "Writing",
    difficulty: "intermediate",
    featured: true,
    categories: ["Fiction", "Drama"],
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
    ]
  },
  {
    id: 2,
    title: "Young Filmmaker Award",
    description: "Create a 5-minute film showcasing your unique perspective on modern life.",
    deadline: "2024-04-30T23:59:59",
    startDate: "2024-01-15T00:00:00",
    prize: "$10,000 + Mentorship",
    participants: 89,
    maxParticipants: 200,
    submissions: 67,
    status: "active",
    category: "Film",
    difficulty: "advanced",
    categories: ["Film", "Documentary"]
  },
  {
    id: 3,
    title: "Poetry Slam 2024",
    description: "Express yourself through the power of spoken word poetry.",
    deadline: "2024-06-30T23:59:59",
    startDate: "2024-04-01T00:00:00",
    prize: "$3,000 + Performance Opportunity",
    participants: 45,
    submissions: 34,
    status: "upcoming",
    category: "Poetry",
    difficulty: "beginner",
    categories: ["Poetry"]
  }
]

// Helper functions
export const getUserById = (id: number): User | undefined => {
  return mockUsers.find(user => user.id === id)
}

export const getStoryById = (id: number): Story | undefined => {
  return mockStories.find(story => story.id === id)
}

export const getCompetitionById = (id: number): Competition | undefined => {
  return mockCompetitions.find(competition => competition.id === id)
}

export const getStoriesByAuthor = (username: string): Story[] => {
  return mockStories.filter(story => story.author.username === username)
}

export const getActiveCompetitions = (): Competition[] => {
  return mockCompetitions.filter(comp => comp.status === 'active')
}

export const getFeaturedCompetitions = (): Competition[] => {
  return mockCompetitions.filter(comp => comp.featured)
}
