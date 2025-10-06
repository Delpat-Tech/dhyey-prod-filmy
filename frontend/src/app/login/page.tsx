'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await axios.post('/api/v1/auth/login', {
        email,
        password
      })
      
      setMessage('Login successful! Redirecting...')
      
      // Store token if needed
      if (response.data.token) {
        localStorage.setItem('dhyey_token', response.data.token)
        localStorage.setItem('dhyey_user', JSON.stringify(response.data.data.user))
        // Set expiry (24 hours from now)
        const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000)
        localStorage.setItem('dhyey_token_expiry', expiryTime.toString())
        console.log('Token stored:', response.data.token)
        // Set cookie for middleware
        document.cookie = `token=${response.data.token}; path=/; max-age=2592000` // 30 days
      }
      
      // Redirect to home page after 1 second
      setTimeout(() => {
        router.push('/')
      }, 1000)
      
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div style={{ 
        maxWidth: '400px', 
        padding: '40px', 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
      }}>
        <h1 style={{ color: '#333', textAlign: 'center', marginBottom: '30px' }}>DHYEY Login</h1>
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#333', display: 'block', marginBottom: '5px' }}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                fontSize: '14px',
                color: '#333',
                backgroundColor: 'white'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#333', display: 'block', marginBottom: '5px' }}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                fontSize: '14px',
                color: '#333',
                backgroundColor: 'white'
              }}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '12px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        {message && (
          <p style={{ 
            marginTop: '15px', 
            color: message.includes('successful') ? 'green' : 'red',
            textAlign: 'center'
          }}>
            {message}
          </p>
        )}
        
        <p style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
          Don't have an account? <a href="/register" style={{ color: '#007bff', textDecoration: 'none' }}>Register</a>
        </p>
        

      </div>
    </div>
  )
}