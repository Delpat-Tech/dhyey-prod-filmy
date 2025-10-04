const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

// Base API utility functions
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('dhyey_token')
  const tokenExpiry = localStorage.getItem('dhyey_token_expiry')

  // Check if token is expired
  if (token && tokenExpiry && new Date().getTime() > parseInt(tokenExpiry)) {
    console.log('Token expired, clearing session')
    localStorage.removeItem('dhyey_user')
    localStorage.removeItem('dhyey_token')
    localStorage.removeItem('dhyey_token_expiry')
    localStorage.removeItem('dhyey_remember_me')
    
    // Redirect to login if not already on auth page
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/')) {
      window.location.href = '/auth/login'
    }
    throw new Error('Session expired. Please log in again.')
  }

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...(token && { credentials: 'include' }),
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  // Handle 401 Unauthorized (token invalid/expired)
  if (response.status === 401) {
    console.log('Unauthorized request, clearing session')
    localStorage.removeItem('dhyey_user')
    localStorage.removeItem('dhyey_token')
    localStorage.removeItem('dhyey_token_expiry')
    localStorage.removeItem('dhyey_remember_me')
    
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/')) {
      window.location.href = '/auth/login'
    }
    throw new Error('Session expired. Please log in again.')
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Authentication API
export const authAPI = {
  login: (email: string, password: string) =>
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    }),

  register: (userData: { name: string; username: string; email: string; password: string }) =>
    fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }).then(async res => {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || `HTTP error! status: ${res.status}`);
      }
      return data;
    }),

  forgotPassword: (email: string) =>
    apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string, passwordConfirm: string) =>
    apiRequest(`/auth/reset-password/${token}`, {
      method: 'PATCH',
      body: JSON.stringify({ password, passwordConfirm }),
    }),

  updatePassword: (passwordCurrent: string, password: string, passwordConfirm: string) =>
    apiRequest('/auth/update-password', {
      method: 'PATCH',
      body: JSON.stringify({ passwordCurrent, password, passwordConfirm }),
    }),

  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
  refreshToken: () => apiRequest('/auth/refresh-token', { method: 'POST' }),
}

// User API
export const userAPI = {
  getMe: () => apiRequest('/users/me'),
  
  updateMe: (userData: any) =>
    apiRequest('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(userData),
    }),

  getUserProfile: (identifier: string) => apiRequest(`/users/profile/${identifier}`),
  
  followUser: (userId: string) =>
    apiRequest(`/users/${userId}/follow`, { method: 'POST' }),

  getUserFollowers: (userId: string) => apiRequest(`/users/${userId}/followers`),
  getUserFollowing: (userId: string) => apiRequest(`/users/${userId}/following`),
  getUserSavedStories: (userId: string) => apiRequest(`/users/${userId}/saved`),
  
  // Admin routes
  getAllUsers: () => apiRequest('/users/admin/all'),
}

// Story API
export const storyAPI = {
  getPublicStories: (params?: URLSearchParams) => 
    apiRequest(`/stories${params ? `?${params}` : ''}`),
  
  getStoryById: (id: string) => apiRequest(`/stories/${id}`),
  
  createStory: (storyData: any) =>
    apiRequest('/stories', {
      method: 'POST',
      body: JSON.stringify(storyData),
    }),

  updateStory: (id: string, storyData: any) =>
    apiRequest(`/stories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(storyData),
    }),

  deleteStory: (id: string) =>
    apiRequest(`/stories/${id}`, { method: 'DELETE' }),

  likeStory: (id: string) =>
    apiRequest(`/stories/${id}/like`, { method: 'POST' }),

  saveStory: (id: string) =>
    apiRequest(`/stories/${id}/save`, { method: 'POST' }),

  shareStory: (id: string) =>
    apiRequest(`/stories/${id}/share`, { method: 'POST' }),

  getUserStories: (userId: string) => apiRequest(`/stories/user/${userId}`),
  
  searchStories: (query: string, filters?: any) => {
    const params = new URLSearchParams({ q: query, ...filters })
    return apiRequest(`/stories/search?${params}`)
  },
}

// Search API
export const searchAPI = {
  searchStories: (query: string, filters?: any) => {
    const params = new URLSearchParams({ q: query, ...filters })
    return apiRequest(`/search/stories?${params}`)
  },

  searchUsers: (query: string) => {
    const params = new URLSearchParams({ q: query })
    return apiRequest(`/search/users?${params}`)
  },

  getSearchSuggestions: (query: string) => {
    const params = new URLSearchParams({ q: query })
    return apiRequest(`/search/suggestions?${params}`)
  },

  getSearchFilters: () => apiRequest('/search/filters'),
  
  globalSearch: (query: string) => {
    const params = new URLSearchParams({ q: query })
    return apiRequest(`/search/global?${params}`)
  },
}

// Admin API
export const adminAPI = {
  // Story management - Admin endpoint to get ALL stories (including pending)
  getAllStories: (params?: URLSearchParams) => 
    apiRequest(`/admin/stories${params ? `?${params}` : ''}`),
  
  getStoryForReview: (id: string) => apiRequest(`/stories/${id}`),
  
  approveStory: (id: string) =>
    apiRequest(`/admin/stories/${id}/approve`, { method: 'PATCH' }),
  
  rejectStory: (id: string, reason?: string) =>
    apiRequest(`/admin/stories/${id}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    }),

  bulkApproveStories: (storyIds: string[]) =>
    apiRequest('/admin/stories/bulk-approve', {
      method: 'PATCH',
      body: JSON.stringify({ storyIds }),
    }),

  bulkRejectStories: (storyIds: string[], reason?: string) =>
    apiRequest('/admin/stories/bulk-reject', {
      method: 'PATCH',
      body: JSON.stringify({ storyIds, reason }),
    }),

  // User management
  getAllUsers: (params?: URLSearchParams) => 
    apiRequest(`/users/admin/all${params ? `?${params}` : ''}`),
  
  suspendUser: (userId: string, reason: string, duration?: number) =>
    apiRequest(`/users/${userId}/suspend`, {
      method: 'PATCH',
      body: JSON.stringify({ reason, duration }),
    }),

  unsuspendUser: (userId: string) =>
    apiRequest(`/users/${userId}/unsuspend`, { method: 'PATCH' }),

  deleteUser: (userId: string) =>
    apiRequest(`/users/${userId}`, { method: 'DELETE' }),

  // Analytics
  getAnalytics: () => apiRequest('/admin/analytics'),
  
  getDashboardStats: () => apiRequest('/admin/dashboard-stats'),
}

// Generic API object for backward compatibility
const api = {
  get: (endpoint: string) => apiRequest(endpoint),
  post: (endpoint: string, data?: any) =>
    apiRequest(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
  put: (endpoint: string, data?: any) =>
    apiRequest(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
  delete: (endpoint: string) =>
    apiRequest(endpoint, { method: 'DELETE' }),
}

export default api
