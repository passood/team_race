import { forwardRef } from 'react'
import { clsx } from 'clsx'
import type { ChartContainerProps } from './types'

/**
 * ChartContainer Component
 *
 * A responsive SVG container for D3.js visualizations.
 * Uses viewBox for scalable vector graphics that maintain aspect ratio.
 *
 * @example
 * ```tsx
 * <ChartContainer width="100%" height={600}>
 *   {/ * D3 visualizations go here * /}
 * </ChartContainer>
 * ```
 */
export const ChartContainer = forwardRef<SVGSVGElement, ChartContainerProps>(
  function ChartContainer(
    {
      width = '100%',
      height = 600,
      children,
      className,
      viewBox,
      preserveAspectRatio = 'xMidYMid meet',
      ...props
    },
    ref
  ) {
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        viewBox={viewBox}
        preserveAspectRatio={preserveAspectRatio}
        className={clsx(
          'overflow-visible', // Allow elements to render outside SVG bounds
          className
        )}
        {...props}
      >
        {children}
      </svg>
    )
  }
)
