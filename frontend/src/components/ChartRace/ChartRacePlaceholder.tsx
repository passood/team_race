import type { FC } from 'react';
import { BarChart3, Zap, TrendingUp } from 'lucide-react';
import { useFilteredStocks } from '@/hooks/useFilteredStocks';
import { formatNumber } from '@/utils/formatters';

export const ChartRacePlaceholder: FC = () => {
  const { filterStats } = useFilteredStocks();

  return (
    <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border-2 border-dashed border-slate-700 p-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 50px,
            rgba(255, 255, 255, 0.03) 50px,
            rgba(255, 255, 255, 0.03) 51px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 50px,
            rgba(255, 255, 255, 0.03) 50px,
            rgba(255, 255, 255, 0.03) 51px
          )`
        }}/>
      </div>

      {/* Content */}
      <div className="relative text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-team-500/20 blur-xl rounded-full" />
            <div className="relative bg-slate-800 rounded-full p-6 border-2 border-blue-team-500/30">
              <BarChart3 className="w-16 h-16 text-blue-team-400" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-2xl font-bold text-slate-200 mb-2">
            Chart Race Visualization
          </h3>
          <p className="text-slate-400">
            Coming in Phase 3: D3.js Chart Race Implementation
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
            <div className="flex justify-center mb-3">
              <Zap className="w-6 h-6 text-blue-team-400" />
            </div>
            <h4 className="text-sm font-semibold text-slate-200 mb-1">
              60fps Animations
            </h4>
            <p className="text-xs text-slate-400">
              Smooth, high-performance chart race powered by D3.js
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
            <div className="flex justify-center mb-3">
              <TrendingUp className="w-6 h-6 text-blue-team-400" />
            </div>
            <h4 className="text-sm font-semibold text-slate-200 mb-1">
              Real-time Rankings
            </h4>
            <p className="text-xs text-slate-400">
              Watch stocks race in real-time based on market cap
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
            <div className="flex justify-center mb-3">
              <BarChart3 className="w-6 h-6 text-blue-team-400" />
            </div>
            <h4 className="text-sm font-semibold text-slate-200 mb-1">
              Interactive Playback
            </h4>
            <p className="text-xs text-slate-400">
              Control speed, pause, and scrub through history
            </p>
          </div>
        </div>

        {/* Filter Preview */}
        <div className="pt-6 border-t border-slate-700">
          <p className="text-sm text-slate-400 mb-3">
            Ready to visualize:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <div className="bg-blue-team-500/10 border border-blue-team-500/30 rounded-lg px-4 py-2">
              <span className="text-xs text-slate-400">Total Stocks</span>
              <div className="text-lg font-bold text-blue-team-400">
                {formatNumber(filterStats.filtered)}
              </div>
            </div>
            <div className="bg-blue-team-500/10 border border-blue-team-500/30 rounded-lg px-4 py-2">
              <span className="text-xs text-slate-400">Blue Team</span>
              <div className="text-lg font-bold text-blue-team-400">
                {formatNumber(filterStats.byTeam.blue)}
              </div>
            </div>
            <div className="bg-white-team-500/10 border border-white-team-500/30 rounded-lg px-4 py-2">
              <span className="text-xs text-slate-400">White Team</span>
              <div className="text-lg font-bold text-white-team-400">
                {formatNumber(filterStats.byTeam.white)}
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-team-500/10 border border-blue-team-500/30 rounded-full">
          <div className="w-2 h-2 bg-blue-team-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-blue-team-300">
            Phase 3: Coming Soon
          </span>
        </div>
      </div>
    </div>
  );
};
