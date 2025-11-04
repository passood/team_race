import { create } from 'zustand'

export type PlaybackSpeed = 0.2 | 0.5 | 1

interface PlaybackState {
  // State
  isPlaying: boolean
  speed: PlaybackSpeed
  currentIndex: number
  currentDate: string | null

  // Actions
  play: () => void
  pause: () => void
  toggle: () => void
  setSpeed: (speed: PlaybackSpeed) => void
  seekToIndex: (index: number) => void
  setCurrentDate: (date: string) => void
  nextFrame: () => void
  previousFrame: () => void
  reset: () => void
}

const initialState = {
  isPlaying: false,
  speed: 0.5 as PlaybackSpeed,
  currentIndex: 0,
  currentDate: null as string | null,
}

export const usePlaybackStore = create<PlaybackState>((set) => ({
  ...initialState,

  play: () => set({ isPlaying: true }),

  pause: () => set({ isPlaying: false }),

  toggle: () => set((state) => ({ isPlaying: !state.isPlaying })),

  setSpeed: (speed) => set({ speed }),

  seekToIndex: (index) => set({ currentIndex: index, isPlaying: false }),

  setCurrentDate: (date) => set({ currentDate: date }),

  nextFrame: () =>
    set((state) => ({
      currentIndex: state.currentIndex + 1,
    })),

  previousFrame: () =>
    set((state) => ({
      currentIndex: Math.max(0, state.currentIndex - 1),
    })),

  reset: () => set(initialState),
}))
