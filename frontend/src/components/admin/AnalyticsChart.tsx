'use client'

import { useState, useEffect } from 'react'

interface ChartData {
  label: string
  value: number
  color?: string
}

interface AnalyticsChartProps {
  data: ChartData[]
  type: 'line' | 'bar' | 'donut'
  title: string
  height?: number
}

export default function AnalyticsChart({ data, type, title, height = 200 }: AnalyticsChartProps) {
  const [mounted, setMounted] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)

  useEffect(() => {
    setMounted(true)
    // Animate chart on mount
    const timer = setTimeout(() => {
      setAnimationProgress(100)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className={`bg-gray-200 rounded`} style={{ height }}></div>
        </div>
      </div>
    )
  }

  const maxValue = Math.max(...data.map(d => d.value))

  const renderLineChart = () => {
    const width = 400
    const chartHeight = height - 40
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * width
      const y = chartHeight - (item.value / maxValue) * chartHeight
      return `${x},${y}`
    })

    return (
      <div className="relative">
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          {/* Grid lines */}
          {[...Array(5)].map((_, i) => (
            <line
              key={i}
              x1="0"
              y1={i * (chartHeight / 4)}
              x2={width}
              y2={i * (chartHeight / 4)}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          ))}
          
          {/* Area fill */}
          <path
            d={`M 0,${chartHeight} L ${points.join(' L ')} L ${width},${chartHeight} Z`}
            fill="url(#gradient)"
            opacity="0.3"
            style={{
              transition: 'all 1s ease-out',
              transform: `scaleY(${animationProgress / 100})`
            }}
          />
          
          {/* Line */}
          <path
            d={`M ${points.join(' L ')}`}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 1000,
              strokeDashoffset: 1000 - (animationProgress / 100) * 1000,
              transition: 'stroke-dashoffset 2s ease-out'
            }}
          />
          
          {/* Data points */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * width
            const y = chartHeight - (item.value / maxValue) * chartHeight
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill="#8b5cf6"
                stroke="white"
                strokeWidth="2"
                style={{
                  opacity: animationProgress / 100,
                  transition: `opacity 0.5s ease-out ${index * 0.1}s`
                }}
              />
            )
          })}
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Labels */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {data.map((item, index) => (
            <span key={index}>{item.label}</span>
          ))}
        </div>
      </div>
    )
  }

  const renderBarChart = () => {
    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-20 text-sm text-gray-600 truncate">{item.label}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-medium">{item.value.toLocaleString()}</span>
                <span className="text-gray-500">{((item.value / maxValue) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                    item.color || 'bg-gradient-to-r from-blue-500 to-purple-500'
                  }`}
                  style={{ 
                    width: `${(item.value / maxValue) * (animationProgress / 100) * 100}%`,
                    transitionDelay: `${index * 0.1}s`
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderDonutChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    let cumulativePercentage = 0
    
    return (
      <div className="flex items-center justify-center">
        <div className="relative">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100
              const strokeDasharray = `${percentage * (animationProgress / 100)} ${100 - percentage}`
              const strokeDashoffset = -cumulativePercentage
              
              const result = (
                <circle
                  key={index}
                  cx="100"
                  cy="100"
                  r="80"
                  fill="transparent"
                  stroke={item.color || `hsl(${index * 60}, 70%, 50%)`}
                  strokeWidth="20"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90 100 100)"
                  style={{
                    transition: 'stroke-dasharray 1s ease-out',
                    transitionDelay: `${index * 0.2}s`
                  }}
                />
              )
              
              cumulativePercentage += percentage
              return result
            })}
            
            {/* Center text */}
            <text x="100" y="100" textAnchor="middle" dy="0.3em" className="text-lg font-bold fill-gray-700">
              {total.toLocaleString()}
            </text>
            <text x="100" y="120" textAnchor="middle" dy="0.3em" className="text-sm fill-gray-500">
              Total
            </text>
          </svg>
          
          {/* Legend */}
          <div className="absolute -right-32 top-0 space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color || `hsl(${index * 60}, 70%, 50%)` }}
                ></div>
                <span className="text-sm text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {type === 'line' && renderLineChart()}
      {type === 'bar' && renderBarChart()}
      {type === 'donut' && renderDonutChart()}
    </div>
  )
}
