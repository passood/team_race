/**
 * Chart Race TypeScript Type Definitions
 *
 * This file contains all TypeScript interfaces and types specific to the chart race visualization.
 */

/**
 * Individual stock data for a single frame in the chart race
 */
export interface ChartRaceStock {
  /** Stock ticker symbol (e.g., "TSLA", "AAPL") */
  ticker: string

  /** Full company name (e.g., "Tesla, Inc.") */
  name: string

  /** Cumulative return as a multiplier (e.g., 1.0 = 100%, 1.25 = 125%, 0.75 = 75%) */
  cumulativeReturn: number

  /** Current rank (1 = highest cumulative return) */
  rank: number

  /** Team affiliation: 'blue' for future sectors, 'white' for traditional sectors */
  team: 'blue' | 'white'

  /** Sector category (e.g., "Next-Gen Battery/ESS", "Data Infrastructure") */
  sector: string

  /** Percentage change from previous frame (-100 to +infinity) */
  percentChange: number
}

/**
 * Single frame in the chart race animation
 * Represents the state of all stocks at a specific date
 */
export interface ChartRaceFrame {
  /** Date in YYYY-MM-DD format */
  date: string

  /** Array of stock data for this frame, sorted by rank */
  stocks: ChartRaceStock[]
}

/**
 * Dimensions for the chart SVG container
 * Used for responsive sizing and calculating scales
 */
export interface ChartDimensions {
  /** Total width of the SVG (including margins) */
  width: number

  /** Total height of the SVG (including margins) */
  height: number

  /** Margin configuration for the chart */
  margin: {
    top: number
    right: number
    bottom: number
    left: number
  }
}

/**
 * Computed inner dimensions (excluding margins)
 */
export interface ChartInnerDimensions {
  /** Width of the plotting area (width - margin.left - margin.right) */
  innerWidth: number

  /** Height of the plotting area (height - margin.top - margin.bottom) */
  innerHeight: number
}

/**
 * Configuration for chart animations
 */
export interface ChartAnimationConfig {
  /** Duration of each transition in milliseconds */
  duration: number

  /** D3 easing function name (e.g., 'easeCubicInOut', 'easeLinear') */
  easing: 'easeCubicInOut' | 'easeLinear' | 'easeQuadInOut' | 'easeSinInOut'

  /** Delay before animation starts (in milliseconds) */
  delay?: number
}

/**
 * Props for the BarChart component
 */
export interface BarChartProps {
  /** Current frame to display */
  frame: ChartRaceFrame

  /** Chart dimensions */
  dimensions: ChartDimensions

  /** Animation configuration */
  animationConfig?: ChartAnimationConfig

  /** Callback when a bar is clicked */
  onStockClick?: (stock: ChartRaceStock) => void

  /** Callback when a bar is hovered */
  onStockHover?: (stock: ChartRaceStock | null) => void

  /** Optional CSS class name */
  className?: string
}

/**
 * Props for the ChartContainer component
 */
export interface ChartContainerProps {
  /** SVG width (defaults to 100% of container) */
  width?: number | string

  /** SVG height (defaults to 600px) */
  height?: number | string

  /** Child elements to render inside the SVG (optional, D3 can render dynamically) */
  children?: React.ReactNode

  /** Optional CSS class name */
  className?: string

  /** Optional viewBox for responsive scaling */
  viewBox?: string

  /** Preserve aspect ratio setting */
  preserveAspectRatio?: string
}

/**
 * Tooltip data structure
 */
export interface ChartTooltipData {
  /** Stock data to display in tooltip */
  stock: ChartRaceStock

  /** X position for tooltip (in pixels) */
  x: number

  /** Y position for tooltip (in pixels) */
  y: number

  /** Whether tooltip is visible */
  visible: boolean
}
