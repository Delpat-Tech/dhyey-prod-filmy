/**
 * Image URL utility functions
 * Handles construction of image URLs for the application
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const FRONTEND_URL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001';

/**
 * Constructs a full image URL from a relative path
 * @param imagePath - The image path from the backend (e.g., "/uploads/avatars/image.jpg")
 * @param fallback - Optional fallback image URL
 * @returns Full image URL
 */
export const getImageUrl = (imagePath?: string | null, fallback?: string): string => {
  // If no image path provided, return fallback or default
  if (!imagePath) {
    return fallback || 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff&size=150';
  }

  // If already a full URL (starts with http:// or https://), return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If it's a blob URL (for preview), return as-is
  if (imagePath.startsWith('blob:')) {
    return imagePath;
  }

  // Construct full URL, ensuring no double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  // For uploads, use frontend proxy to avoid CORS issues
  if (cleanPath.startsWith('/uploads/')) {
    return `${FRONTEND_URL}${cleanPath}`;
  }
  
  return `${API_BASE_URL}${cleanPath}`;
};

/**
 * Get avatar URL with fallback
 */
export const getAvatarUrl = (avatar?: string | null): string => {
  return getImageUrl(avatar, 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff&size=150');
};

/**
 * Get story image URL with fallback
 */
export const getStoryImageUrl = (image?: string | null): string => {
  return getImageUrl(image, '/images/default-story.png');
};

/**
 * Check if an image URL is valid
 */
export const isValidImageUrl = (url?: string | null): boolean => {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('/');
};
