/**
 * Smoothly scrolls to an element with an offset
 * @param {string} elementId - The ID of the element to scroll to
 * @param {number} offset - Offset from the top (default: 80)
 */
export const smoothScrollTo = (elementId, offset = 80) => {
  // Validate input
  if (!elementId || typeof elementId !== 'string') {
    console.warn('Invalid elementId provided to smoothScrollTo')
    return
  }
  
  // Sanitize: only allow alphanumeric, hyphens, and underscores
  if (!/^[a-zA-Z0-9_-]+$/.test(elementId)) {
    console.warn('Invalid characters in elementId')
    return
  }
  
  // Validate offset
  if (typeof offset !== 'number' || offset < 0) {
    offset = 80
  }
  
  const element = document.getElementById(elementId)
  if (element) {
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

