type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastConfig {
  message: string
  type: ToastType
  duration?: number
}

// Simple event-based toast system
class ToastManager {
  private listeners: Set<(config: ToastConfig) => void> = new Set()

  subscribe(callback: (config: ToastConfig) => void) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  show(config: ToastConfig) {
    this.listeners.forEach(listener => listener(config))
  }
}

export const toastManager = new ToastManager()

export const showToast = (message: string, type: ToastType = 'info', duration = 3000) => {
  toastManager.show({ message, type, duration })
}

// Convenience functions
export const toast = {
  success: (message: string, duration = 3000) => showToast(message, 'success', duration),
  error: (message: string, duration = 3000) => showToast(message, 'error', duration),
  info: (message: string, duration = 3000) => showToast(message, 'info', duration),
  warning: (message: string, duration = 3000) => showToast(message, 'warning', duration)
}
