/**
 * Smooth interpolation utilities for frame transitions
 */

/**
 * Easing functions for smooth animations
 */
export const easing = {
  // Smooth ease-out
  easeOut: (t) => 1 - Math.pow(1 - t, 3),
  
  // Smooth ease-in-out
  easeInOut: (t) => t < 0.5 
    ? 2 * t * t 
    : 1 - Math.pow(-2 * t + 2, 2) / 2,
  
  // Linear
  linear: (t) => t,
  
  // Smooth step
  smoothStep: (t) => t * t * (3 - 2 * t),
}

/**
 * Interpolate between two values with easing
 */
export const lerp = (start, end, t, easingFn = easing.easeOut) => {
  const eased = easingFn(t)
  return start + (end - start) * eased
}

/**
 * Clamp a value between min and max
 */
export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max)
}


