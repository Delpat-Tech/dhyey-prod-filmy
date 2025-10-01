'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Trophy, Calendar, Users, Clock, ArrowLeft, CheckCircle2, 
  Award, FileText, Upload, X, Star, TrendingUp, Target 
} from 'lucide-react'
import SubmissionForm from './SubmissionForm'
import CountdownTimer from './CountdownTimer'

interface CompetitionDetailProps {
  competitionId: string
}

// Mock data - Replace with API call
const getCompetitionData = (id: string) => ({
  id: parseInt(id),
  title: "Short Story Challenge 2024",
  description: "Write a compelling short story in under 1000 words. Theme: 'New Beginnings'",
  longDescription: `This competition seeks to discover new voices in short fiction. Write a story that explores the theme of new beginnings in any genre. Your story should be original, engaging, and demonstrate strong narrative skills.
  
We're looking for stories that:
• Showcase unique perspectives and fresh voices
• Demonstrate strong character development
• Feature compelling narrative arcs
• Explore the theme creatively and meaningfully

This is your opportunity to share your story with thousands of readers and industry professionals.`,
  deadline: "2024-03-15T23:59:59",
  startDate: "2024-01-01T00:00:00",
  prize: "$5,000 + Publication",
  prizeDetails: {
    first: { amount: "$5,000", extra: "Publication in our annual anthology + Featured author profile" },
    second: { amount: "$2,000", extra: "Online feature + Editorial feedback" },
    third: { amount: "$1,000", extra: "Honorable mention + Certificate" }
  },
  participants: 234,
  maxParticipants: 500,
  image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=600&fit=crop",
  status: "Open",
  category: "Writing",
  difficulty: "Intermediate",
  requirements: [
    "Original story between 500-1000 words",
    "Theme must be 'New Beginnings'",
    "Submit in PDF or DOCX format",
    "One entry per person",
    "English language only",
    "Previously unpublished work"
  ],
  guidelines: [
    "All submissions must be received by 11:59 PM on the deadline date",
    "Entries will be judged anonymously",
    "Winners will be announced within 30 days of the deadline",
    "By submitting, you grant us first publication rights",
    "Retain all other rights to your work"
  ],
  judgingCriteria: [
    { name: "Originality", weight: 30, description: "Unique voice and fresh perspective" },
    { name: "Narrative Structure", weight: 25, description: "Well-crafted plot and pacing" },
    { name: "Character Development", weight: 25, description: "Compelling and believable characters" },
    { name: "Theme Interpretation", weight: 20, description: "Creative exploration of 'New Beginnings'" }
  ],
  judges: [
    { 
      name: "Sarah Williams", 
      role: "Award-winning Author", 
      bio: "Pulitzer Prize winner and bestselling author of 5 novels",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop" 
    },
    { 
      name: "James Chen", 
      role: "Literary Critic", 
      bio: "Senior editor at Literary Review Magazine",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" 
    },
    { 
      name: "Maya Rodriguez", 
      role: "Publisher", 
      bio: "Founder of Emerging Voices Publishing",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop" 
    }
  ],
  submissions: 156,
  timeline: [
    { event: "Competition Opens", date: "2024-01-01", status: "completed" },
    { event: "Early Bird Deadline", date: "2024-02-01", status: "completed" },
    { event: "Final Submission Deadline", date: "2024-03-15", status: "upcoming" },
    { event: "Judging Period", date: "2024-03-16 - 2024-04-15", status: "upcoming" },
    { event: "Winners Announced", date: "2024-04-20", status: "upcoming" }
  ],
  faqs: [
    {
      question: "Can I submit multiple entries?",
      answer: "No, only one entry per person is allowed for this competition."
    },
    {
      question: "What format should I submit my story in?",
      answer: "Please submit your story in PDF or DOCX format. Make sure your document is properly formatted with standard fonts and margins."
    },
    {
      question: "Can I submit a story that was previously published on my blog?",
      answer: "No, we only accept previously unpublished work. This includes personal blogs, Medium, and other online platforms."
    },
    {
      question: "When will winners be announced?",
      answer: "Winners will be announced approximately 30 days after the submission deadline, around April 20, 2024."
    },
    {
      question: "Do I retain rights to my work?",
      answer: "Yes, you retain all rights except first publication rights, which you grant to us if you win."
    }
  ]
})

