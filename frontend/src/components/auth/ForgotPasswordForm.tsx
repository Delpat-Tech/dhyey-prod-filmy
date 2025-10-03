'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowRight, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react'
import { showNotification } from '@/lib/errorHandler'
import { authAPI } from '@/lib/api'

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [error, setError] = useState('')

  const validateEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError('Email is required')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      await authAPI.forgotPassword(email)
      
      setIsEmailSent(true)
      showNotification({
        type: 'success',
        title: 'Reset Link Sent!',
        message: 'Check your email for password reset instructions'
      })
      
    } catch (error: any) {
      showNotification({
        type: 'error',
        title: 'Failed to Send Reset Link',
        message: error.message || 'Something went wrong. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (error) setError('')
  }

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email</h1>
            <p className="text-gray-600">We've sent password reset instructions to</p>
            <p className="text-purple-600 font-medium">{email}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="text-center space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">What's next?</h3>
                <ul className="text-sm text-blue-800 space-y-1 text-left">
                  <li>• Check your email inbox (and spam folder)</li>
                  <li>• Click the reset link in the email</li>
                  <li>• Create a new password</li>
                  <li>• Sign in with your new password</li>
                </ul>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setIsEmailSent(false)}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Try Different Email
                </button>
                
                <Link
                  href="/auth/login"
                  className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Didn't receive the email?{' '}
              <button
                onClick={() => setIsEmailSent(false)}
                className="text-purple-600 hover:underline font-medium"
              >
                Try again
              </button>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl mb-4">
            <span className="text-2xl font-bold text-white">D</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
          <p className="text-gray-600">No worries! Enter your email and we'll send you reset instructions.</p>
        </div>

        {/* Forgot Password Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email address"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white placeholder-gray-400 ${
                    error ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {error && (
                <div className="flex items-center mt-1 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {error}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending Reset Link...
                </>
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center text-purple-600 hover:text-purple-500 font-medium"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        </div>

        {/* Help */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Still having trouble?{' '}
            <Link href="/contact" className="text-purple-600 hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
