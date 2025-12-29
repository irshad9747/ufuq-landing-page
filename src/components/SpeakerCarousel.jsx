import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import SpeakerCard from './SpeakerCard'

const DRAG_BUFFER = 50
const VELOCITY_THRESHOLD = 500
const GAP = 16
const SPRING_OPTIONS = { type: 'spring', stiffness: 300, damping: 30 }

export default function SpeakerCarousel({ speakers }) {
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
      const max = Math.max(0, speakers.length - 1)
      return Math.max(0, Math.min(next, max))
    })
  }

  const dragConstraints = {
    left: -trackItemOffset * Math.max(speakers.length - 1, 0),
    right: 0
  }

  const activeIndex = Math.min(position, speakers.length - 1)

  if (speakers.length === 0) return null

  return (
    <div
      ref={containerRef}
      className="carousel-container"
      style={{
        width: '100%',
        maxWidth: '100%',
        padding: '0 12px'
      }}
    >
      <motion.div
        className="carousel-track"
        drag={isAnimating ? false : 'x'}
        dragConstraints={dragConstraints}
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
        aria-label="Speakers carousel"
      >
        {speakers.map((speaker, index) => (
          <div
            key={`${speaker.name}-${speaker.initials}`}
            style={{
              width: itemWidth,
              flexShrink: 0,
              minWidth: itemWidth
            }}
          >
            <div style={{ width: '100%' }}>
              <SpeakerCard speaker={speaker} />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Indicators */}
      {speakers.length > 1 && (
        <div className="carousel-indicators-container">
          <div className="carousel-indicators">
            {speakers.map((_, index) => (
              <motion.div
                key={index}
                className={`carousel-indicator ${activeIndex === index ? 'active' : 'inactive'}`}
                animate={{
                  scale: activeIndex === index ? 1.2 : 1
                }}
                onClick={() => setPosition(index)}
                transition={{ duration: 0.15 }}
                role="button"
                aria-label={`Go to speaker ${index + 1}`}
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


