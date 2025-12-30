/**
 * Throttle function calls using requestAnimationFrame
 * Always uses the latest arguments for smoother updates
 */
export const throttleRAF = (callback) => {
  let rafId = null
  let lastArgs = null

  const throttled = (...args) => {
    lastArgs = args // Always update to latest
    
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        if (lastArgs !== null) {
          callback(...lastArgs)
        }
        rafId = null
        lastArgs = null
      })
    }
  }

  throttled.cancel = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    lastArgs = null
  }

  return throttled
}