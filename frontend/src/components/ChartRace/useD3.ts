import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

/**
 * Custom hook for integrating D3.js with React
 *
 * This hook follows the pattern where:
 * - React manages the SVG element lifecycle (via ref)
 * - D3 manipulates the DOM inside the SVG
 * - React state changes trigger D3 re-renders via dependencies
 *
 * @param renderFn - Function that receives a D3 selection and performs D3 operations
 * @param dependencies - Array of dependencies that trigger re-renders (like useEffect)
 * @returns React ref to attach to an SVG element
 *
 * @example
 * ```tsx
 * const MyChart = ({ data }) => {
 *   const svgRef = useD3(
 *     (svg) => {
 *       // D3 code here
 *       svg.selectAll('circle')
 *         .data(data)
 *         .join('circle')
 *         .attr('cx', d => d.x)
 *         .attr('cy', d => d.y);
 *     },
 *     [data] // Re-render when data changes
 *   );
 *
 *   return <svg ref={svgRef} width={500} height={500} />;
 * };
 * ```
 */
export const useD3 = <T extends SVGSVGElement | SVGGElement>(
  renderFn: (
    selection: d3.Selection<T, unknown, null, undefined>
  ) => void | (() => void),
  dependencies: React.DependencyList = []
): React.RefObject<T> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    // Only proceed if the ref is attached to a DOM element
    if (!ref.current) {
      return;
    }

    // Create D3 selection from the ref
    const selection = d3.select(ref.current);

    // Call the render function and capture optional cleanup function
    const cleanup = renderFn(selection);

    // Return cleanup function if provided by renderFn
    // This allows D3 event listeners to be properly removed
    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return ref as React.RefObject<T>;
};

/**
 * Type helper for D3 selections of SVG elements
 * Useful for typing D3 selection parameters in render functions
 */
export type D3Selection<T extends SVGElement = SVGSVGElement> = d3.Selection<
  T,
  unknown,
  null,
  undefined
>;

/**
 * Type helper for D3 transitions
 * Useful for typing transition objects in animations
 */
export type D3Transition<T extends SVGElement = SVGSVGElement> = d3.Transition<
  T,
  unknown,
  null,
  undefined
>;
