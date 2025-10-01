'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Trophy, Calendar, Users, Clock, TrendingUp, Award } from 'lucide-react'

interface Competition {
  id: number
  title: string
  description: string
  deadline: string
  prize: string
  participants: number
  maxParticipants: number
  image: string
  status: string
  category: string
  difficulty: string
  submissions: number
}

interface CompetitionCardProps {
  competition: Competition
}

export default function CompetitionCard({ competition }: CompetitionCardProps) {
  const [timeLeft, setTimeLeft] = useState('')
  const [progressPercentage, setProgressPercentage] = useState(0)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const deadline = new Date(competition.deadline).getTime()
      const distance = deadline - now

      if (distance < 0) {
        setTimeLeft('Ended')
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      
      if (days > 0) {
        setTimeLeft(`${days} day${days > 1 ? 's' : ''} left`)
      } else {
        setTimeLeft(`${hours} hour${hours > 1 ? 's' : ''} left`)
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [competition.deadline])

  useEffect(() => {
    setProgressPercentage((competition.participants / competition.maxParticipants) * 100)
  }, [competition.participants, competition.maxParticipants])

  const getStatusColor = () => {
    switch (competition.status) {
      case 'Open':
        return 'bg-green-500'
      case 'Closing Soon':
        return 'bg-yellow-500'
      case 'Closed':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getDifficultyColor = () => {
    switch (competition.difficulty) {
      case 'Beginner':
        return 'text-green-600 bg-green-50'
      case 'Intermediate':
        return 'text-yellow-600 bg-yellow-50'
      case 'Advanced':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 group">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={competition.image}
          alt={competition.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`${getStatusColor()} text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg flex items-center gap-1`}>
            {competition.status === 'Open' && <Clock size={14} className="animate-pulse" />}
            {competition.status}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 right-4">
          <span className="bg-white/90 backdrop-blur-sm text-purple-600 px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            {competition.category}
          </span>
        </div>

        {/* Timer */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-purple-600" />
                <span className="text-sm font-semibold text-gray-900">{timeLeft}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-purple-600" />
                <span className="text-sm font-semibold text-gray-900">
                  {competition.participants}/{competition.maxParticipants}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors flex-1">
            {competition.title}
          </h3>
          <span className={`ml-2 px-2 py-1 rounded-md text-xs font-semibold ${getDifficultyColor()}`}>
            {competition.difficulty}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {competition.description}
        </p>

        {/* Prize */}
        <div className="flex items-center gap-2 mb-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
          <Trophy size={18} className="text-yellow-600" />
          <span className="text-sm font-semibold text-gray-900">Prize: {competition.prize}</span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
            <span>Participation</span>
            <span className="font-semibold">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
            <span>{competition.submissions} submissions</span>
            <span>{competition.maxParticipants - competition.participants} spots left</span>
          </div>
        </div>

        {/* Deadline */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Calendar size={16} />
          <span>Deadline: {new Date(competition.deadline).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })}</span>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3">
          <Link 
            href={`/competitions/${competition.id}`}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all text-center shadow-md hover:shadow-lg"
          >
            Enter Now
          </Link>
          <Link 
            href={`/competitions/${competition.id}`}
            className="px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-purple-500 hover:text-purple-600 transition-all"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  )
}
