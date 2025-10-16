'use client'

import { Clock, Trophy, Sparkles, Calendar, Users, Award, Star, Heart, Zap, Target } from 'lucide-react'

export default function ComingSoonCompetitionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-200 rounded-full opacity-20 animate-bounce" style={{ animationDuration: '3s' }}></div>
        <div className="absolute bottom-32 left-20 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-pink-200 rounded-full opacity-20 animate-bounce" style={{ animationDuration: '4s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header Section */}
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full mb-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Competitions
            </h1>
            <p className="text-2xl text-gray-600 mb-8 leading-relaxed">
              Exciting competitions are coming soon to DHEY Productions!
            </p>
            <div className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-lg">
              <Sparkles className="w-5 h-5 text-yellow-500 mr-2" />
              <span className="text-gray-700 font-medium">Launching Soon</span>
            </div>
          </div>

          {/* Coming Soon Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 mb-12 border border-gray-100 backdrop-blur-sm bg-white/90">
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center animate-pulse">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Coming Soon!
            </h2>

            <p className="text-gray-600 mb-8 leading-relaxed text-lg max-w-2xl mx-auto">
              We're crafting something extraordinary! Get ready for amazing competitions where talented writers and creators can showcase their skills,
              compete for exciting prizes, and connect with the DHEY Productions community.
            </p>

            {/* Feature Preview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 border border-purple-200">
                <Award className="w-8 h-8 text-purple-600 mb-4 group-hover:animate-bounce" />
                <div className="text-left">
                  <div className="font-bold text-gray-900 mb-2">Amazing Prizes</div>
                  <div className="text-sm text-gray-600">Cash rewards & recognition</div>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 border border-indigo-200">
                <Users className="w-8 h-8 text-indigo-600 mb-4 group-hover:animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="text-left">
                  <div className="font-bold text-gray-900 mb-2">Community Driven</div>
                  <div className="text-sm text-gray-600">Connect with creators</div>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 border border-blue-200">
                <Calendar className="w-8 h-8 text-blue-600 mb-4 group-hover:animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="text-left">
                  <div className="font-bold text-gray-900 mb-2">Regular Events</div>
                  <div className="text-sm text-gray-600">Monthly competitions</div>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 border border-green-200">
                <Sparkles className="w-8 h-8 text-green-600 mb-4 group-hover:animate-bounce" style={{ animationDelay: '0.3s' }} />
                <div className="text-left">
                  <div className="font-bold text-gray-900 mb-2">Creative Challenges</div>
                  <div className="text-sm text-gray-600">Unique writing prompts</div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 rounded-2xl p-8 border border-purple-100">
              <div className="flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-purple-600 mr-2" />
                <h3 className="text-xl font-bold text-gray-900">
                  Stay Tuned!
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Follow our updates and be the first to know when competitions launch.
                Get ready to showcase your creativity and win amazing prizes!
              </p>

              {/* Newsletter Signup Teaser */}
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Get notified when we launch!</span>
                  <Heart className="w-4 h-4 text-red-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Back to Admin */}
          <div className="text-center">
            <a
              href="/admin"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
            >
              <Zap className="w-5 h-5 mr-2" />
              Back to Admin Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
