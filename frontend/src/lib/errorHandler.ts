// Centralized error handling utility

export interface NotificationOptions {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

// Simple notification system (can be replaced with toast library)
export const showNotification = ({ type, title, message, duration = 3000 }: NotificationOptions) => {
  // Create notification element
  const notification = document.createElement('div')
  notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 ${
    type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
    type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
    type === 'warning' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
    'bg-blue-100 text-blue-800 border border-blue-200'
  }`
  
  notification.innerHTML = `
    <div class="flex items-start">
      <div class="flex-1">
        <div class="font-medium">${title}</div>
        ${message ? `<div class="text-sm mt-1">${message}</div>` : ''}
      </div>
      <button class="ml-2 text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">
        ×
      </button>
    </div>
  `
  
  document.body.appendChild(notification)
  
  // Auto remove after duration
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove()
    }
  }, duration)
}

// Error handling for async operations
export const handleAsyncError = (error: any, fallbackMessage = 'An unexpected error occurred') => {
  console.error('Error:', error)
  
  const message = error?.response?.data?.message || error?.message || fallbackMessage
  
  showNotification({
    type: 'error',
    title: 'Error',
    message
  })
}

// Success notification helper
export const showSuccess = (title: string, message?: string) => {
  showNotification({ type: 'success', title, message })
}

// Share profile with proper error handling
export const shareProfile = async (platform: string, userData: { username: string; name: string }) => {
  const url = `${window.location.origin}/profile/${userData.username}`
  const title = `Check out ${userData.name}'s profile on Dhyey`
  
  try {
    switch (platform) {
      case 'copy':
        await navigator.clipboard.writeText(url)
        showSuccess('Link Copied', 'Profile link copied to clipboard!')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
        break
      default:
        throw new Error('Unsupported platform')
    }
  } catch (error) {
    handleAsyncError(error, 'Failed to share profile')
  }
}
