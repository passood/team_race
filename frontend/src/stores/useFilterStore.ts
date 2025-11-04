import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TeamFilter = 'all' | 'blue' | 'white'

export interface DateRange {
  start: string
  end: string
}

interface FilterState {
  // State
  team: TeamFilter
  sectors: string[]
  dateRange: DateRange | null

  // Actions
  setTeam: (team: TeamFilter) => void
  setSectors: (sectors: string[]) => void
  setDateRange: (range: DateRange | null) => void
  toggleSector: (sector: string) => void
  clearSectors: () => void
  reset: () => void
}

const initialState = {
  team: 'all' as TeamFilter,
  sectors: [] as string[],
  dateRange: null as DateRange | null,
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      ...initialState,

      setTeam: (team) => set({ team }),

      setSectors: (sectors) => set({ sectors }),

      setDateRange: (dateRange) => set({ dateRange }),

      toggleSector: (sector) =>
        set((state) => ({
          sectors: state.sectors.includes(sector)
            ? state.sectors.filter((s) => s !== sector)
            : [...state.sectors, sector],
        })),

      clearSectors: () => set({ sectors: [] }),

      reset: () => set(initialState),
    }),
    {
      name: 'team-race-filters',
    }
  )
)
