import { useEffect, useRef } from 'react'

export const useReveal = (options = {}) => {
  const ref = useRef(null)
  const { threshold = 0.1, rootMargin = '0px', once = true } = options

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observerOptions = {
      root: null,
      rootMargin,
      threshold
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active')
          if (once) {
            observer.unobserve(entry.target)
          }
        } else if (!once) {
          entry.target.classList.remove('active')
        }
      })
    }, observerOptions)

    observer.observe(element)

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [threshold, rootMargin, once])

  return ref
}

