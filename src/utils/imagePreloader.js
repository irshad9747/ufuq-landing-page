/**
 * Preload images for smooth transitions
 */
class ImagePreloader {
  constructor() {
    this.cache = new Map()
    this.preloadedFrames = new Set()
  }

  /**
   * Preload a single image
   */
  preloadImage(src) {
    if (this.cache.has(src)) {
      return Promise.resolve(this.cache.get(src))
    }

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        this.cache.set(src, img)
        resolve(img)
      }
      img.onerror = reject
      img.src = src
    })
  }

  /**
   * Preload a range of frames around the current frame
   */
  async preloadFrameRange(currentFrame, totalFrames, range = 5, getFramePath) {
    const framesToPreload = []
    
    // Preload current frame and nearby frames
    for (let i = -range; i <= range; i++) {
      const frameIndex = currentFrame + i
      if (frameIndex >= 0 && frameIndex < totalFrames) {
        const framePath = getFramePath(frameIndex)
        if (!this.preloadedFrames.has(frameIndex)) {
          framesToPreload.push({ frameIndex, framePath })
        }
      }
    }

    // Preload in batches to avoid blocking
    const batchSize = 3
    for (let i = 0; i < framesToPreload.length; i += batchSize) {
      const batch = framesToPreload.slice(i, i + batchSize)
      await Promise.allSettled(
        batch.map(({ frameIndex, framePath }) => {
          this.preloadedFrames.add(frameIndex)
          return this.preloadImage(framePath)
        })
      )
    }
  }

  /**
   * Preload all frames (use sparingly, can be heavy)
   */
  async preloadAll(totalFrames, getFramePath) {
    const promises = []
    for (let i = 0; i < totalFrames; i++) {
      const framePath = getFramePath(i)
      promises.push(this.preloadImage(framePath).catch(() => {}))
    }
    await Promise.allSettled(promises)
  }

  clear() {
    this.cache.clear()
    this.preloadedFrames.clear()
  }
}

export const imagePreloader = new ImagePreloader()

