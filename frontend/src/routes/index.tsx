import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useEffect } from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { ControlPanel } from '@/components/Controls/ControlPanel'
import { BarChart } from '@/components/ChartRace/BarChart'
import type { ChartDimensions } from '@/components/ChartRace/types'
import { Card } from '@/components/UI/Card'
import { useFilteredStocks } from '@/hooks/useFilteredStocks'
import { useDateRange } from '@/hooks/useDateRange'
import { useFilterStore } from '@/stores/useFilterStore'
import { usePlaybackStore } from '@/stores/usePlaybackStore'
import { useAnimationLoop } from '@/hooks/useAnimationLoop'
import { LoadingSpinner } from '@/components/UI/LoadingSpinner'
import { ErrorMessage } from '@/components/UI/ErrorMessage'
import { formatNumber } from '@/utils/formatters'
import {
  prepareChartRaceFrames,
  getFrameByIndex,
  getTotalFrames,
} from '@/utils/chartRaceData'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { stocks, filteredStocks, filterStats, isLoading, error } =
    useFilteredStocks()
  const { dateRange } = useDateRange()
  const { team, sectors } = useFilterStore()

  // Get playback state and actions from store
  const {
    currentIndex,
    setCurrentDate,
    reset,
  } = usePlaybackStore()

  // Prepare chart race frames from filtered stock data
  const frames = useMemo(() => {
    if (!filteredStocks || filteredStocks.length === 0) {
      return []
    }

    // Calculate date range from filtered stocks if not explicitly set
    let effectiveDateRange = dateRange

    if (!effectiveDateRange) {
      // Find min and max dates from all stock histories
      let minDate = ''
      let maxDate = ''

      filteredStocks.forEach((stock) => {
        stock.history.forEach((point) => {
          if (!minDate || point.date < minDate) minDate = point.date
          if (!maxDate || point.date > maxDate) maxDate = point.date
        })
      })

      if (minDate && maxDate) {
        effectiveDateRange = { start: minDate, end: maxDate }
      } else {
        return [] // No valid dates found
      }
    }

    return prepareChartRaceFrames(filteredStocks, effectiveDateRange, {
      team,
      selectedSectors: sectors,
    })
  }, [filteredStocks, dateRange, team, sectors])

  // Activate auto-playback animation loop
  useAnimationLoop(frames)

  // Get current frame and total frames
  const currentFrame = getFrameByIndex(frames, currentIndex)
  const totalFrames = getTotalFrames(frames)

  // Reset to first frame when filters change
  useEffect(() => {
    reset()
  }, [frames, reset])

  // Sync currentDate in store when frame changes
  useEffect(() => {
    if (currentFrame) {
      setCurrentDate(currentFrame.date)
    }
  }, [currentFrame, setCurrentDate])

  // Chart dimensions
  const chartDimensions: ChartDimensions = {
    width: 1200,
    height: 600,
    margin: {
      top: 20,
      right: 120,
      bottom: 40,
      left: 200,
    },
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Chart Race */}
        {isLoading && (
          <Card>
            <div className="py-12">
              <LoadingSpinner size="lg" label="Loading stock data..." />
            </div>
          </Card>
        )}

        {error && (
          <Card>
            <ErrorMessage
              title="Failed to load stock data"
              message={
                error instanceof Error ? error.message : 'Unknown error occurred'
              }
            />
          </Card>
        )}

        {stocks && !isLoading && !error && (
          <Card>
            {currentFrame ? (
              <BarChart
                frame={currentFrame}
                dimensions={chartDimensions}
                animationConfig={{
                  duration: 750,
                  easing: 'easeCubicInOut',
                }}
              />
            ) : (
              <div className="py-12 text-center text-slate-400">
                <p className="text-lg mb-2">No data available for chart</p>
                <p className="text-sm">
                  Try adjusting your filters or date range to see stocks.
                </p>
              </div>
            )}
          </Card>
        )}

        {/* Control Panel */}
        {stocks && !isLoading && !error && (
          <ControlPanel totalFrames={totalFrames} />
        )}

        {/* Filter Statistics */}
        {stocks && !isLoading && (
          <Card header="Filter Statistics">
            <div className="space-y-4">
              {/* Main Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-slate-200">
                    {formatNumber(filterStats.total)}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Total Available
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-team-400">
                    {formatNumber(filterStats.filtered)}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Currently Filtered
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-team-400">
                    {formatNumber(filterStats.byTeam.blue)}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Blue Team</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white-team-400">
                    {formatNumber(filterStats.byTeam.white)}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">White Team</div>
                </div>
              </div>

              {/* Sector Breakdown */}
              {Object.keys(filterStats.bySector).length > 0 && (
                <div className="pt-4 border-t border-slate-700">
                  <h3 className="text-sm font-medium text-slate-300 mb-3">
                    By Sector
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {Object.entries(filterStats.bySector).map(
                      ([sector, count]) => (
                        <div
                          key={sector}
                          className="bg-slate-800/50 rounded px-3 py-2 flex justify-between items-center"
                        >
                          <span className="text-xs text-slate-400 truncate">
                            {sector}
                          </span>
                          <span className="text-sm font-semibold text-slate-200 ml-2">
                            {count}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Filtered Stocks Count */}
              {filteredStocks.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-sm">
                  No stocks match the current filters. Try adjusting your date
                  range, team, or sector selections.
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
