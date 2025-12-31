import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useReveal } from '../hooks/useReveal'
import { getImagePath } from '../utils/imagePath'
import { throttleRAF } from '../utils/throttle'
import { imagePreloader } from '../utils/imagePreloader'
import { clamp } from '../utils/smoothInterpolation'

// Detect if user is on desktop (memoized result)
let desktopCheckCache = null
const isDesktop = () => {
  if (desktopCheckCache !== null) return desktopCheckCache
  
  // Check screen width (desktop typically > 1024px)
  const isWideScreen = window.innerWidth >= 1024
  // Check if device has touch capability (desktop usually doesn't)
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  // Check user agent for mobile devices
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  
  desktopCheckCache = isWideScreen && !hasTouch && !isMobileUA
  return desktopCheckCache
}

const Hero = () => {
  const leftRef = useReveal()
  const middleRef = useReveal()
  const [currentFrame, setCurrentFrame] = useState(71) // Start at middle frame
  const totalFrames = 142 // Number of frames available
  const imgRef = useRef(null) // Primary image
  const nextImgRef = useRef(null) // Secondary image for crossfade
  const [useWebP, setUseWebP] = useState(true) // Try WebP first
  const [displayFrame, setDisplayFrame] = useState(71) // Currently displayed frame
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isDesktopUser, setIsDesktopUser] = useState(false)
  const [allFramesLoaded, setAllFramesLoaded] = useState(false)
  const [initialFrameLoaded, setInitialFrameLoaded] = useState(false) // Track if initial frame is ready
  const [isInteractive, setIsInteractive] = useState(false) // Track if cube is ready for interaction
  const [loadingFrame, setLoadingFrame] = useState(71) // Track current frame being loaded/displayed during preload
  const [loadingProgress, setLoadingProgress] = useState(0) // Track loading progress percentage
  const transitionTimeoutRef = useRef(null) // Track transition timeout
  const pendingFrameRef = useRef(null) // Track pending frame change
  const loadingAbortRef = useRef(null) // Track loading abort controller
  const [cubeActivated, setCubeActivated] = useState(false) // Track if cube has been clicked to activate interactive mode

  // Helper function to get PNG fallback path
  const getPNGFallbackPath = useCallback((frameIndex) => {
    const frameNumber = frameIndex.toString().padStart(4, '0')
    return getImagePath(`/processed_frames/frame_${frameNumber}_inspyrenet.png`)
  }, [])

  // Memoize frame path calculation - uses WebP by default
  const getFramePath = useCallback((frameIndex) => {
    const frameNumber = frameIndex.toString().padStart(4, '0')
    // Use WebP directory if WebP is enabled, otherwise use PNG directory
    const basePath = useWebP 
      ? `/processed_frames_webp/frame_${frameNumber}_inspyrenet.webp`
      : `/processed_frames/frame_${frameNumber}_inspyrenet.png`
    // Use getImagePath to handle base URL correctly
    return getImagePath(basePath)
  }, [useWebP])

  // Helper function to preload with WebP fallback
  const preloadWithFallback = useCallback(async (frameIndex) => {
    const framePath = getFramePath(frameIndex)
    try {
      return await imagePreloader.preloadImage(framePath)
    } catch (error) {
      // If WebP fails, try PNG fallback
      if (useWebP) {
        const pngPath = getPNGFallbackPath(frameIndex)
        return await imagePreloader.preloadImage(pngPath)
      }
      throw error
    }
  }, [getFramePath, getPNGFallbackPath, useWebP])

  // Get cube.webp path
  const cubeWebpPath = useMemo(() => {
    return getImagePath('/icons/cube.webp')
  }, [])

  // Memoize frame paths for both images
  // During loading phase, use loadingFrame; during interactive phase, use displayFrame
  // Mobile users: Return empty string to prevent any image loading
  // Show cube.webp initially if not activated
  const framePath = useMemo(() => {
    // If cube not activated, show static cube.webp
    if (!cubeActivated) return cubeWebpPath
    // Check desktop status - use direct check to avoid race condition with state initialization
    const isDesktopDevice = isDesktopUser || isDesktop()
    if (!isDesktopDevice) return cubeWebpPath // Mobile: show static cube
    const frameToUse = isInteractive ? displayFrame : loadingFrame
    return getFramePath(frameToUse)
  }, [cubeActivated, cubeWebpPath, isDesktopUser, displayFrame, loadingFrame, isInteractive, getFramePath])
  const nextFramePath = useMemo(() => {
    // If cube not activated, return empty (no crossfade needed)
    if (!cubeActivated) return ''
    // Check desktop status - use direct check to avoid race condition with state initialization
    const isDesktopDevice = isDesktopUser || isDesktop()
    if (!isDesktopDevice) return '' // Mobile: no image loading
    return getFramePath(currentFrame)
  }, [cubeActivated, isDesktopUser, currentFrame, getFramePath])

  // Preload initial frame immediately and synchronously to prevent blinking
  // Skip entirely for mobile users - they don't need the cube
  // Only start loading when cube is activated
  useEffect(() => {
    // Don't start loading until cube is activated
    if (!cubeActivated) return
    
    // Check if mobile early - skip all frame loading
    const desktop = isDesktop()
    setIsDesktopUser(desktop)
    
    // Mobile users: Skip all frame loading completely
    if (!desktop) {
      // Don't load anything for mobile - cube is hidden anyway
      return
    }
    
    const initialFrame = 71
    
    // Desktop only: Preload initial frame first - this is critical to prevent blinking
    preloadWithFallback(initialFrame)
      .then(() => {
        setInitialFrameLoaded(true)
        setDisplayFrame(initialFrame)
        setLoadingFrame(initialFrame)
      })
      .catch(() => {
        // Show anyway to prevent infinite loading
        setInitialFrameLoaded(true)
        setDisplayFrame(initialFrame)
        setLoadingFrame(initialFrame)
      })
  }, [cubeActivated, preloadWithFallback])

  // Sequential frame loading: Load and display each frame one by one
  // Desktop only - mobile users skip this entirely
  // Only start loading when cube is activated
  useEffect(() => {
    // Don't start loading until cube is activated
    if (!cubeActivated) return
    
    // Check desktop status - use direct check as fallback to avoid race condition
    const isDesktopDevice = isDesktopUser || isDesktop()
    // Skip for mobile users - no frame loading needed
    if (!isDesktopDevice) return
    
    // Wait for initial frame to be loaded first
    if (!initialFrameLoaded) return
    
    // Create abort controller for cleanup
    const abortController = new AbortController()
    loadingAbortRef.current = abortController
    
    // Sequential loading: Load frames one by one to ensure each is fully loaded into RAM
    const loadFramesSequentially = async () => {
      try {
        const frameDelay = 20 // Delay between frame displays (visual feedback)
        
        // Start from frame 0 and load sequentially - ONE AT A TIME to ensure RAM loading
        for (let i = 0; i < totalFrames; i++) {
          // Check if loading was aborted
          if (abortController.signal.aborted) return
          
          const frameIndex = i
          const framePath = getFramePath(frameIndex)
          
          // Preload the frame and VERIFY it's in cache before moving on
          try {
            const loadedImg = await preloadWithFallback(frameIndex)
            
            // Verify the image is actually loaded and in cache
            if (!loadedImg || !loadedImg.complete || loadedImg.naturalWidth === 0) {
              // Image not properly loaded, wait a bit and retry
              await new Promise(resolve => setTimeout(resolve, 50))
              const retryImg = await preloadWithFallback(frameIndex)
              if (!retryImg || !retryImg.complete || retryImg.naturalWidth === 0) {
                // Still failed, but continue to next frame
                if (import.meta.env.DEV) {
                  console.warn(`Frame ${frameIndex} failed to load properly`)
                }
              }
            }
            
            // Double-check it's in the cache
            if (!imagePreloader.cache.has(framePath)) {
              // Force it into cache if somehow missing
              imagePreloader.cache.set(framePath, loadedImg)
            }
            
            // Update display to show this frame (visual feedback)
            setLoadingFrame(frameIndex)
            setDisplayFrame(frameIndex)
            setLoadingProgress(Math.round(((frameIndex + 1) / totalFrames) * 100))
            
            // Small delay between frames to ensure browser processes the load
            // This ensures each frame is actually loaded into RAM
            await new Promise(resolve => setTimeout(resolve, frameDelay))
            
          } catch (error) {
            // Frame failed to load, but continue with next frame
            if (import.meta.env.DEV) {
              console.warn(`Frame ${frameIndex} failed to load:`, error)
            }
            // Still update progress
            setLoadingFrame(frameIndex)
            setLoadingProgress(Math.round(((frameIndex + 1) / totalFrames) * 100))
            await new Promise(resolve => setTimeout(resolve, frameDelay))
          }
        }
        
        // All frames loaded! Enable interactive mode
        if (!abortController.signal.aborted) {
          setAllFramesLoaded(true)
          setIsInteractive(true)
          // Reset to middle frame for initial display
          setCurrentFrame(71)
          setDisplayFrame(71)
          setLoadingFrame(71)
          setLoadingProgress(100)
        }
        } catch (error) {
        // If loading fails, still enable interactive mode (fallback)
          if (import.meta.env.DEV) {
          console.error('Error loading frames sequentially:', error)
        }
        if (!abortController.signal.aborted) {
          setIsInteractive(true)
          setAllFramesLoaded(true)
        }
      }
    }
    
    loadFramesSequentially()
    
    // Cleanup function
    return () => {
      abortController.abort()
    }
  }, [cubeActivated, isDesktopUser, initialFrameLoaded, totalFrames, preloadWithFallback, getFramePath])

  // Preload nearby frames as user moves (desktop only - mobile doesn't load frames)
  // This effect is now desktop-only since mobile users never enter interactive mode
  useEffect(() => {
    // Mobile users never reach here, but double-check anyway
    if (!isDesktopUser) return
    
    if (isInteractive && !allFramesLoaded) {
      // Preload wider range to prevent blinking when user moves cursor
      imagePreloader.preloadFrameRange(currentFrame, totalFrames, 10, getFramePath)
    }
  }, [isDesktopUser, isInteractive, allFramesLoaded, currentFrame, totalFrames, getFramePath])

  // Mouse move handler for cursor-controlled rotation with frame smoothing
  // Only active when interactive mode is enabled
  useEffect(() => {
    if (!isInteractive) return // Don't enable mouse control until all frames are loaded
    
    let lastFrame = 71
    
    const handleMouseMove = throttleRAF((e) => {
      // Calculate frame based on cursor X position
      const cursorX = clamp(e.clientX / window.innerWidth, 0, 1)
      const targetFrame = Math.floor(cursorX * totalFrames)
      const clampedFrame = clamp(targetFrame, 0, totalFrames - 1)
      
      // Only update if frame actually changed (prevents unnecessary re-renders)
      if (clampedFrame !== lastFrame) {
        lastFrame = clampedFrame
        setCurrentFrame(clampedFrame)
      }
    })

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      handleMouseMove.cancel()
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [totalFrames, isInteractive])

  // Handle primary image load
  const handleImageLoad = useCallback(() => {
    if (imgRef.current) {
      // If showing static cube, ensure it's visible
      if (!cubeActivated) {
        imgRef.current.style.opacity = '0.85'
      } else {
      imgRef.current.style.opacity = '0.85'
      // Mark initial frame as loaded if this is the initial frame
      if (displayFrame === 71 && !initialFrameLoaded) {
        setInitialFrameLoaded(true)
      }
    }
    }
  }, [displayFrame, initialFrameLoaded, cubeActivated])

  // Handle cube click to activate interactive mode
  const handleCubeClick = useCallback(() => {
    if (!cubeActivated) {
      setCubeActivated(true)
    }
  }, [cubeActivated])

  // Crossfade transition logic with glitch prevention
  const performCrossfade = useCallback(() => {
    // Cancel any pending transition
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current)
      transitionTimeoutRef.current = null
    }
    
    if (nextImgRef.current && imgRef.current && currentFrame !== displayFrame && !isTransitioning) {
      // Check if next image is actually loaded before transitioning
      if (!nextImgRef.current.complete || nextImgRef.current.naturalWidth === 0) {
        // Image not ready, wait for it - but also try to preload it
        pendingFrameRef.current = currentFrame
        // Preload the pending frame to speed up loading
        const pendingPath = getFramePath(currentFrame)
        if (!imagePreloader.cache.has(pendingPath)) {
          imagePreloader.preloadImage(pendingPath).catch(() => {})
        }
        return
      }
      
      setIsTransitioning(true)
      pendingFrameRef.current = null
      
      // Use requestAnimationFrame for smoother transitions
      requestAnimationFrame(() => {
        if (!imgRef.current || !nextImgRef.current) return
        
        // Crossfade: fade out primary, fade in next
        imgRef.current.style.opacity = '0'
        nextImgRef.current.style.opacity = '0.85'
        
        // Faster transition for desktop (images already in RAM)
        const transitionDuration = allFramesLoaded ? 100 : 120
        
        // After transition completes, swap the images
        transitionTimeoutRef.current = setTimeout(() => {
          if (imgRef.current && nextImgRef.current) {
            const targetFrame = pendingFrameRef.current !== null ? pendingFrameRef.current : currentFrame
            
            // Only swap if frame still needs updating
            if (targetFrame !== displayFrame) {
              // Swap src attributes
              const tempSrc = imgRef.current.src
              imgRef.current.src = nextImgRef.current.src
              nextImgRef.current.src = tempSrc
              
              // Reset opacities
              imgRef.current.style.opacity = '0.85'
              nextImgRef.current.style.opacity = '0'
              
              // Update displayed frame
              setDisplayFrame(targetFrame)
            }
            
            setIsTransitioning(false)
            transitionTimeoutRef.current = null
            
            // Process any pending frame change
            if (pendingFrameRef.current !== null && pendingFrameRef.current !== displayFrame) {
              const pending = pendingFrameRef.current
              pendingFrameRef.current = null
              setCurrentFrame(pending)
            }
          } else {
            setIsTransitioning(false)
            transitionTimeoutRef.current = null
          }
        }, transitionDuration)
      })
    }
  }, [currentFrame, displayFrame, isTransitioning, allFramesLoaded, getFramePath])

  // Handle next image load - trigger crossfade
  const handleNextImageLoad = useCallback(() => {
    performCrossfade()
  }, [performCrossfade])

  // Handle image error - fallback to PNG if WebP fails
  const handleImageError = useCallback(() => {
    if (useWebP) {
      setUseWebP(false)
    }
  }, [useWebP])

  // Update next image when frame changes - use cached images if available
  // Only active in interactive mode and desktop only
  useEffect(() => {
    // Skip if not desktop or not in interactive mode
    if (!isDesktopUser || !isInteractive) return
    
    // Skip if transitioning or if frame hasn't changed
    if (currentFrame === displayFrame || !nextImgRef.current) return
    
    // If already transitioning, queue the frame change
    if (isTransitioning) {
      pendingFrameRef.current = currentFrame
      return
    }
    
    const nextPath = getFramePath(currentFrame)
    
    // Check if image is already cached (desktop users with all frames preloaded)
    if (imagePreloader.cache.has(nextPath)) {
      const cachedImg = imagePreloader.cache.get(nextPath)
      // Use cached image directly - instant switching!
      if (nextImgRef.current.src !== cachedImg.src) {
        nextImgRef.current.src = cachedImg.src
        // Ensure image is loaded before transitioning
        if (cachedImg.complete && cachedImg.naturalWidth > 0) {
          // Image ready, transition immediately
          requestAnimationFrame(() => {
            performCrossfade()
          })
        } else {
          // Wait for cached image to be ready (shouldn't happen often)
          const onLoadHandler = () => {
            requestAnimationFrame(() => {
              performCrossfade()
            })
            cachedImg.removeEventListener('load', onLoadHandler)
          }
          cachedImg.addEventListener('load', onLoadHandler)
        }
      }
    } else {
      // Load normally if not cached (mobile/tablet or still loading)
      if (nextImgRef.current.src !== nextPath && nextImgRef.current.src !== getImagePath(nextPath)) {
        // Preload the image first to prevent blinking
        imagePreloader.preloadImage(nextPath)
          .then((cachedImg) => {
          if (nextImgRef.current && currentFrame !== displayFrame && !isTransitioning) {
              nextImgRef.current.src = cachedImg.src
            // Ensure image is loaded
              if (cachedImg.complete && cachedImg.naturalWidth > 0) {
                requestAnimationFrame(() => {
                  performCrossfade()
                })
              } else {
                // Wait for image to be ready
                const onLoadHandler = () => {
                  if (nextImgRef.current && currentFrame !== displayFrame && !isTransitioning) {
              requestAnimationFrame(() => {
                performCrossfade()
              })
            }
                  cachedImg.removeEventListener('load', onLoadHandler)
                }
                cachedImg.addEventListener('load', onLoadHandler)
          }
        }
          })
          .catch(() => {
          // If WebP fails, try PNG fallback
          if (useWebP) {
              const pngPath = getPNGFallbackPath(currentFrame)
              imagePreloader.preloadImage(pngPath)
                .then((cachedImg) => {
                  if (nextImgRef.current && currentFrame !== displayFrame && !isTransitioning) {
                    nextImgRef.current.src = cachedImg.src
                    if (cachedImg.complete && cachedImg.naturalWidth > 0) {
                      requestAnimationFrame(() => {
                        performCrossfade()
                      })
                    } else {
                      const onLoadHandler = () => {
                        if (nextImgRef.current && currentFrame !== displayFrame && !isTransitioning) {
                          requestAnimationFrame(() => {
                            performCrossfade()
                          })
                        }
                        cachedImg.removeEventListener('load', onLoadHandler)
                      }
                      cachedImg.addEventListener('load', onLoadHandler)
                    }
                  }
                })
                .catch(() => {
                  // Final fallback - try direct image load
                  const testImg = new Image()
            testImg.onload = () => {
              if (nextImgRef.current && currentFrame !== displayFrame && !isTransitioning) {
                      nextImgRef.current.src = testImg.src
                if (nextImgRef.current.complete) {
                  requestAnimationFrame(() => {
                    performCrossfade()
                  })
                }
              }
            }
                  testImg.src = pngPath
                })
          }
          })
      }
    }
  }, [isDesktopUser, isInteractive, currentFrame, displayFrame, isTransitioning, getFramePath, getPNGFallbackPath, performCrossfade])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current)
      }
      if (loadingAbortRef.current) {
        loadingAbortRef.current.abort()
      }
    }
  }, [])

  return (
    <header id="home" className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen flex items-center">
      <div className="w-full space-y-16">
        {/* Top Row: Left and Middle Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          <div ref={leftRef} className="reveal delay-[100ms]">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-xs font-medium text-indigo-300 mb-8 hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-300">
              <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>Kozhikode, Kerala &bull; 25-26 Jan 2026</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8 tracking-tight">
              Science and <br/>
              <span className="gradient-text">Technology Fest</span>
            </h1>
            <p className="text-base md:text-lg text-gray-300 mb-10 max-w-lg leading-relaxed">
              Resisting both uncritical acceptance and blanket refusal of advances in science and technology, SIO seeks to critically engage with them -- questioning, redefining, and reshaping their course, while remaining grounded in the foundations of Islam.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#" className="btn-primary px-8 py-4 rounded-xl font-semibold text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#03030a]" aria-label="Register for UFUQ 2026">Register Now</a>
              <button className="px-8 py-4 rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all text-sm font-medium text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#03030a]" aria-label="View event brochure">View Brochure</button>
            </div>
          </div>

          {/* New Section */}
          <div ref={middleRef} className="flex items-center justify-center reveal delay-[200ms]">
            <div className="relative w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl hidden md:block">
              {/* Glow Background */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="cube-glow"></div>
              </div>
              
              {/* Floating Cube Image - Double buffered for smooth transitions */}
              <div className="relative flex items-center justify-center">
                {/* Primary image */}
                <img
                  ref={imgRef}
                  src={framePath}
                  alt="Rotating Cube"
                  draggable="false"
                  className={`w-full h-auto max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl absolute cube-alive ${!cubeActivated ? 'cursor-pointer hover:opacity-100' : ''}`}
                  style={{
                    opacity: cubeActivated ? (initialFrameLoaded ? 0.85 : 0) : 0.85,
                    imageRendering: 'auto',
                    willChange: 'opacity, transform, filter',
                    backfaceVisibility: 'hidden',
                    transition: isInteractive ? 'opacity 0.1s cubic-bezier(0.4, 0, 0.2, 1)' : 'opacity 0.3s ease-out',
                    WebkitBackfaceVisibility: 'hidden',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    WebkitUserDrag: 'none',
                    userSelect: 'none',
                    pointerEvents: isInteractive ? 'auto' : (cubeActivated ? 'none' : 'auto')
                  }}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  onClick={handleCubeClick}
                  onDragStart={(e) => e.preventDefault()}
                  loading="eager"
                  decoding="async"
                />
                {/* Secondary image for crossfade - only show when cube is activated */}
                {cubeActivated && (
                <img
                  ref={nextImgRef}
                  src={nextFramePath}
                  alt=""
                    draggable="false"
                  className={`w-full h-auto max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl ${isInteractive ? 'cube-alive' : ''}`}
                  style={{
                    opacity: 0,
                    imageRendering: 'auto',
                      willChange: 'opacity, transform, filter',
                    backfaceVisibility: 'hidden',
                    transition: 'opacity 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
                    pointerEvents: 'none',
                    WebkitBackfaceVisibility: 'hidden',
                    WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      WebkitUserDrag: 'none',
                      userSelect: 'none'
                  }}
                  onLoad={handleNextImageLoad}
                    onDragStart={(e) => e.preventDefault()}
                  loading="eager"
                  decoding="async"
                />
                )}
                
                {/* Loading Progress Indicator (shown during preload) - Below sprite */}
                {cubeActivated && !isInteractive && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ease-out"
                          style={{ width: `${loadingProgress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-300 font-medium min-w-[4rem] text-right">
                        {loadingFrame + 1}/{totalFrames} ({loadingProgress}%)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Hero

