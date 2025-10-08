'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Calendar,
  Award,
  TrendingUp,
  Users,
  FileText,
  Trophy,
  Camera,
  Video,
  Image as ImageIcon,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Star,
  Target,
  Zap,
  Globe,
  BookOpen,
  Heart,
  Share2,
  ChevronRight,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  ExternalLink
} from 'lucide-react'

interface TimelineItem {
  id: string
  year: string
  title: string
  description: string
  type: 'milestone' | 'achievement' | 'launch' | 'partnership'
  icon: any
}

interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  image: string
  social: {
    linkedin?: string
    twitter?: string
    instagram?: string
  }
}

interface MediaItem {
  id: string
  title: string
  type: 'image' | 'video'
  url: string
  thumbnail: string
  category: string
  description: string
  dateAdded: string
}

const companyInfo = {
  name: "DHEY Productions",
  tagline: "Empowering Storytellers, Inspiring Communities",
  founded: "2023",
  location: "Mumbai, India",
  description: "DHEY Productions is a innovative storytelling platform that connects writers, readers, and creative minds through competitions, collaborative projects, and community-driven content creation.",
  mission: "To democratize storytelling and provide a platform where every voice can be heard, every story can find its audience, and creative expression knows no bounds.",
  vision: "To become the world's leading community-driven storytelling ecosystem that nurtures talent, fosters collaboration, and creates meaningful connections through the power of narrative.",
  values: [
    "Creativity without boundaries",
    "Community-first approach",
    "Inclusive storytelling",
    "Innovation in content creation"
  ],
  contact: {
    email: "info@dheyproductions.com",
    phone: "+91 98765 43210",
    address: "123 Creative Hub, Andheri West, Mumbai, Maharashtra 400058"
  }
}

