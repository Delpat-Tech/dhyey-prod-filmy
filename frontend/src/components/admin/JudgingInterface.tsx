'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, Star, FileText, User, Calendar, Download, 
  ChevronLeft, ChevronRight, Award, MessageSquare, Check,
  Save, X, ThumbsUp, ThumbsDown, Eye
} from 'lucide-react'

interface JudgingInterfaceProps {
  competitionId: string
}

// Mock submissions data
const mockSubmissions = [
  {
    id: 1,
    entryTitle: "The New Dawn",
    authorName: "Anonymous Entry #1",
    submittedDate: "2024-02-15T10:30:00",
    fileUrl: "/submissions/entry-1.pdf",
    description: "A story about finding hope in unexpected places during the darkest times of life.",
    wordCount: 987,
    status: "Pending Review",
    scores: null,
    judgeNotes: null
  },
  {
    id: 2,
    entryTitle: "Fresh Start",
    authorName: "Anonymous Entry #2",
    submittedDate: "2024-02-14T15:20:00",
    fileUrl: "/submissions/entry-2.pdf",
    description: "An immigrant's journey to building a new life in a foreign land.",
    wordCount: 1024,
    status: "Pending Review",
    scores: null,
    judgeNotes: null
  },
  {
    id: 3,
    entryTitle: "Beginning Again",
    authorName: "Anonymous Entry #3",
    submittedDate: "2024-02-13T09:15:00",
    fileUrl: "/submissions/entry-3.pdf",
    description: "A widow discovers love and purpose through an unexpected friendship.",
    wordCount: 945,
    status: "Scored",
    scores: {
      originality: 8.5,
      narrative: 7.0,
      character: 8.0,
      theme: 9.0,
      total: 32.5
    },
    judgeNotes: "Strong emotional depth and excellent character development. Theme is well executed."
  }
]

const judgingCriteria = [
  { id: 'originality', name: 'Originality', weight: 30, maxScore: 10 },
  { id: 'narrative', name: 'Narrative Structure', weight: 25, maxScore: 10 },
  { id: 'character', name: 'Character Development', weight: 25, maxScore: 10 },
  { id: 'theme', name: 'Theme Interpretation', weight: 20, maxScore: 10 }
]

