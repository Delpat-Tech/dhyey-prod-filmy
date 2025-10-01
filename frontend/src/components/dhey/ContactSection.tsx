'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send, MessageCircle, Briefcase, Users } from 'lucide-react'

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Get in touch for general inquiries",
    contact: "hello@dheyproductions.com",
    action: "mailto:hello@dheyproductions.com"
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Speak directly with our team",
    contact: "+1 (555) 123-4567",
    action: "tel:+15551234567"
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Our creative studio location",
    contact: "123 Creative Ave, Los Angeles, CA",
    action: "#"
  }
]

const inquiryTypes = [
  { value: "general", label: "General Inquiry" },
  { value: "collaboration", label: "Collaboration" },
  { value: "competition", label: "Competition Question" },
  { value: "media", label: "Media & Press" },
  { value: "support", label: "Technical Support" }
]

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'general',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('Contact form submitted:', formData)
    alert('Thank you for your message! We\'ll get back to you soon.')
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      inquiryType: 'general',
      subject: '',
      message: ''
    })
    setIsSubmitting(false)
  }

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Have a project in mind? Want to collaborate? Or just want to say hello? 
            We'd love to hear from you and discuss how we can bring your creative vision to life.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Let's Start a Conversation
              </h3>
              <p className="text-gray-600 mb-8">
                Whether you're a storyteller looking for a platform, a brand seeking creative content, 
                or someone with an innovative idea, we're here to listen and collaborate.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.action}
                  className="flex items-start space-x-4 p-4 bg-white rounded-xl hover:shadow-md transition-shadow group"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <method.icon size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{method.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{method.description}</p>
                    <p className="text-purple-600 font-medium">{method.contact}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-gray-900 mb-4">Quick Links</h4>
              <div className="grid grid-cols-2 gap-4">
                <a href="/competitions" className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                  <Users size={16} />
                  <span>Competitions</span>
                </a>
                <a href="/dhey-production/portfolio" className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                  <Briefcase size={16} />
                  <span>Our Work</span>
                </a>
                <a href="/about" className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                  <MessageCircle size={16} />
                  <span>About Us</span>
                </a>
                <a href="/careers" className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                  <Users size={16} />
                  <span>Careers</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Send Us a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                    required
                  />
                </div>
              </div>

              {/* Inquiry Type */}
              <div>
                <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-2">
                  Inquiry Type
                </label>
                <select
                  id="inquiryType"
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                >
                  {inquiryTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-900 bg-white"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Send size={16} />
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>

            {/* Response Time Notice */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Response Time:</strong> We typically respond to all inquiries within 24-48 hours during business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
