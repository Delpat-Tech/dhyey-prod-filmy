'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trophy, Calendar, Users, ArrowRight, Star } from 'lucide-react'

const currentCompetitions = [
  {
    id: 1,
    title: "Short Story Challenge 2024",
    description: "Write a compelling short story in under 1000 words. Theme: 'New Beginnings'",
    deadline: "March 15, 2024",
    prize: "$5,000 + Publication",
    participants: 234,
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop",
    status: "Open"
  },
  {
    id: 2,
    title: "Young Filmmaker Award",
    description: "Create a 5-minute film showcasing your unique perspective on modern life.",
    deadline: "April 30, 2024",
    prize: "$10,000 + Mentorship",
    participants: 89,
    image: "https://images.unsplash.com/photo-1489599904472-84b0e19e8b0c?w=400&h=300&fit=crop",
    status: "Open"
  }
]

const pastWinners = [
  {
    name: "Emma Thompson",
    title: "The Last Letter",
    competition: "Short Story Challenge 2023",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face",
    quote: "Winning this competition changed my life and gave me the confidence to pursue writing professionally."
  },
  {
    name: "Marcus Chen",
    title: "Digital Dreams",
    competition: "Young Filmmaker Award 2023",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    quote: "The mentorship program helped me develop my skills and connect with industry professionals."
  },
  {
    name: "Sofia Rodriguez",
    title: "Voices Unheard",
    competition: "Documentary Challenge 2023",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    quote: "This platform gave me the opportunity to share important stories that needed to be told."
  }
]

export default function CompetitionsSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Competitions & Awards
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Join our creative competitions and showcase your talent to a global audience. 
            Win prizes, gain recognition, and connect with fellow creators.
          </p>
        </div>

        {/* Current Competitions */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Current Competitions</h3>
            <Link 
              href="/competitions"
              className="text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {currentCompetitions.map((competition) => (
              <div key={competition.id} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl overflow-hidden border border-purple-100 hover:shadow-lg transition-shadow">
                {/* Competition Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={competition.image}
                    alt={competition.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {competition.status}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <div className="flex items-center space-x-1 text-sm font-medium text-gray-900">
                        <Users size={14} />
                        <span>{competition.participants}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Competition Info */}
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {competition.title}
                  </h4>
                  <p className="text-gray-600 mb-4">
                    {competition.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      <span>Deadline: {competition.deadline}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Trophy size={16} />
                      <span>Prize: {competition.prize}</span>
                    </div>
                  </div>

                  <Link 
                    href={`/competitions/${competition.id}`}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all text-center block"
                  >
                    Enter Competition
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hall of Fame */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Hall of Fame
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Celebrating our past winners and their incredible contributions to the creative community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pastWinners.map((winner, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
                {/* Winner Image */}
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <Image
                    src={winner.image}
                    alt={winner.name}
                    fill
                    className="rounded-full object-cover"
                  />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Star size={16} className="text-yellow-800 fill-yellow-800" />
                  </div>
                </div>

                <h4 className="font-bold text-gray-900 mb-1">{winner.name}</h4>
                <h5 className="text-purple-600 font-medium mb-2">"{winner.title}"</h5>
                <p className="text-sm text-gray-500 mb-4">{winner.competition}</p>
                
                <blockquote className="text-sm text-gray-600 italic">
                  "{winner.quote}"
                </blockquote>
              </div>
            ))}
          </div>

          {/* View All Winners */}
          <div className="text-center mt-12">
            <Link 
              href="/competitions/winners"
              className="inline-flex items-center space-x-2 border-2 border-purple-500 text-purple-600 px-8 py-3 rounded-full font-medium hover:bg-purple-500 hover:text-white transition-all"
            >
              <Trophy size={16} />
              <span>View All Winners</span>
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 md:p-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Showcase Your Talent?
          </h3>
          <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who have found their voice through our competitions. 
            Your story could be the next one we celebrate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/competitions"
              className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
            >
              Browse Competitions
            </Link>
            <Link 
              href="/register"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-purple-600 transition-all"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
