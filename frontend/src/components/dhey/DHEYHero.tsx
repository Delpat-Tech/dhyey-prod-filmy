'use client'

import Image from 'next/image'
import { Play, Award, Users, Film } from 'lucide-react'

export default function DHEYHero() {
  return (
    <div className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          {/* Logo/Brand */}
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Film size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-bold">DHEY</h1>
              <p className="text-xl md:text-2xl text-purple-200">Productions</p>
            </div>
          </div>

          {/* Tagline */}
          <h2 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
            Crafting Stories That
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Inspire & Entertain
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-purple-200 mb-8 max-w-3xl mx-auto">
            From compelling narratives to visual masterpieces, we bring creative visions to life 
            through innovative storytelling and cutting-edge production techniques.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-full font-bold text-lg hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-105">
              <Play size={20} />
              <span>Watch Our Work</span>
            </button>
            <button className="flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-purple-900 transition-all">
              <Users size={20} />
              <span>Join Our Community</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-yellow-400">50+</div>
            <div className="text-purple-200">Projects Completed</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-yellow-400">25+</div>
            <div className="text-purple-200">Awards Won</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-yellow-400">100K+</div>
            <div className="text-purple-200">Stories Shared</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-yellow-400">5+</div>
            <div className="text-purple-200">Years Experience</div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-20 w-16 h-16 bg-orange-400 rounded-full opacity-20 animate-pulse delay-500"></div>
    </div>
  )
}
