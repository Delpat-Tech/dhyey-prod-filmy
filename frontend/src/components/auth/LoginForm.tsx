'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import { showNotification } from '@/lib/errorHandler'
import { useAuth } from '@/contexts/AuthContext'

interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

export default function LoginForm() {
  const { login } = useAuth()
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: true
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<LoginFormData>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name as keyof LoginFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)

    try {
      await login(formData.email, formData.password, formData.rememberMe)
      
      // Get the user from localStorage to check role
      const storedUser = localStorage.getItem('dhyey_user')
      const user = storedUser ? JSON.parse(storedUser) : null
      
      if (user && user.role === 'admin') {
        // Admin user - redirect to admin panel
        showNotification({
          type: 'success',
          title: 'Admin Login Successful!',
          message: 'Welcome to the admin panel'
        })
        
        setTimeout(() => {
          window.location.href = '/admin'
        }, 1000)
      } else {
        // Regular user - redirect to dashboard
        showNotification({
          type: 'success',
          title: 'Login Successful!',
          message: 'Welcome back to Dhyey'
        })
        
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 1000)
      }
      
    } catch (error: any) {
      showNotification({
        type: 'error',
        title: 'Login Failed',
        message: error.message || 'Please check your credentials and try again'
      })
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-950">
      <div className="flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-12 px-6 sm:px-10 lg:px-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl mb-4">
              <span className="text-2xl font-bold text-white">D</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your Dhyey account</p>
          </div>

          {/* Login Form */}
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
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white placeholder-gray-400 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center mt-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white placeholder-gray-400 ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center mt-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center group cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center ${
                      formData.rememberMe
                        ? 'bg-gradient-to-br from-purple-600 to-indigo-600 border-purple-600'
                        : 'border-gray-300 bg-white group-hover:border-purple-400'
                    }`}>
                      {formData.rememberMe && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="ml-3 text-sm text-gray-600 font-medium">Remember me</span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
                >
                  Forgot password?
                </Link>
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
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link
                  href="/auth/register"
                  className="text-purple-600 hover:text-purple-500 font-medium"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="text-purple-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-purple-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="relative hidden lg:block overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-indigo-700 to-slate-900" />
        <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_60%),radial-gradient(circle_at_80%_0%,rgba(236,72,153,0.25),transparent_55%),radial-gradient(circle_at_10%_90%,rgba(129,140,248,0.3),transparent_60%)]" />

        <div className="pointer-events-none absolute inset-0">
          <div
            className="shape absolute top-1/4 left-[16%] w-40 h-40 rounded-full bg-gradient-to-br from-fuchsia-400/70 to-indigo-500/80 shadow-[0_45px_120px_rgba(79,70,229,0.35)]"
            style={{ animation: 'float 18s ease-in-out infinite', animationDelay: '-6s' } as React.CSSProperties}
          />
          <div
            className="shape absolute top-1/2 right-[18%] w-64 h-64 rounded-[3rem] border border-white/20 bg-white/10 backdrop-blur-3xl shadow-[0_55px_160px_rgba(255,255,255,0.15)]"
            style={{ animation: 'float 22s ease-in-out infinite', animationDelay: '-4s', animationDirection: 'alternate' } as React.CSSProperties}
          />
          <div
            className="shape absolute bottom-16 left-[22%] w-48 h-48 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl"
            style={{ animation: 'float 20s ease-in-out infinite', animationDelay: '-2s' } as React.CSSProperties}
          />
          <div
            className="shape absolute top-10 right-10 w-24 h-24 rounded-full bg-white/15 border border-white/30"
            style={{ animation: 'float 16s ease-in-out infinite', animationDelay: '-8s', animationDirection: 'alternate-reverse' } as React.CSSProperties}
          />
        </div>

        <div className="relative h-full flex flex-col justify-between p-12 text-white">
          <div>
            <div className="inline-block px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg mb-6">
              <span className="text-xs uppercase tracking-[0.5em] text-white/80 font-medium">Dhyey Productions</span>
            </div>
            <h2 className="mt-6 text-4xl font-semibold leading-tight">Stories come alive with every login.</h2>
            <p className="mt-4 text-base text-white/70 max-w-sm leading-relaxed">
            Whether you're here to share your next big idea or to discover the one that's ready for the screen, this is where stories are born, developed, and transformed into scripts.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-11 w-11 rounded-full bg-white/15 flex items-center justify-center font-semibold text-white">
              D
            </div>
            <div>
              <p className="text-sm font-medium text-white">Dhyey Production Suite</p>
              <p className="text-xs text-white/60">Creative storytelling, refined.</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          50% {
            transform: translate3d(0, -20px, 0) rotate(6deg);
          }
        }
      `}</style>
    </div>
  )
}