export default function CompetitionDetail({ competitionId }: CompetitionDetailProps) {
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'rules' | 'judges' | 'faqs'>('overview')
  const competition = getCompetitionData(competitionId)

  const progressPercentage = (competition.participants / competition.maxParticipants) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src={competition.image}
          alt={competition.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
        
        {/* Breadcrumb */}
        <div className="absolute top-8 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4">
            <Link 
              href="/competitions"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Competitions</span>
            </Link>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 pb-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`${
                competition.status === 'Open' ? 'bg-green-500' : 'bg-yellow-500'
              } text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg`}>
                {competition.status}
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                {competition.category}
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                {competition.difficulty}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {competition.title}
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl">
              {competition.description}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
              <div className="flex border-b border-gray-200 overflow-x-auto">
                {(['overview', 'rules', 'judges', 'faqs'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 font-medium capitalize whitespace-nowrap transition-colors ${
                      activeTab === tab
                        ? 'text-purple-600 border-b-2 border-purple-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-8">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Competition</h2>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {competition.longDescription}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Requirements</h3>
                      <ul className="space-y-2">
                        {competition.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Judging Criteria</h3>
                      <div className="space-y-4">
                        {competition.judgingCriteria.map((criteria, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">{criteria.name}</h4>
                              <span className="text-purple-600 font-bold">{criteria.weight}%</span>
                            </div>
                            <p className="text-sm text-gray-600">{criteria.description}</p>
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                                style={{ width: `${criteria.weight}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Timeline</h3>
                      <div className="space-y-4">
                        {competition.timeline.map((item, index) => (
                          <div key={index} className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              item.status === 'completed' 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-purple-100 text-purple-600'
                            }`}>
                              {item.status === 'completed' ? (
                                <CheckCircle2 size={20} />
                              ) : (
                                <Clock size={20} />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{item.event}</h4>
                              <p className="text-sm text-gray-600">{item.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Rules Tab */}
                {activeTab === 'rules' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Competition Rules</h2>
                      <div className="space-y-4">
                        {competition.requirements.map((req, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                            <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                              {index + 1}
                            </div>
                            <span className="text-gray-700">{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Guidelines</h3>
                      <ul className="space-y-3">
                        {competition.guidelines.map((guideline, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <FileText size={18} className="text-purple-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{guideline}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Judges Tab */}
                {activeTab === 'judges' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Meet Our Judges</h2>
                    <div className="space-y-6">
                      {competition.judges.map((judge, index) => (
                        <div key={index} className="flex gap-6 p-6 bg-gray-50 rounded-xl">
                          <img
                            src={judge.image}
                            alt={judge.name}
                            className="w-24 h-24 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{judge.name}</h3>
                            <p className="text-purple-600 font-medium mb-3">{judge.role}</p>
                            <p className="text-gray-700">{judge.bio}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FAQs Tab */}
                {activeTab === 'faqs' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                      {competition.faqs.map((faq, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                          <p className="text-gray-700">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Countdown Timer */}
              <CountdownTimer deadline={competition.deadline} />

              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Users size={18} />
                      Participants
                    </span>
                    <span className="font-bold text-gray-900">{competition.participants}/{competition.maxParticipants}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-600 flex items-center gap-2">
                      <FileText size={18} />
                      Submissions
                    </span>
                    <span className="font-bold text-gray-900">{competition.submissions}</span>
                  </div>
                </div>
              </div>

              {/* Prize Pool */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="text-yellow-600" size={24} />
                  <h3 className="font-bold text-gray-900">Prize Pool</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
                      <span className="text-sm font-bold text-yellow-900">1st</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">{competition.prizeDetails.first.amount}</div>
                      <div className="text-sm text-gray-600">{competition.prizeDetails.first.extra}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-700">2nd</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">{competition.prizeDetails.second.amount}</div>
                      <div className="text-sm text-gray-600">{competition.prizeDetails.second.extra}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">3rd</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">{competition.prizeDetails.third.amount}</div>
                      <div className="text-sm text-gray-600">{competition.prizeDetails.third.extra}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => setShowSubmissionForm(true)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
              >
                Enter Competition
              </button>

              {/* Share */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Share</h3>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    Facebook
                  </button>
                  <button className="flex-1 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                    Twitter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Form Modal */}
      {showSubmissionForm && (
        <SubmissionForm 
          competition={competition}
          onClose={() => setShowSubmissionForm(false)}
        />
      )}
    </div>
  )
}
