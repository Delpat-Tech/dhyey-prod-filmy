'use client'

import { forwardRef } from 'react'

interface CheckboxProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
  id?: string
  name?: string
  value?: string
  indeterminate?: boolean
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({
    checked = false,
    onChange,
    disabled = false,
    size = 'md',
    className = '',
    id,
    name,
    value,
    indeterminate = false,
    ...props
  }, ref) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.checked)
      }
    }

    return (
      <div className={`relative inline-flex items-center ${className}`}>
        <input
          ref={ref}
          type="checkbox"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className={`
            ${sizeClasses[size]}
            appearance-none
            border-2
            rounded-md
            cursor-pointer
            transition-all
            duration-200
            ease-in-out
            focus:outline-none
            focus:ring-2
            focus:ring-purple-500
            focus:ring-offset-2
            ${checked
              ? 'bg-gradient-to-br from-purple-600 to-indigo-600 border-purple-600 shadow-sm'
              : 'bg-white border-gray-300 hover:border-purple-400'
            }
            ${disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:shadow-md'
            }
            ${indeterminate
              ? 'bg-gradient-to-br from-purple-600 to-indigo-600 border-purple-600'
              : ''
            }
          `}
          {...props}
        />

        {/* Checkmark Icon */}
        {checked && !indeterminate && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg
              className={`text-white ${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}

        {/* Indeterminate Icon */}
        {indeterminate && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={`bg-white rounded-sm ${size === 'sm' ? 'w-2 h-0.5' : size === 'md' ? 'w-2.5 h-0.5' : 'w-3 h-0.5'}`} />
          </div>
        )}

        {/* Hover Effect */}
        {!disabled && !checked && (
          <div className="absolute inset-0 rounded-md bg-purple-50 opacity-0 hover:opacity-20 transition-opacity duration-200 pointer-events-none" />
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
