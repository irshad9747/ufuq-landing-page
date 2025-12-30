import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { EventCard } from './Events'

const DRAG_BUFFER = 50
const VELOCITY_THRESHOLD = 500
const GAP = 16
const SPRING_OPTIONS = { type: 'spring', stiffness: 300, damping: 30 }

export default function EventCarousel({ events, activeFilter }) {
  const containerRef = useRef(null)
  const [itemWidth, setItemWidth] = useState(350)
  
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        setItemWidth(containerWidth - 48) // 24px padding on each side
      }
    }
    
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])
  
  const trackItemOffset = itemWidth + GAP

  const [position, setPosition] = useState(0)
  const x = useMotionValue(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Events are already filtered in parent component
  const filteredEvents = events

  useEffect(() => {
    setPosition(0)
    x.set(0)
  }, [activeFilter, x])

  const effectiveTransition = SPRING_OPTIONS

  const handleAnimationStart = () => {
    setIsAnimating(true)
  }

  const handleAnimationComplete = () => {
    setIsAnimating(false)
  }

  const handleDragEnd = (_, info) => {
    const { offset, velocity } = info
    const direction =
      offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD
        ? 1
        : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD
          ? -1
          : 0

    if (direction === 0) return

    setPosition(prev => {
      const next = prev + direction
      const max = Math.max(0, filteredEvents.length - 1)
      return Math.max(0, Math.min(next, max))
    })
  }

  const dragConstraints = {
    left: -trackItemOffset * Math.max(filteredEvents.length - 1, 0),
    right: 0
  }

  const activeIndex = Math.min(position, filteredEvents.length - 1)
  const canGoPrev = position > 0
  const canGoNext = position < filteredEvents.length - 1

  const goToPrev = useCallback(() => {
    if (canGoPrev) {
      setPosition(prev => Math.max(0, prev - 1))
    }
  }, [canGoPrev])

  const goToNext = useCallback(() => {
    if (canGoNext) {
      setPosition(prev => Math.min(filteredEvents.length - 1, prev + 1))
    }
  }, [canGoNext, filteredEvents.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToPrev, goToNext])

  if (filteredEvents.length === 0) return null

  return (
    <div
      ref={containerRef}
      className="carousel-container"
      style={{
        width: '100%',
        maxWidth: '100%',
        padding: '0 12px',
        position: 'relative'
      }}
    >
      {/* Navigation Buttons */}
      {filteredEvents.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            disabled={!canGoPrev}
            className={`carousel-nav-btn carousel-nav-btn-prev ${!canGoPrev ? 'disabled' : ''}`}
            aria-label="Previous event"
            type="button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            disabled={!canGoNext}
            className={`carousel-nav-btn carousel-nav-btn-next ${!canGoNext ? 'disabled' : ''}`}
            aria-label="Next event"
            type="button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
      <motion.div
        className="carousel-track"
        drag={isAnimating ? false : 'x'}
        dragConstraints={dragConstraints}
        dragElastic={0.1}
        style={{
          display: 'flex',
          gap: `${GAP}px`,
          x
        }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(position * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationStart={handleAnimationStart}
        onAnimationComplete={handleAnimationComplete}
        role="region"
        aria-label="Events carousel"
        aria-live="polite"
      >
        {filteredEvents.map((event, index) => (
          <div
            key={`${event.title}-${event.date}`}
            style={{
              width: itemWidth,
              flexShrink: 0,
              minWidth: itemWidth
            }}
          >
            <div style={{ width: '100%' }}>
              <EventCard event={event} index={index} />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Indicators */}
      {filteredEvents.length > 1 && (
        <div className="carousel-indicators-container">
          <div className="carousel-indicators">
            {filteredEvents.map((_, index) => (
              <motion.button
                key={index}
                className={`carousel-indicator ${activeIndex === index ? 'active' : 'inactive'}`}
                animate={{
                  scale: activeIndex === index ? 1.2 : 1
                }}
                onClick={() => setPosition(index)}
                transition={{ duration: 0.15 }}
                role="button"
                aria-label={`Go to event ${index + 1}`}
                aria-current={activeIndex === index ? 'true' : 'false'}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setPosition(index)
                  }
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

