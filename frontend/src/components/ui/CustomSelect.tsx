'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export interface SelectOption {
  label: string
  value: string
  emoji?: string
  desc?: string
  disabled?: boolean
}

interface CustomSelectProps {
  options: SelectOption[]
  value?: string | string[]
  defaultValue?: string | string[]
  placeholder?: string
  mode?: 'single' | 'multiple'
  style?: React.CSSProperties
  className?: string
  onChange?: (value: string | string[]) => void
  disabled?: boolean
  optionRender?: (option: SelectOption) => React.ReactNode
}

export default function CustomSelect({
  options,
  value,
  defaultValue,
  placeholder = "Select an option",
  mode = 'single',
  style,
  className = '',
  onChange,
  disabled = false,
  optionRender
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValues, setSelectedValues] = useState<string[]>(() => {
    if (value !== undefined) {
      return Array.isArray(value) ? value : [value]
    }
    if (defaultValue !== undefined) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue]
    }
    return []
  })
  
  const selectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValues(Array.isArray(value) ? value : [value])
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleOptionClick = (optionValue: string) => {
    let newValues: string[]

    if (mode === 'multiple') {
      if (selectedValues.includes(optionValue)) {
        newValues = selectedValues.filter(v => v !== optionValue)
      } else {
        newValues = [...selectedValues, optionValue]
      }
    } else {
      newValues = [optionValue]
      setIsOpen(false)
    }

    setSelectedValues(newValues)
    
    if (onChange) {
      onChange(mode === 'multiple' ? newValues : newValues[0] || '')
    }
  }

  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return placeholder
    }

    if (mode === 'single') {
      const option = options.find(opt => opt.value === selectedValues[0])
      return option?.label || selectedValues[0]
    }

    if (selectedValues.length === 1) {
      const option = options.find(opt => opt.value === selectedValues[0])
      return option?.label || selectedValues[0]
    }

    return `${selectedValues.length} items selected`
  }

  const renderOption = (option: SelectOption) => {
    if (optionRender) {
      return optionRender(option)
    }

    return (
      <div className="flex items-center space-x-2">
        {option.emoji && (
          <span role="img" aria-label={option.label}>
            {option.emoji}
          </span>
        )}
        <span>{option.desc || option.label}</span>
      </div>
    )
  }

  return (
    <div 
      ref={selectRef}
      className={`relative ${className}`}
      style={style}
    >
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-lg
          focus:ring-2 focus:ring-purple-500 focus:border-transparent
          flex items-center justify-between
          ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'hover:border-gray-400 cursor-pointer'}
          ${selectedValues.length === 0 ? 'text-gray-500' : 'text-gray-900'}
        `}
      >
        <span className="truncate">{getDisplayText()}</span>
        <ChevronDown 
          size={16} 
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => !option.disabled && handleOptionClick(option.value)}
              disabled={option.disabled}
              className={`
                w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors
                flex items-center justify-between
                ${option.disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'}
                ${selectedValues.includes(option.value) ? 'bg-purple-50 text-purple-700' : ''}
              `}
            >
              <div className="flex-1">
                {renderOption(option)}
              </div>
              {selectedValues.includes(option.value) && (
                <Check size={16} className="text-purple-600 ml-2" />
              )}
            </button>
          ))}
          {options.length === 0 && (
            <div className="px-3 py-2 text-gray-500 text-center">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  )
}
