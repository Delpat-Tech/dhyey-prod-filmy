'use client'

import Image from 'next/image'
import { Target, Eye, Heart, Zap } from 'lucide-react'

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description: "To empower storytellers and creators by providing a platform where imagination meets innovation, fostering a community of creative minds."
  },
  {
    icon: Eye,
    title: "Our Vision",
    description: "To become the leading creative hub where stories transcend boundaries and inspire positive change in the world."
  },
  {
    icon: Heart,
    title: "Our Values",
    description: "Creativity, authenticity, collaboration, and excellence drive everything we do. We believe every story matters."
  },
  {
    icon: Zap,
    title: "Our Impact",
    description: "Transforming ideas into compelling narratives that resonate with audiences and create lasting emotional connections."
  }
]

export default function AboutSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            About DHEY Productions
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Founded with a passion for storytelling, DHEY Productions has been at the forefront 
            of creative content creation, bringing together talented writers, filmmakers, and artists.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
              Our Story
            </h3>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                DHEY Productions was born from a simple belief: every story has the power to change lives. 
                What started as a small collective of passionate storytellers has grown into a thriving 
                creative community that spans across multiple mediums and genres.
              </p>
              <p>
                We've produced award-winning content, launched successful campaigns, and most importantly, 
                provided a platform for emerging voices to share their unique perspectives with the world.
              </p>
              <p>
                Today, we continue to push the boundaries of creative storytelling, embracing new 
                technologies and platforms while staying true to our core mission of authentic, 
                impactful narrative creation.
              </p>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=500&fit=crop"
                alt="DHEY Productions team"
                fill
                className="object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20"></div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <value.icon size={24} className="text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h4>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Team Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Meet Our Creative Team
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Sarah Johnson", role: "Creative Director", image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face" },
              { name: "Michael Chen", role: "Lead Producer", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" },
              { name: "Emily Rodriguez", role: "Story Editor", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face" },
              { name: "David Kim", role: "Technical Lead", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face" }
            ].map((member, index) => (
              <div key={index} className="group">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h5 className="font-bold text-gray-900">{member.name}</h5>
                <p className="text-purple-600 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
