'use client'

import { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { 
  ArrowLeft, 
  Mail, 
  User, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Plus,
  X,
  Lock
} from 'lucide-react'

const roleOptions = [
  {
    value: 'admin',
    label: 'Admin',
    description: 'Can manage content, users, and basic settings',
    permissions: ['content_management', 'user_management', 'basic_settings']
  }
]

export default function AddAdminForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    username: '',
    role: '',
    permissions: [] as string[],
    sendInvite: true,
    customMessage: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleRoleChange = (roleValue: string) => {
    const selectedRole = roleOptions.find(role => role.value === roleValue)
    setFormData(prev => ({
      ...prev,
      role: roleValue,
      permissions: selectedRole ? selectedRole.permissions : []
    }))
  }

  const handlePermissionToggle = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('dhyey_token')
      
      console.log('Token from localStorage:', token)
      console.log('Sending request to create admin:', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
      
      if (!token) {
        setErrors({ submit: 'No authentication token found. Please log in again.' })
        return
      }
      
      const response = await axios.post('/api/v1/admin/create-admin', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      console.log('Admin created successfully:', response.data)
      setShowSuccess(true)
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        username: '',
        role: '',
        permissions: [],
        sendInvite: true,
        customMessage: ''
      })
      
      // Clear any previous errors
      setErrors({})
    } catch (error: any) {
      console.error('Error adding admin:', error)
      setErrors({ submit: error.response?.data?.message || 'Failed to create admin' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedRole = roleOptions.find(role => role.value === formData.role)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/admin/admins"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Admin</h1>
          <p className="text-gray-600">Invite a new user to join the admin team</p>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <h3 className="text-sm font-medium text-green-800">Admin Added Successfully!</h3>
              <p className="text-sm text-green-700 mt-1">
                Admin user has been created successfully!
              </p>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="text-green-400 hover:text-green-600"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white ${
                    errors.name ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="Enter full name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white ${
                    errors.email ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="Enter email address"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white ${
                    errors.password ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="Enter password"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.password}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Admin Role Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Role</h2>
          <div className="flex items-center space-x-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <Shield className="h-5 w-5 text-purple-600" />
            <div>
              <p className="font-medium text-purple-900">Administrator</p>
              <p className="text-sm text-purple-700">Full access to manage content, users, and system settings</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-800">{errors.submit}</p>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4">
          <Link
            href="/admin/admins"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Creating Admin...</span>
              </>
            ) : (
              <>
                <Plus size={16} />
                <span>Create Admin</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
