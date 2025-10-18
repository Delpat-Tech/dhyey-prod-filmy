/**
 * Authentication debugging utilities
 */

export function debugAuthState() {
  console.group('🔍 Authentication Debug Info')
  
  // Check sessionStorage
  console.group('📦 SessionStorage')
  console.log('User:', sessionStorage.getItem('dhyey_user'))
  console.log('Token:', sessionStorage.getItem('dhyey_token'))
  console.log('Token Expiry:', sessionStorage.getItem('dhyey_token_expiry'))
  console.log('Remember Me:', sessionStorage.getItem('dhyey_remember_me'))
  console.groupEnd()
  
  // Check localStorage
  console.group('💾 LocalStorage')
  console.log('User:', localStorage.getItem('dhyey_user'))
  console.log('Token:', localStorage.getItem('dhyey_token'))
  console.log('Token Expiry:', localStorage.getItem('dhyey_token_expiry'))
  console.groupEnd()
  
  // Parse and validate user data
  try {
    const sessionUser = sessionStorage.getItem('dhyey_user')
    const localUser = localStorage.getItem('dhyey_user')
    
    if (sessionUser) {
      const parsedSessionUser = JSON.parse(sessionUser)
      console.log('✅ SessionStorage User Data:', parsedSessionUser)
      console.log('👤 User Role:', parsedSessionUser.role)
      console.log('📧 User Email:', parsedSessionUser.email)
    }
    
    if (localUser) {
      const parsedLocalUser = JSON.parse(localUser)
      console.log('✅ LocalStorage User Data:', parsedLocalUser)
      console.log('👤 User Role:', parsedLocalUser.role)
      console.log('📧 User Email:', parsedLocalUser.email)
    }
    
    // Check for inconsistencies
    if (sessionUser && localUser) {
      const sessionData = JSON.parse(sessionUser)
      const localData = JSON.parse(localUser)
      
      if (sessionData.id !== localData.id) {
        console.warn('⚠️ User ID mismatch between storage methods!')
        console.log('Session ID:', sessionData.id)
        console.log('Local ID:', localData.id)
      }
      
      if (sessionData.role !== localData.role) {
        console.warn('⚠️ User role mismatch between storage methods!')
        console.log('Session Role:', sessionData.role)
        console.log('Local Role:', localData.role)
      }
    }
    
  } catch (error) {
    console.error('❌ Error parsing user data:', error)
  }
  
  // Check token expiry
  const tokenExpiry = sessionStorage.getItem('dhyey_token_expiry') || localStorage.getItem('dhyey_token_expiry')
  if (tokenExpiry) {
    const expiryTime = parseInt(tokenExpiry)
    const currentTime = new Date().getTime()
    const isExpired = currentTime > expiryTime
    
    console.log('⏰ Token Status:')
    console.log('  Current Time:', new Date(currentTime).toISOString())
    console.log('  Expiry Time:', new Date(expiryTime).toISOString())
    console.log('  Is Expired:', isExpired)
    console.log('  Time Until Expiry:', isExpired ? 'EXPIRED' : `${Math.round((expiryTime - currentTime) / 1000 / 60)} minutes`)
  }
  
  console.groupEnd()
}

export function clearAllAuthData() {
  console.log('🧹 Clearing all authentication data...')
  
  // Clear sessionStorage
  sessionStorage.removeItem('dhyey_user')
  sessionStorage.removeItem('dhyey_token')
  sessionStorage.removeItem('dhyey_token_expiry')
  sessionStorage.removeItem('dhyey_remember_me')
  
  // Clear localStorage
  localStorage.removeItem('dhyey_user')
  localStorage.removeItem('dhyey_token')
  localStorage.removeItem('dhyey_token_expiry')
  
  console.log('✅ All authentication data cleared')
}

// Add to window for easy access in browser console
if (typeof window !== 'undefined') {
  (window as any).debugAuth = debugAuthState;
  (window as any).clearAuth = clearAllAuthData;
}