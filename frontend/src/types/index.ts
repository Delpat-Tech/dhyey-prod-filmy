// User Types
export interface User {
  id: number
  name: string
  username: string
  email: string
  avatar: string
  bio?: string
  location?: string
  website?: string
  joinDate: string
  verified: boolean
  stats: {
    stories: number
    followers: number
    following: number
    likes: number
  }
}

// Story Types
export interface Story {
  id: number
  title: string
  content: string
  excerpt: string
  featuredImage?: string
  genre: string
  hashtags: string[]
  author: User
  publishedAt: string
  updatedAt: string
  status: 'draft' | 'review' | 'published' | 'rejected'
  readTime: string
  stats: {
    likes: number
    saves: number
    comments: number
    views: number
  }
  isLiked?: boolean
  isSaved?: boolean
}

// Comment Types
export interface Comment {
  id: number
  content: string
  author: User
  storyId: number
  parentId?: number
  createdAt: string
  likes: number
  isLiked?: boolean
  replies?: Comment[]
}

// Genre Types
export interface Genre {
  id: number
  name: string
  description: string
  color: string
  storyCount: number
}

// Competition Types
export interface Competition {
  id: number
  title: string
  description: string
  image: string
  deadline: string
  prize: string
  participants: number
  status: 'open' | 'closed' | 'judging' | 'completed'
  rules: string[]
  winners?: CompetitionWinner[]
}

export interface CompetitionWinner {
  id: number
  user: User
  story: Story
  position: number
  prize: string
}

// DHEY Production Types
export interface Project {
  id: number
  title: string
  category: 'Films' | 'Series' | 'Documentaries' | 'Commercials'
  year: string
  description: string
  image: string
  awards: string[]
  status: 'Released' | 'In Production' | 'Post-Production'
  link: string
}

// Search Types
export interface SearchFilters {
  query: string
  type: 'all' | 'title' | 'author' | 'hashtag'
  genre: string
  sortBy: 'latest' | 'popular' | 'trending'
}

export interface SearchResult {
  stories: Story[]
  users: User[]
  total: number
  hasMore: boolean
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Form Types
export interface CreateStoryForm {
  title: string
  content: string
  genre: string
  hashtags: string
  featuredImage?: File
}

export interface ContactForm {
  name: string
  email: string
  inquiryType: string
  subject: string
  message: string
}

// Navigation Types
export interface NavItem {
  href: string
  label: string
  icon?: React.ComponentType<{ size?: number }>
}

// Notification Types
export interface Notification {
  id: number
  type: 'like' | 'comment' | 'follow' | 'story_approved' | 'story_rejected'
  message: string
  read: boolean
  createdAt: string
  relatedUser?: User
  relatedStory?: Story
}
