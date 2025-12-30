/**
 * Get the correct image path with base URL prefix
 * This ensures images work correctly with Vite's base path configuration
 * @param {string} path - Image path starting with /
 * @returns {string} - Image path with base URL prefix
 */
export const getImagePath = (path) => {
  // Remove leading slash if present, then add base URL
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  const baseUrl = import.meta.env.BASE_URL
  // Ensure baseUrl ends with / and cleanPath doesn't start with /
  return `${baseUrl}${cleanPath}`
}

