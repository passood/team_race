import { memo } from 'react'
import * as d3 from 'd3'
import { clsx } from 'clsx'
import { useD3 } from './useD3'
import { ChartContainer } from './ChartContainer'
import type { BarChartProps, ChartRaceStock } from './types'
import { formatPercentage } from '@/utils/formatters'

/**
 * BarChart Component
 *
 * A horizontal bar chart race visualization using D3.js.
 * Displays the top 20 stocks by cumulative return percentage with:
 * - Color coding (blue team vs white team, darker for negative returns)
 * - Smooth transitions (Phase 3.2)
 * - Interactive hover/click (Phase 3.5)
 * - Support for negative returns (bars extend left from 0% baseline)
 *
 * D3 Pattern:
 * - React manages the SVG element via useD3 hook
 * - D3 manipulates the DOM inside the SVG
 * - State changes trigger D3 re-renders
 */
export const BarChart = memo(function BarChart({
  frame,
  dimensions,
  animationConfig = {
    duration: 500,
    easing: 'easeCubicInOut',
  },
  onStockClick,
  onStockHover,
  className,
}: BarChartProps) {
  const { width, height, margin } = dimensions
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  // Number of bars to display (top 20)
  const MAX_BARS = 20
  const stocks = frame.stocks.slice(0, MAX_BARS)

  /**
   * D3 Render Function
   * This function is called by useD3 hook whenever dependencies change
   */
  const svgRef = useD3(
    (svg) => {
      // Get or create main group with margins
      let g = svg.select<SVGGElement>('g.main-group')

      if (g.empty()) {
        g = svg
          .append('g')
          .attr('class', 'main-group')
          .attr('transform', `translate(${margin.left},${margin.top})`)
      }

      // --- SCALES ---

      // X Scale: Cumulative Return (horizontal)
      // Support negative values with 0% baseline (1.0 = 100%)
      const minReturn = d3.min(stocks, (d) => d.cumulativeReturn) || 0
      const maxReturn = d3.max(stocks, (d) => d.cumulativeReturn) || 1

      // Ensure domain includes 1.0 (100% = 0% change) and has some padding
      const domainMin = Math.min(minReturn * 0.95, 1.0)
      const domainMax = Math.max(maxReturn * 1.05, 1.0)

      const xScale = d3
        .scaleLinear()
        .domain([domainMin, domainMax])
        .range([0, innerWidth])
        .nice() // Round domain to nice values

      // Calculate the x position of the baseline (1.0 = 100% = no change)
      const baselineX = xScale(1.0)

      // Y Scale: Stock Ranking (vertical)
      // Use scaleBand for evenly spaced bars
      const yScale = d3
        .scaleBand()
        .domain(stocks.map((d) => d.ticker))
        .range([0, innerHeight])
        .padding(0.2) // Space between bars

      // Color Scale: Team colors (darker shade for negative returns)
      const colorScale = (team: 'blue' | 'white', isNegative: boolean) => {
        if (team === 'blue') {
          return isNegative
            ? 'rgb(37, 99, 235)' // blue-600 (darker for negative)
            : 'rgb(59, 130, 246)' // blue-500
        } else {
          return isNegative
            ? 'rgb(75, 85, 99)' // gray-600 (darker for negative)
            : 'rgb(107, 114, 128)' // gray-500
        }
      }

      // --- BARS ---

      // Get D3 easing function
      const easingFn = d3[animationConfig.easing] || d3.easeCubicInOut

      const bars = g
        .selectAll<SVGRectElement, ChartRaceStock>('.bar')
        .data(stocks, (d) => d.ticker) // Key function for enter/update/exit
        .join(
          // Enter: New bars appear immediately at full width
          (enter) =>
            enter
              .append('rect')
              .attr('class', 'bar')
              .attr('x', (d) => {
                // If negative return, bar starts left of baseline
                // If positive return, bar starts at baseline
                return d.cumulativeReturn < 1.0 ? xScale(d.cumulativeReturn) : baselineX
              })
              .attr('y', (d) => yScale(d.ticker) || 0)
              .attr('width', (d) => {
                // Width is the distance from baseline
                return Math.abs(xScale(d.cumulativeReturn) - baselineX)
              })
              .attr('height', yScale.bandwidth())
              .attr('fill', (d) => colorScale(d.team, d.cumulativeReturn < 1.0))
              .attr('rx', 4)
              .style('cursor', onStockClick ? 'pointer' : 'default')
              .attr('opacity', 1), // Fully visible immediately
          // Update: Existing bars transition to new positions/widths
          (update) =>
            update.call((update) =>
              update
                .transition()
                .duration(animationConfig.duration)
                .ease(easingFn)
                .attr('x', (d) => {
                  return d.cumulativeReturn < 1.0 ? xScale(d.cumulativeReturn) : baselineX
                })
                .attr('y', (d) => yScale(d.ticker) || 0) // Transition Y position (ranking)
                .attr('width', (d) => {
                  return Math.abs(xScale(d.cumulativeReturn) - baselineX)
                })
                .attr('fill', (d) => colorScale(d.team, d.cumulativeReturn < 1.0)) // Update color
            ),
          // Exit: Remove bars immediately
          (exit) => exit.remove()
        )

      // Add hover effect
      if (onStockHover) {
        bars
          .on('mouseenter', function (_event, d) {
            d3.select(this)
              .transition()
              .duration(200)
              .attr('opacity', 0.8)
            onStockHover(d)
          })
          .on('mouseleave', function () {
            d3.select(this)
              .transition()
              .duration(200)
              .attr('opacity', 1)
            onStockHover(null)
          })
      }

      // Add click handler
      if (onStockClick) {
        bars.on('click', (_event, d) => {
          onStockClick(d)
        })
      }

      // --- LABELS ---

      // Rank numbers (left side)
      g.selectAll<SVGTextElement, ChartRaceStock>('.rank-label')
        .data(stocks, (d) => d.ticker)
        .join(
          (enter) =>
            enter
              .append('text')
              .attr('class', 'rank-label')
              .attr('x', -10)
              .attr('y', (d) => (yScale(d.ticker) || 0) + yScale.bandwidth() / 2)
              .attr('text-anchor', 'end')
              .attr('dominant-baseline', 'middle')
              .attr('fill', 'rgb(248, 250, 252)') // slate-50
              .attr('font-size', '16px')
              .attr('font-weight', 'bold')
              .attr('opacity', 1)
              .text((d) => d.rank),
          (update) =>
            update.call((update) =>
              update
                .transition()
                .duration(animationConfig.duration)
                .ease(easingFn)
                .attr('y', (d) => (yScale(d.ticker) || 0) + yScale.bandwidth() / 2)
                .tween('text', function (d) {
                  const node = this
                  const currentText = parseInt(node.textContent || '0')
                  const interpolator = d3.interpolateNumber(currentText, d.rank)
                  return function (t) {
                    node.textContent = Math.round(interpolator(t)).toString()
                  }
                })
            ),
          (exit) => exit.remove()
        )

      // Stock ticker + name (inside bar if long enough, outside if short)
      g.selectAll<SVGTextElement, ChartRaceStock>('.ticker-label')
        .data(stocks, (d) => d.ticker)
        .join(
          (enter) =>
            enter
              .append('text')
              .attr('class', 'ticker-label')
              .attr('x', (d) => {
                const barWidth = Math.abs(xScale(d.cumulativeReturn) - baselineX)
                const barX = d.cumulativeReturn < 1.0 ? xScale(d.cumulativeReturn) : baselineX
                // If bar is too short (< 200px), place text outside
                if (barWidth < 200) {
                  // For negative returns, place text to the left
                  // For positive returns, place text to the right
                  return d.cumulativeReturn < 1.0 ? barX - 10 : barX + barWidth + 10
                }
                // Inside the bar
                return d.cumulativeReturn < 1.0 ? barX + 10 : barX + 10
              })
              .attr('y', (d) => (yScale(d.ticker) || 0) + yScale.bandwidth() / 2)
              .attr('text-anchor', (d) => {
                const barWidth = Math.abs(xScale(d.cumulativeReturn) - baselineX)
                if (barWidth < 200 && d.cumulativeReturn < 1.0) {
                  return 'end' // Text outside on left side
                }
                return 'start'
              })
              .attr('dominant-baseline', 'middle')
              .attr('fill', (d) => {
                const barWidth = Math.abs(xScale(d.cumulativeReturn) - baselineX)
                // White text inside bar, slate text outside
                return barWidth < 200 ? 'rgb(248, 250, 252)' : 'white'
              })
              .attr('font-size', '14px')
              .attr('font-weight', '600')
              .attr('opacity', 1)
              .text((d) => `${d.ticker} - ${d.name}`),
          (update) =>
            update.call((update) =>
              update
                .transition()
                .duration(animationConfig.duration)
                .ease(easingFn)
                .attr('x', (d) => {
                  const barWidth = Math.abs(xScale(d.cumulativeReturn) - baselineX)
                  const barX = d.cumulativeReturn < 1.0 ? xScale(d.cumulativeReturn) : baselineX
                  if (barWidth < 200) {
                    return d.cumulativeReturn < 1.0 ? barX - 10 : barX + barWidth + 10
                  }
                  return d.cumulativeReturn < 1.0 ? barX + 10 : barX + 10
                })
                .attr('y', (d) => (yScale(d.ticker) || 0) + yScale.bandwidth() / 2)
                .attr('text-anchor', (d) => {
                  const barWidth = Math.abs(xScale(d.cumulativeReturn) - baselineX)
                  if (barWidth < 200 && d.cumulativeReturn < 1.0) {
                    return 'end'
                  }
                  return 'start'
                })
                .attr('fill', (d) => {
                  const barWidth = Math.abs(xScale(d.cumulativeReturn) - baselineX)
                  return barWidth < 200 ? 'rgb(248, 250, 252)' : 'white'
                })
            ),
          (exit) => exit.remove()
        )

      // Cumulative return percentage (hide if bar is too short to avoid overlap)
      g.selectAll<SVGTextElement, ChartRaceStock>('.return-label')
        .data(stocks, (d) => d.ticker)
        .join(
          (enter) =>
            enter
              .append('text')
              .attr('class', 'return-label')
              .attr('x', (d) => {
                const barWidth = Math.abs(xScale(d.cumulativeReturn) - baselineX)
                if (d.cumulativeReturn < 1.0) {
                  // Negative return: label inside bar on right edge
                  return xScale(d.cumulativeReturn) + barWidth - 10
                } else {
                  // Positive return: label inside bar on right edge
                  return xScale(d.cumulativeReturn) - 10
                }
              })
              .attr('y', (d) => (yScale(d.ticker) || 0) + yScale.bandwidth() / 2)
              .attr('text-anchor', 'end')
              .attr('dominant-baseline', 'middle')
              .attr('fill', 'white')
              .attr('font-size', '14px')
              .attr('font-weight', '600')
              .attr('opacity', (d) => {
                const barWidth = Math.abs(xScale(d.cumulativeReturn) - baselineX)
                // Hide label if bar is too short
                return barWidth < 200 ? 0 : 1
              })
              .text((d) => formatPercentage(d.cumulativeReturn - 1, 1, true)),
          (update) =>
            update.call((update) =>
              update
                .transition()
                .duration(animationConfig.duration)
                .ease(easingFn)
                .attr('x', (d) => {
                  const barWidth = Math.abs(xScale(d.cumulativeReturn) - baselineX)
                  if (d.cumulativeReturn < 1.0) {
                    return xScale(d.cumulativeReturn) + barWidth - 10
                  } else {
                    return xScale(d.cumulativeReturn) - 10
                  }
                })
                .attr('y', (d) => (yScale(d.ticker) || 0) + yScale.bandwidth() / 2)
                .attr('opacity', (d) => {
                  const barWidth = Math.abs(xScale(d.cumulativeReturn) - baselineX)
                  return barWidth < 200 ? 0 : 1
                })
                .textTween(function (d) {
                  const node = this
                  const currentText = node.textContent || '0%'
                  const currentValue = parseFloat(currentText.replace(/[^0-9.-]/g, '')) / 100
                  const targetValue = d.cumulativeReturn - 1
                  const interpolator = d3.interpolateNumber(currentValue, targetValue)
                  return function (t) {
                    const value = formatPercentage(interpolator(t), 1, true)
                    node.textContent = value
                    return value
                  }
                })
            ),
          (exit) => exit.remove()
        )

      // --- AXES ---

      // X Axis (bottom) - Format as percentage
      const xAxis = d3
        .axisBottom(xScale)
        .ticks(5)
        .tickFormat((d) => {
          // Convert from multiplier to percentage (1.0 = 100%, 1.5 = 150%)
          const percentValue = (d as number - 1) * 100
          return `${percentValue >= 0 ? '+' : ''}${percentValue.toFixed(0)}%`
        })

      // Get or create x-axis group
      let xAxisGroup = g.select<SVGGElement>('g.x-axis')

      if (xAxisGroup.empty()) {
        xAxisGroup = g
          .append('g')
          .attr('class', 'x-axis')
          .attr('transform', `translate(0,${innerHeight})`)
      }

      // Update axis with transition
      xAxisGroup
        .transition()
        .duration(animationConfig.duration)
        .ease(easingFn)
        .call(xAxis)

      // Style axis text
      xAxisGroup.selectAll('text').attr('fill', 'rgb(148, 163, 184)') // slate-400

      // Style axis lines
      xAxisGroup.selectAll('line, path').attr('stroke', 'rgb(71, 85, 105)') // slate-600

      // Cleanup function (optional - for event listeners)
      return () => {
        // D3 event listeners are automatically removed when elements are removed
      }
    },
    [stocks, innerWidth, innerHeight, animationConfig, onStockClick, onStockHover] // Dependencies
  )

  return (
    <div className={clsx('relative', className)}>
      {/* Current Date Display */}
      <div className="absolute top-4 right-4 text-slate-50 text-3xl font-bold opacity-90 transition-opacity duration-300">
        {new Date(frame.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>

      {/* SVG Chart */}
      <ChartContainer
        ref={svgRef as React.Ref<SVGSVGElement>}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="bg-slate-900"
      >
        {/* D3 will render content via useD3 hook */}
      </ChartContainer>
    </div>
  )
})
