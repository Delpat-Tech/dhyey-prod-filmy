'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface MetricsWidgetProps {
  title: string
  value: number | string
  change?: number
  trend?: 'up' | 'down' | 'neutral'
  icon: React.ComponentType<{ className?: string }>
  gradient: string
  prefix?: string
  suffix?: string
  description?: string
  target?: number
  sparklineData?: number[]
}

export default function MetricsWidget({
  title,
  value,
  change,
  trend = 'neutral',
  icon: Icon,
  gradient,
  prefix = '',
  suffix = '',
  description,
  target,
  sparklineData = []
}: MetricsWidgetProps) {
  const [mounted, setMounted] = useState(false)
  const [animatedValue, setAnimatedValue] = useState(0)

  useEffect(() => {
    setMounted(true)
    
    if (typeof value === 'number') {
      // Animate number counting
      const duration = 1500
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
    }
  }, [value])

  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val
    
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1)}M`
    }
    if (val >= 1000) {
      return `${(val / 1000).toFixed(1)}K`
    }
    return val.toLocaleString()
  }

  const generateSparkline = () => {
    if (sparklineData.length < 2) return null

    const width = 80
    const height = 30
    const max = Math.max(...sparklineData)
    const min = Math.min(...sparklineData)
    const range = max - min || 1

    const points = sparklineData.map((point, index) => {
      const x = (index / (sparklineData.length - 1)) * width
      const y = height - ((point - min) / range) * height
      return `${x},${y}`
    })

    return (
      <svg width={width} height={height} className="opacity-60">
        <path
          d={`M ${points.join(' L ')}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="drop-shadow-sm"
        />
        {sparklineData.map((point, index) => {
          const x = (index / (sparklineData.length - 1)) * width
          const y = height - ((point - min) / range) * height
          
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="1.5"
              fill="currentColor"
              className="opacity-80"
            />
          )
        })}
      </svg>
    )
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

  const displayValue = typeof value === 'number' ? animatedValue : value
  const progressPercentage = target ? Math.min((typeof value === 'number' ? value : 0) / target * 100, 100) : 0

  return (
    <div className={`relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl group cursor-pointer ${gradient}`}>
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full -translate-y-12 translate-x-12"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-bold text-white">
                {prefix}{formatValue(displayValue)}{suffix}
              </span>
              {change !== undefined && (
                <div className={`flex items-center ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  trend === 'up' ? 'bg-green-500/20 text-green-100' :
                  trend === 'down' ? 'bg-red-500/20 text-red-100' :
                  'bg-gray-500/20 text-gray-100'
                }`}>
                  {trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                  {trend === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
                  {trend === 'neutral' && <Minus className="h-3 w-3 mr-1" />}
                  <span>{Math.abs(change)}%</span>
                </div>
              )}
            </div>
            {description && (
              <p className="text-xs text-white/70 mt-1">{description}</p>
            )}
          </div>
          
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-colors">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Progress Bar (if target is provided) */}
        {target && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-white/70 mb-1">
              <span>Progress to target</span>
              <span>{progressPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-white/60 rounded-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${progressPercentage}%`,
                  animationDelay: '500ms'
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Bottom Section */}
        <div className="flex items-center justify-between">
          {change !== undefined && (
            <div className="text-xs text-white/80">
              {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} vs last period
            </div>
          )}
          
          {sparklineData.length > 0 && (
            <div className="text-white/80">
              {generateSparkline()}
            </div>
          )}
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
      
      {/* Pulse Animation for Real-time Data */}
      <div className="absolute top-2 right-2 w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
    </div>
  )
}
