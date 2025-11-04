import type { FC, HTMLAttributes } from 'react';
import { clsx } from 'clsx';

export interface LoadingSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  variant?: 'text' | 'rectangular' | 'circular';
}

/**
 * LoadingSkeleton - Animated skeleton component for loading states
 *
 * @example
 * <LoadingSkeleton variant="text" className="h-4 w-32" />
 * <LoadingSkeleton variant="rectangular" className="h-24 w-full" />
 * <LoadingSkeleton variant="circular" className="h-10 w-10" />
 */
export const LoadingSkeleton: FC<LoadingSkeletonProps> = ({
  width,
  height,
  variant = 'rectangular',
  className,
  ...props
}) => {
  const variantStyles = {
    text: 'h-4 rounded',
    rectangular: 'rounded-md',
    circular: 'rounded-full',
  };

  return (
    <div
      className={clsx('skeleton', variantStyles[variant], className)}
      style={{ width, height }}
      {...props}
    />
  );
};

/**
 * HeaderSkeleton - Skeleton for Header component
 */
export const HeaderSkeleton: FC = () => {
  return (
    <header className="bg-slate-800 border-b border-slate-700 px-4 py-4 md:px-6 md:py-5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Logo/Title Section */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <LoadingSkeleton variant="rectangular" className="w-10 h-10" />
            <div className="space-y-2">
              <LoadingSkeleton variant="text" className="h-7 w-32" />
              <LoadingSkeleton variant="text" className="h-4 w-48" />
            </div>
          </div>
        </div>

        {/* Last Updated & Refresh Section */}
        <div className="flex items-center gap-3 sm:gap-4">
          <LoadingSkeleton variant="text" className="h-5 w-40" />
          <LoadingSkeleton variant="rectangular" className="h-9 w-24" />
        </div>
      </div>
    </header>
  );
};

/**
 * ControlPanelSkeleton - Skeleton for ControlPanel component
 */
export const ControlPanelSkeleton: FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column: Filters */}
      <div className="space-y-6">
        {/* Date Range Picker Skeleton */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6">
          <LoadingSkeleton variant="text" className="h-5 w-32 mb-4" />
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[...Array(6)].map((_, i) => (
              <LoadingSkeleton key={i} variant="rectangular" className="h-9" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <LoadingSkeleton variant="rectangular" className="h-10" />
            <LoadingSkeleton variant="rectangular" className="h-10" />
          </div>
        </div>

        {/* Team Filter Skeleton */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6">
          <LoadingSkeleton variant="text" className="h-5 w-24 mb-4" />
          <div className="grid grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <LoadingSkeleton key={i} variant="rectangular" className="h-20" />
            ))}
          </div>
        </div>

        {/* Sector Filter Skeleton */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6">
          <LoadingSkeleton variant="text" className="h-5 w-32 mb-4" />
          <LoadingSkeleton variant="rectangular" className="h-10 w-full" />
        </div>
      </div>

      {/* Right Column: Playback Controls */}
      <div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6">
          <LoadingSkeleton variant="text" className="h-5 w-40 mb-4" />
          <div className="space-y-4">
            {/* Control buttons */}
            <div className="flex justify-center gap-2">
              {[...Array(3)].map((_, i) => (
                <LoadingSkeleton key={i} variant="rectangular" className="h-10 w-10" />
              ))}
            </div>
            {/* Speed control */}
            <LoadingSkeleton variant="rectangular" className="h-10 w-full" />
            {/* Timeline */}
            <LoadingSkeleton variant="rectangular" className="h-2 w-full" />
            {/* Date display */}
            <LoadingSkeleton variant="text" className="h-6 w-32 mx-auto" />
            {/* Reset button */}
            <LoadingSkeleton variant="rectangular" className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * ChartAreaSkeleton - Skeleton for Chart Race area
 */
export const ChartAreaSkeleton: FC = () => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6">
      {/* Chart Title */}
      <LoadingSkeleton variant="text" className="h-7 w-48 mb-6" />

      {/* Chart bars */}
      <div className="space-y-3">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <LoadingSkeleton variant="text" className="h-6 w-8" />
            <LoadingSkeleton
              variant="rectangular"
              className="h-8"
              style={{ width: `${Math.random() * 60 + 40}%` }}
            />
            <LoadingSkeleton variant="text" className="h-6 w-16" />
          </div>
        ))}
      </div>

      {/* Filter stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-700 rounded-lg p-4">
            <LoadingSkeleton variant="text" className="h-4 w-20 mb-2" />
            <LoadingSkeleton variant="text" className="h-8 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
};
