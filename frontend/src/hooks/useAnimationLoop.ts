/**
 * useAnimationLoop Hook
 *
 * Manages the requestAnimationFrame loop for auto-playing the chart race animation.
 * Syncs with PlaybackStore state (isPlaying, speed, currentIndex) and automatically
 * advances frames based on configured speed multiplier (0.5x to 10x).
 *
 * Performance: Uses RAF for 60fps animations, calculates frame timing based on speed.
 * Auto-pauses when reaching the end of the timeline.
 */

import { useEffect, useRef } from 'react'
import { usePlaybackStore } from '../stores/usePlaybackStore'
import type { ChartRaceFrame } from '../components/ChartRace/types'
import { getTotalFrames } from '../utils/chartRaceData'

/**
 * Base duration for a single frame at 1x speed (in milliseconds)
 * At different speeds:
 * - 0.5x: 1000ms per frame (slower)
 * - 1x:   500ms per frame (normal)
 * - 2x:   250ms per frame (faster)
 * - 5x:   100ms per frame (very fast)
 * - 10x:  50ms per frame (ultra fast)
 */
const BASE_FRAME_DURATION = 500

/**
 * Custom hook that manages automatic frame advancement during playback
 *
 * @param frames - Array of chart race frames (used to determine total frame count)
 *
 * @example
 * ```tsx
 * function ChartRaceView() {
 *   const frames = prepareChartRaceFrames(...)
 *   useAnimationLoop(frames) // Activates auto-playback
 *
 *   const { currentIndex } = usePlaybackStore()
 *   const currentFrame = getFrameByIndex(frames, currentIndex)
 *
 *   return <BarChart frame={currentFrame} />
 * }
 * ```
 */
export function useAnimationLoop(frames: ChartRaceFrame[]): void {
  // Get playback state from store
  const { isPlaying, speed, currentIndex, nextFrame, pause } = usePlaybackStore()

  // Calculate total frames
  const totalFrames = getTotalFrames(frames)

  // Refs for animation loop (persists across renders)
  const rafIdRef = useRef<number | null>(null)
  const lastFrameTimeRef = useRef<number>(0)

  useEffect(() => {
    // Don't start loop if not playing or no frames
    if (!isPlaying || totalFrames === 0) {
      // Clean up any existing RAF
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
      return
    }

    // Calculate frame duration based on speed multiplier
    const frameDuration = BASE_FRAME_DURATION / speed

    // Initialize timing reference
    lastFrameTimeRef.current = Date.now()

    /**
     * Animation loop using requestAnimationFrame
     * Runs at ~60fps, checks elapsed time to determine when to advance frame
     */
    const animate = () => {
      // Check if we should stop (state might have changed)
      if (!isPlaying) {
        rafIdRef.current = null
        return
      }

      const now = Date.now()
      const elapsed = now - lastFrameTimeRef.current

      // Check if enough time has passed for the next frame
      if (elapsed >= frameDuration) {
        // Check if we've reached the last frame
        if (currentIndex >= totalFrames - 1) {
          // Auto-pause at end of timeline
          pause()
          rafIdRef.current = null
          return
        }

        // Advance to next frame
        nextFrame()

        // Reset frame timer
        lastFrameTimeRef.current = now
      }

      // Continue animation loop
      rafIdRef.current = requestAnimationFrame(animate)
    }

    // Start the animation loop
    rafIdRef.current = requestAnimationFrame(animate)

    // Cleanup on unmount or when dependencies change
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
    }
  }, [isPlaying, speed, currentIndex, totalFrames, nextFrame, pause])
}