const timelineData: TimelineItem[] = [
  {
    id: '1',
    year: '2023',
    title: 'Platform Launch',
    description: 'DHEY Productions officially launched with the first storytelling competition, attracting over 500 participants.',
    type: 'launch',
    icon: Zap
  },
  {
    id: '2',
    year: '2023',
    title: 'First Major Competition',
    description: 'Successfully hosted "Stories of Tomorrow" competition with 1,200+ submissions and 50,000+ votes.',
    type: 'achievement',
    icon: Trophy
  },
  {
    id: '3',
    year: '2024',
    title: 'Community Milestone',
    description: 'Reached 10,000 registered users and 1,000 published stories on the platform.',
    type: 'milestone',
    icon: Users
  },
  {
    id: '4',
    year: '2024',
    title: 'Publisher Partnership',
    description: 'Partnered with leading publishers to offer publication opportunities to winning authors.',
    type: 'partnership',
    icon: BookOpen
  }
]

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Founder & CEO',
    bio: 'Visionary leader with 10+ years in digital media and content strategy.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150&h=150&fit=crop&crop=face',
    social: {
      linkedin: '#',
      twitter: '#'
    }
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Head of Content',
    bio: 'Award-winning editor and content curator with expertise in digital storytelling.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    social: {
      linkedin: '#',
      instagram: '#'
    }
  },
  {
    id: '3',
    name: 'Priya Sharma',
    role: 'Community Manager',
    bio: 'Community building expert passionate about fostering meaningful connections.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    social: {
      twitter: '#',
      instagram: '#'
    }
  }
]

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedMediaCategory, setSelectedMediaCategory] = useState('all')

  const mediaCategories = [
    { id: 'all', name: 'All Media', count: 24 },
    { id: 'events', name: 'Events', count: 8 },
    { id: 'competitions', name: 'Competitions', count: 12 },
    { id: 'team', name: 'Team', count: 4 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{companyInfo.name}</h1>
            <p className="text-purple-100 mt-2">{companyInfo.tagline}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-purple-100">Founded {companyInfo.founded}</p>
            <p className="text-sm text-purple-100 flex items-center mt-1">
              <MapPin size={14} className="mr-1" />
              {companyInfo.location}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'overview', name: 'Overview', icon: Eye },
            { id: 'timeline', name: 'Timeline', icon: Calendar },
            { id: 'media', name: 'Media Gallery', icon: Camera },
            { id: 'team', name: 'Team', icon: Users },
            { id: 'analytics', name: 'Analytics', icon: TrendingUp }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={18} />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Content Sections */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About DHEY Productions</h2>
            <p className="text-gray-600 mb-6">{companyInfo.description}</p>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Our Mission</h3>
                <p className="text-gray-600 text-sm">{companyInfo.mission}</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Our Vision</h3>
                <p className="text-gray-600 text-sm">{companyInfo.vision}</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Our Values</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  {companyInfo.values.map((value, index) => (
                    <li key={index} className="flex items-center">
                      <Star size={14} className="text-purple-500 mr-2" />
                      {value}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Contact Information</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Mail size={16} className="text-gray-400 mr-3" />
                  {companyInfo.contact.email}
                </div>
                <div className="flex items-center">
                  <Phone size={16} className="text-gray-400 mr-3" />
                  {companyInfo.contact.phone}
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="text-gray-400 mr-3" />
                  {companyInfo.contact.address}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">15K+</div>
                  <div className="text-sm text-gray-600">Registered Users</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">5K+</div>
                  <div className="text-sm text-gray-600">Stories Published</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">50+</div>
                  <div className="text-sm text-gray-600">Competitions Held</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">1M+</div>
                  <div className="text-sm text-gray-600">Total Votes Cast</div>
                </div>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <Award className="h-5 w-5 text-yellow-600" />
                  <div>
                    <div className="font-medium text-gray-900">Best Storytelling Platform 2024</div>
                    <div className="text-sm text-gray-600">Digital Media Awards</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Trophy className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Community Choice Winner</div>
                    <div className="text-sm text-gray-600">Content Creator Awards</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Company Timeline</h2>
          <div className="space-y-6">
            {timelineData.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={item.id} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Icon className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg font-semibold text-purple-600">{item.year}</span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{item.title}</span>
                    </div>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 'media' && (
        <div className="space-y-6">
          {/* Media Categories */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex flex-wrap gap-2 mb-6">
              {mediaCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedMediaCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedMediaCategory === category.id
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>

            {/* Media Gallery */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Sample media items - in a real app, this would come from an API */}
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="group relative">
                  <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={`https://images.unsplash.com/photo-${1500000000000 + index * 1000000000}?w=300&h=300&fit=crop`}
                      alt={`Media item ${index + 1}`}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                        <button className="p-2 bg-white rounded-full hover:bg-gray-100">
                          <Eye size={16} className="text-gray-700" />
                        </button>
                        <button className="p-2 bg-white rounded-full hover:bg-gray-100">
                          <Download size={16} className="text-gray-700" />
                        </button>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                        {index % 2 === 0 ? 'Image' : 'Video'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-gray-900 truncate">Competition Launch Event</h4>
                    <p className="text-xs text-gray-500">Dec 2024</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Upload New Media */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <Upload size={16} />
                <span>Add New Media</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div key={member.id} className="text-center">
                <div className="relative mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={120}
                    height={120}
                    className="w-30 h-30 rounded-full mx-auto object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-purple-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm mb-3">{member.bio}</p>
                <div className="flex justify-center space-x-3">
                  {member.social.linkedin && (
                    <a href={member.social.linkedin} className="text-gray-400 hover:text-blue-600">
                      <Linkedin size={18} />
                    </a>
                  )}
                  {member.social.twitter && (
                    <a href={member.social.twitter} className="text-gray-400 hover:text-blue-400">
                      <Twitter size={18} />
                    </a>
                  )}
                  {member.social.instagram && (
                    <a href={member.social.instagram} className="text-gray-400 hover:text-pink-600">
                      <Instagram size={18} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">15,234</p>
                <p className="text-sm text-green-600">+12% from last month</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stories Published</p>
                <p className="text-3xl font-bold text-gray-900">5,678</p>
                <p className="text-sm text-green-600">+8% from last month</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Competitions Held</p>
                <p className="text-3xl font-bold text-gray-900">52</p>
                <p className="text-sm text-green-600">+4 this month</p>
              </div>
              <Trophy className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                <p className="text-3xl font-bold text-gray-900">78%</p>
                <p className="text-sm text-green-600">+5% from last month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
