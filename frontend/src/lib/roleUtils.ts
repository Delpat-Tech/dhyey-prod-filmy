/**
 * Role-based utility functions for authentication and authorization
 */

export type UserRole = 'user' | 'admin' | 'moderator'

export interface UserData {
  id: string
  name: string
  username: string
  email: string
  role: UserRole
  avatar?: string
}

/**
 * Check if user has admin privileges
 */
export function isAdmin(user: UserData | null): boolean {
  return user?.role === 'admin'
}

/**
 * Check if user has moderator privileges
 */
export function isModerator(user: UserData | null): boolean {
  return user?.role === 'moderator'
}

/**
 * Check if user has admin or moderator privileges
 */
export function hasAdminAccess(user: UserData | null): boolean {
  return isAdmin(user) || isModerator(user)
}

/**
 * Check if user is a regular user
 */
export function isRegularUser(user: UserData | null): boolean {
  return user?.role === 'user'
}

/**
 * Get user role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case 'admin':
      return 'Administrator'
    case 'moderator':
      return 'Moderator'
    case 'user':
      return 'User'
    default:
      return 'User'
  }
}

/**
 * Validate if a role is valid
 */
export function isValidRole(role: string): role is UserRole {
  return ['user', 'admin', 'moderator'].includes(role)
}

/**
 * Get stored user data with role validation
 */
export function getStoredUserData(): UserData | null {
  try {
    const storedUser = sessionStorage.getItem('dhyey_user') || localStorage.getItem('dhyey_user')
    if (!storedUser) return null

    const userData = JSON.parse(storedUser)
    
    // Validate required fields
    if (!userData.id || !userData.email || !userData.role) {
      console.warn('Invalid user data found in storage')
      return null
    }

    // Validate role
    if (!isValidRole(userData.role)) {
      console.warn('Invalid user role found:', userData.role)
      userData.role = 'user' // Default to user
    }

    return userData
  } catch (error) {
    console.error('Error parsing stored user data:', error)
    return null
  }
}

/**
 * Clear all user data from storage
 */
export function clearUserData(): void {
  // Clear sessionStorage
  sessionStorage.removeItem('dhyey_user')
  sessionStorage.removeItem('dhyey_token')
  sessionStorage.removeItem('dhyey_token_expiry')
  sessionStorage.removeItem('dhyey_remember_me')
  
  // Clear localStorage
  localStorage.removeItem('dhyey_user')
  localStorage.removeItem('dhyey_token')
  localStorage.removeItem('dhyey_token_expiry')
}