export default function JudgingInterface({ competitionId }: JudgingInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [scores, setScores] = useState<Record<string, number>>({})
  const [judgeNotes, setJudgeNotes] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)

  const currentSubmission = mockSubmissions[currentIndex]
  const hasNextSubmission = currentIndex < mockSubmissions.length - 1
  const hasPrevSubmission = currentIndex > 0

  const handleScoreChange = (criteriaId: string, score: number) => {
    setScores(prev => ({ ...prev, [criteriaId]: score }))
  }

  const calculateTotalScore = () => {
    return Object.values(scores).reduce((sum, score) => sum + score, 0)
  }

  const calculateWeightedScore = () => {
    return judgingCriteria.reduce((total, criteria) => {
      const score = scores[criteria.id] || 0
      return total + (score * criteria.weight / criteria.maxScore)
    }, 0)
  }

  const handleSubmitScore = () => {
    // Validate all criteria are scored
    const allScored = judgingCriteria.every(c => scores[c.id] !== undefined)
    if (!allScored) {
      alert('Please score all criteria before submitting')
      return
    }
    setShowConfirmation(true)
  }

  const confirmSubmit = () => {
    // API call to save scores
    console.log('Submitting scores:', { scores, judgeNotes })
    setShowConfirmation(false)
    
    // Move to next submission
    if (hasNextSubmission) {
      setCurrentIndex(prev => prev + 1)
      setScores({})
      setJudgeNotes('')
    }
  }

  const navigateSubmission = (direction: 'prev' | 'next') => {
    if (direction === 'next' && hasNextSubmission) {
      setCurrentIndex(prev => prev + 1)
    } else if (direction === 'prev' && hasPrevSubmission) {
      setCurrentIndex(prev => prev - 1)
    }
    setScores({})
    setJudgeNotes('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/admin/competitions`}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="font-medium">Back to Competitions</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Judging Interface</h1>
                <p className="text-sm text-gray-600">Short Story Challenge 2024</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-gray-600">Progress: </span>
                <span className="font-semibold text-purple-600">
                  {mockSubmissions.filter(s => s.status === 'Scored').length}/{mockSubmissions.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Submission View */}
          <div className="lg:col-span-2 space-y-6">
            {/* Navigation */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigateSubmission('prev')}
                  disabled={!hasPrevSubmission}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                  Previous
                </button>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    Entry {currentIndex + 1} of {mockSubmissions.length}
                  </div>
                  <div className="text-sm text-gray-600">
                    {currentSubmission.status === 'Scored' ? (
                      <span className="flex items-center justify-center gap-1 text-green-600">
                        <Check size={16} />
                        Already Scored
                      </span>
                    ) : (
                      'Pending Review'
                    )}
                  </div>
                </div>

                <button
                  onClick={() => navigateSubmission('next')}
                  disabled={!hasNextSubmission}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Submission Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {currentSubmission.entryTitle}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User size={16} />
                      {currentSubmission.authorName}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      {new Date(currentSubmission.submittedDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText size={16} />
                      {currentSubmission.wordCount} words
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                  <Download size={18} />
                  Download
                </button>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{currentSubmission.description}</p>
              </div>

              {/* Document Viewer Placeholder */}
              <div className="bg-gray-100 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
                <FileText size={48} className="text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium mb-2">Document Preview</p>
                <p className="text-sm text-gray-500 mb-4">
                  Click below to view the full submission in a new tab
                </p>
                <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto">
                  <Eye size={18} />
                  View Full Document
                </button>
              </div>
            </div>

            {/* Previous Scores (if already scored) */}
            {currentSubmission.scores && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <Award size={20} />
                  Previous Scores
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {Object.entries(currentSubmission.scores).map(([key, value]) => {
                    if (key === 'total') return null
                    return (
                      <div key={key} className="bg-white rounded-lg p-3 text-center">
                        <div className="text-sm text-gray-600 capitalize mb-1">{key}</div>
                        <div className="text-2xl font-bold text-blue-600">{value}</div>
                      </div>
                    )
                  })}
                </div>
                {currentSubmission.judgeNotes && (
                  <div className="bg-white rounded-lg p-4">
                    <div className="font-semibold text-gray-900 mb-2">Judge's Notes:</div>
                    <p className="text-gray-700">{currentSubmission.judgeNotes}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Scoring Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Scoring Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Star className="text-yellow-500" />
                  Score This Entry
                </h3>

                <div className="space-y-6">
                  {judgingCriteria.map((criteria) => (
                    <div key={criteria.id}>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold text-gray-900">
                          {criteria.name}
                        </label>
                        <span className="text-xs text-gray-500">{criteria.weight}%</span>
                      </div>
                      
                      {/* Star Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(10)].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => handleScoreChange(criteria.id, i + 1)}
                            className="focus:outline-none"
                          >
                            <Star
                              size={24}
                              className={`transition-colors ${
                                (scores[criteria.id] || 0) > i
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Score:</span>
                        <span className="font-bold text-purple-600">
                          {scores[criteria.id] || 0}/{criteria.maxScore}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Score */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">Total Score</span>
                      <span className="text-3xl font-bold text-purple-600">
                        {calculateTotalScore().toFixed(1)}/40
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Weighted Score</span>
                      <span className="font-bold text-purple-600">
                        {calculateWeightedScore().toFixed(1)}/100
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Judge Notes */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare size={20} />
                  Judge's Notes
                </h3>
                <textarea
                  value={judgeNotes}
                  onChange={(e) => setJudgeNotes(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Add your feedback and comments about this entry..."
                />
                <p className="text-xs text-gray-500 mt-2">
                  These notes will be shared with the competition organizers
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleSubmitScore}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  Submit Score
                </button>
                <button
                  className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  Save Draft
                </button>
              </div>

              {/* Quick Actions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 text-sm mb-2">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-yellow-100 rounded transition-colors">
                    Flag for Review
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-yellow-100 rounded transition-colors">
                    Disqualify Entry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award size={32} className="text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Score Submission</h2>
              <p className="text-gray-600">
                Are you sure you want to submit this score? This action cannot be undone.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {judgingCriteria.map(criteria => (
                  <div key={criteria.id}>
                    <span className="text-gray-600">{criteria.name}:</span>
                    <span className="font-semibold text-gray-900 ml-1">
                      {scores[criteria.id]}/10
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex justify-between font-bold">
                  <span>Total Score:</span>
                  <span className="text-purple-600">{calculateWeightedScore().toFixed(1)}/100</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
