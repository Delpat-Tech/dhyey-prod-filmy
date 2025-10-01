'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number
  change: number
  changeType: 'percentage' | 'absolute'
  trend: 'up' | 'down'
  icon: React.ComponentType<{ className?: string }>
  gradient: string
  sparklineData: number[]
  prefix?: string
  suffix?: string
}

export default function StatCard({
  title,
  value,
  change,
  changeType,
  trend,
  icon: Icon,
  gradient,
  sparklineData,
  prefix = '',
  suffix = ''
}: StatCardProps) {
  const [mounted, setMounted] = useState(false)
  const [animatedValue, setAnimatedValue] = useState(0)

  useEffect(() => {
    setMounted(true)
    // Animate the value counting up
    const duration = 1000
    const steps = 60
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setAnimatedValue(value)
        clearInterval(timer)
      } else {
        setAnimatedValue(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  const formatValue = (val: number) => {
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1)}M`
    }
    if (val >= 1000) {
      return `${(val / 1000).toFixed(1)}K`
    }
    return val.toLocaleString()
  }

  const formatChange = (val: number) => {
    const sign = val >= 0 ? '+' : ''
    if (changeType === 'percentage') {
      return `${sign}${val}%`
    }
    return `${sign}${val}`
  }

  // Generate SVG path for sparkline
  const generateSparklinePath = (data: number[]) => {
    if (data.length < 2) return ''
    
    const width = 60
    const height = 20
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1

    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * width
      const y = height - ((point - min) / range) * height
      return `${x},${y}`
    })

    return `M ${points.join(' L ')}`
  }

  if (!mounted) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-16 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden rounded-xl border border-gray-200 p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl group cursor-pointer ${gradient}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
            <p className="text-3xl font-bold text-white">
              {prefix}{formatValue(animatedValue)}{suffix}
            </p>
          </div>
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-colors">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-white/70 mb-1">
            <span>Monthly Progress</span>
            <span>{Math.abs(change)}% {trend === 'up' ? 'increase' : 'decrease'}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                trend === 'up' ? 'bg-green-400' : 'bg-red-400'
              }`}
              style={{ 
                width: `${Math.min(Math.abs(change), 100)}%`,
                animationDelay: '500ms'
              }}
            ></div>
          </div>
        </div>

        {/* Trend and Sparkline */}
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            trend === 'up' 
              ? 'bg-green-500/20 text-green-100' 
              : 'bg-red-500/20 text-red-100'
          }`}>
            {trend === 'up' ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>{formatChange(change)} from last month</span>
          </div>

          {/* Sparkline Chart */}
          <div className="flex items-center space-x-2">
            <svg width="60" height="20" className="opacity-80">
              <path
                d={generateSparklinePath(sparklineData)}
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                className="drop-shadow-sm"
              />
              {/* Dots for data points */}
              {sparklineData.map((point, index) => {
                const max = Math.max(...sparklineData)
                const min = Math.min(...sparklineData)
                const range = max - min || 1
                const x = (index / (sparklineData.length - 1)) * 60
                const y = 20 - ((point - min) / range) * 20
                
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="1.5"
                    fill="white"
                    className="opacity-60"
                  />
                )
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
    </div>
  )
}
