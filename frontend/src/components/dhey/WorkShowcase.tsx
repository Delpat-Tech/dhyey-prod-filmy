'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Play, ExternalLink, Award, Calendar } from 'lucide-react'

const categories = ['All', 'Films', 'Series', 'Documentaries', 'Commercials']

const projects = [
  {
    id: 1,
    title: "The Last Horizon",
    category: "Films",
    year: "2023",
    description: "A sci-fi thriller about humanity's final journey to find a new home among the stars.",
    image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=600&h=400&fit=crop",
    awards: ["Best Cinematography", "Audience Choice"],
    status: "Released",
    link: "#"
  },
  {
    id: 2,
    title: "Urban Stories",
    category: "Series",
    year: "2023",
    description: "An anthology series exploring the interconnected lives of city dwellers.",
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&h=400&fit=crop",
    awards: ["Best Drama Series"],
    status: "In Production",
    link: "#"
  },
  {
    id: 3,
    title: "Voices of Change",
    category: "Documentaries",
    year: "2022",
    description: "A powerful documentary following activists working to create positive social change.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
    awards: ["Best Documentary", "Social Impact Award"],
    status: "Released",
    link: "#"
  },
  {
    id: 4,
    title: "Dream Big Campaign",
    category: "Commercials",
    year: "2023",
    description: "An inspiring commercial campaign encouraging young entrepreneurs to pursue their dreams.",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop",
    awards: ["Best Commercial"],
    status: "Released",
    link: "#"
  },
  {
    id: 5,
    title: "Midnight Tales",
    category: "Films",
    year: "2022",
    description: "A collection of supernatural short stories that blur the line between reality and fantasy.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop",
    awards: ["Best Horror Film"],
    status: "Released",
    link: "#"
  },
  {
    id: 6,
    title: "Tech Innovators",
    category: "Documentaries",
    year: "2023",
    description: "Exploring the minds behind breakthrough technologies that are shaping our future.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
    awards: [],
    status: "Post-Production",
    link: "#"
  }
]

export default function WorkShowcase() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory)

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Work
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Explore our portfolio of award-winning productions that have captivated audiences 
            and earned critical acclaim across various platforms and festivals.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
              {/* Project Image */}
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-3">
                    <button className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors">
                      <Play size={20} />
                    </button>
                    <Link 
                      href={project.link}
                      className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <ExternalLink size={20} />
                    </Link>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    project.status === 'Released' ? 'bg-green-100 text-green-700' :
                    project.status === 'In Production' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {project.status}
                  </span>
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs font-medium rounded-full">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Calendar size={14} />
                    <span>{project.year}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Awards */}
                {project.awards.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.awards.map((award, index) => (
                      <div key={index} className="flex items-center space-x-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full text-xs">
                        <Award size={12} />
                        <span>{award}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Button */}
                <Link 
                  href={project.link}
                  className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  <span>Learn More</span>
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link 
            href="/dhey-production/portfolio"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
          >
            <span>View Full Portfolio</span>
            <ExternalLink size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
