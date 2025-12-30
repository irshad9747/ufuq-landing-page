import { useReveal } from '../hooks/useReveal'
import { getImagePath } from '../utils/imagePath'
import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { throttleRAF } from '../utils/throttle'
import { motion, useMotionValue } from 'framer-motion'

const DRAG_BUFFER = 50
const VELOCITY_THRESHOLD = 500
const GAP = 16
const SPRING_OPTIONS = { type: 'spring', stiffness: 300, damping: 30 }

const RecentActivity = () => {
  const ref = useReveal()
  const containerRef = useRef(null)
  const [itemWidth, setItemWidth] = useState(280)
  const [position, setPosition] = useState(0)
  const x = useMotionValue(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Memoize activities data to prevent recalculation on re-renders
  const activities = useMemo(() => [
    { 
      month: 'May 2025', 
      title: 'Exploring Intersections of Science, Technology, Society & Theology - Summer School', 
      date: '27, 28, 29 May 2025',
      location: 'Al Jamia Al Islamiya, Santhapuram',
      image: getImagePath('/images/events/jamia-summer-school.webp')
    },
    { 
      month: 'Aug 2025', 
      title: 'Workshop on Aqeeda, Philosophy and Science: Navigating Technology in the Modern Era', 
      date: '03 August 2025',
      location: 'Unity Center, Kannur',
      image: getImagePath('/images/events/unity-center-workshop.webp')
    },
    { 
      month: 'Aug 2025', 
      title: 'Science and Technology Fest Declaration Ceremony', 
      date: '17 August 2025',
      location: 'Ernakulam Town Hall',
      image: getImagePath('/images/events/ern-declaration-ceremony.webp')
    },
    { 
      month: 'Aug 2025', 
      title: "Let's Ai It! AI Orientation Workshop", 
      date: '24 August 2025',
      location: 'Hira Centre Auditorium, Kozhikode',
      image: getImagePath('/images/events/hira-clct-ai-workshop.webp')
    },
  ], [])

  // Update item width on resize (mobile only) - optimized with throttling
  useEffect(() => {
    const updateWidth = throttleRAF(() => {
      if (containerRef.current && window.innerWidth < 640) {
        const containerWidth = containerRef.current.offsetWidth
        setItemWidth(containerWidth - 48) // 24px padding on each side
      }
    })
    
    updateWidth()
    window.addEventListener('resize', updateWidth, { passive: true })
    return () => {
      updateWidth.cancel()
      window.removeEventListener('resize', updateWidth)
    }
  }, [])

  const trackItemOffset = itemWidth + GAP

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
      const max = Math.max(0, activities.length - 1)
      return Math.max(0, Math.min(next, max))
    })
  }

  const dragConstraints = {
    left: -trackItemOffset * Math.max(activities.length - 1, 0),
    right: 0
  }

  const canGoPrev = position > 0
  const canGoNext = position < activities.length - 1

  const goToPrev = useCallback(() => {
    if (canGoPrev) {
      setPosition(prev => Math.max(0, prev - 1))
    }
  }, [canGoPrev])

  const goToNext = useCallback(() => {
    if (canGoNext) {
      setPosition(prev => Math.min(activities.length - 1, prev + 1))
    }
  }, [canGoNext, activities.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (window.innerWidth < 640) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          goToPrev()
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          goToNext()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToPrev, goToNext])

  return (
    <section id="recent-activity" className="py-20 px-6 max-w-7xl mx-auto">
      <div ref={ref} className="reveal mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold border-l-4 border-indigo-500 pl-4">What we've been up to lately</h2>
          <a 
            href="https://ufuq.siokerala.org/hackathon" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold flex items-center gap-2 transition-colors group"
          >
            <span>Hackathon Archive</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
          </a>
        </div>
        {/* Mobile: Horizontal Scrollable Carousel */}
        <div 
          ref={containerRef}
          className="block sm:hidden relative overflow-hidden"
          style={{ padding: '0 12px' }}
        >
          {/* Navigation Buttons */}
          {activities.length > 1 && (
            <>
              <button
                onClick={goToPrev}
                disabled={!canGoPrev}
                className={`carousel-nav-btn carousel-nav-btn-prev ${!canGoPrev ? 'disabled' : ''}`}
                aria-label="Previous activity"
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
                aria-label="Next activity"
                type="button"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          <motion.div
            className="flex gap-4"
            drag={isAnimating ? false : 'x'}
            dragConstraints={dragConstraints}
            dragElastic={0.1}
            style={{
              x,
              cursor: 'grab',
              userSelect: 'none',
              WebkitUserSelect: 'none'
            }}
            onDragStart={(e) => {
              if (e.target.tagName === 'IMG') {
                e.preventDefault()
              }
            }}
            onDragEnd={handleDragEnd}
            animate={{ x: -(position * trackItemOffset) }}
            transition={SPRING_OPTIONS}
            onAnimationStart={handleAnimationStart}
            onAnimationComplete={handleAnimationComplete}
            role="region"
            aria-label="Recent activities carousel"
            aria-live="polite"
            whileDrag={{ cursor: 'grabbing' }}
          >
            {activities.map((activity, index) => (
              <div
                key={index}
                style={{
                  width: itemWidth,
                  flexShrink: 0,
                  minWidth: itemWidth
                }}
              >
                <div className="pro-card rounded-xl overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={activity.image} 
                      alt={activity.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#03030a]/80 via-transparent to-transparent"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h4 className="font-semibold text-white mb-3 group-hover:text-indigo-200 transition-colors text-sm leading-tight">
                      {activity.title}
                    </h4>
                    
                    {/* Date */}
                    {activity.date && (
                      <div className="flex items-center gap-2 text-gray-300 mb-2">
                        <svg className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <time dateTime={activity.date} className="text-xs font-medium">{activity.date}</time>
                      </div>
                    )}
                    
                    {/* Location */}
                    <div className="flex items-start gap-2 text-gray-400">
                      <svg className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <p className="text-xs leading-relaxed">{activity.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activities.map((activity, index) => (
            <div key={index} className="pro-card rounded-xl overflow-hidden group hover:scale-[1.02] transition-all duration-300">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={activity.image} 
                  alt={activity.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#03030a]/80 via-transparent to-transparent"></div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h4 className="font-semibold text-white mb-3 group-hover:text-indigo-200 transition-colors text-sm leading-tight">
                  {activity.title}
                </h4>
                
                {/* Date */}
                {activity.date && (
                  <div className="flex items-center gap-2 text-gray-300 mb-2">
                    <svg className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <time dateTime={activity.date} className="text-xs font-medium">{activity.date}</time>
                  </div>
                )}
                
                {/* Location */}
                <div className="flex items-start gap-2 text-gray-400">
                  <svg className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <p className="text-xs leading-relaxed">{activity.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RecentActivity

