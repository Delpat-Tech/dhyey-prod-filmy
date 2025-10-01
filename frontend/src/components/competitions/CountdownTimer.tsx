'use client'

import { useState, useEffect } from 'react'
import { Clock, AlertCircle } from 'lucide-react'

interface CountdownTimerProps {
  deadline: string
}

export default function CountdownTimer({ deadline }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const deadlineTime = new Date(deadline).getTime()
      const distance = deadlineTime - now

      if (distance < 0) {
        setIsExpired(true)
        return
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      })
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [deadline])

  if (isExpired) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <AlertCircle className="text-red-600" size={24} />
          <h3 className="font-bold text-red-900">Competition Closed</h3>
        </div>
        <p className="text-red-700">This competition has ended and is no longer accepting submissions.</p>
      </div>
    )
  }

  const isUrgent = timeLeft.days < 3

  return (
    <div className={`rounded-xl p-6 ${
      isUrgent 
        ? 'bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200' 
        : 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <Clock className={isUrgent ? 'text-red-600' : 'text-purple-600'} size={24} />
        <h3 className="font-bold text-gray-900">Time Remaining</h3>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="text-center">
          <div className={`text-2xl md:text-3xl font-bold mb-1 ${
            isUrgent ? 'text-red-600' : 'text-purple-600'
          }`}>
            {timeLeft.days}
          </div>
          <div className="text-xs text-gray-600 font-medium">Days</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl md:text-3xl font-bold mb-1 ${
            isUrgent ? 'text-red-600' : 'text-purple-600'
          }`}>
            {timeLeft.hours}
          </div>
          <div className="text-xs text-gray-600 font-medium">Hours</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl md:text-3xl font-bold mb-1 ${
            isUrgent ? 'text-red-600' : 'text-purple-600'
          }`}>
            {timeLeft.minutes}
          </div>
          <div className="text-xs text-gray-600 font-medium">Minutes</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl md:text-3xl font-bold mb-1 ${
            isUrgent ? 'text-red-600' : 'text-purple-600'
          }`}>
            {timeLeft.seconds}
          </div>
          <div className="text-xs text-gray-600 font-medium">Seconds</div>
        </div>
      </div>

      {isUrgent && (
        <div className="bg-red-100 border border-red-300 rounded-lg p-3 text-center">
          <p className="text-sm font-semibold text-red-800">
            ⚠️ Hurry! Less than 3 days left to submit!
          </p>
        </div>
      )}

      {!isUrgent && (
        <div className="text-center text-sm text-gray-600">
          Deadline: {new Date(deadline).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      )}
    </div>
  )
}
