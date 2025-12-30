import { useEffect, useState, useRef } from 'react'
import { throttleRAF } from '../utils/throttle'

/**
 * Optimized resize hook with throttling
 * @param {Function} callback - Function to call on resize
 * @param {Object} options - Options object
 * @param {boolean} options.immediate - Call immediately on mount
 * @param {number} options.breakpoint - Only trigger below this breakpoint
 * @returns {Object} - Resize dimensions
 */
export const useResize = (callback, options = {}) => {
  const { immediate = true, breakpoint = null } = options
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  })
  const callbackRef = useRef(callback)

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const handleResize = throttleRAF(() => {
      const width = window.innerWidth
      const height = window.innerHeight

      // Only trigger if below breakpoint (if specified)
      if (breakpoint && width >= breakpoint) {
        return
      }

      setDimensions({ width, height })
      
      if (callbackRef.current) {
        callbackRef.current({ width, height })
      }
    })

    if (immediate) {
      handleResize()
    }

    window.addEventListener('resize', handleResize, { passive: true })
    return () => {
      handleResize.cancel()
      window.removeEventListener('resize', handleResize)
    }
  }, [immediate, breakpoint])

  return dimensions
}

