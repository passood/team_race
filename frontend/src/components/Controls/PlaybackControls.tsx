import type { FC } from 'react';
import { Play, Pause, SkipBack, SkipForward, Gauge } from 'lucide-react';
import { format } from 'date-fns';
import { usePlaybackStore } from '@/stores/usePlaybackStore';
import { Button } from '@/components/UI/Button';
import { clsx } from 'clsx';

const SPEED_OPTIONS = [0.2, 0.5, 1] as const;

interface PlaybackControlsProps {
  totalFrames?: number;
}

export const PlaybackControls: FC<PlaybackControlsProps> = ({ totalFrames = 0 }) => {
  const {
    isPlaying,
    speed,
    currentDate,
    currentIndex,
    toggle,
    setSpeed,
    seekToIndex,
    previousFrame,
    nextFrame,
    reset,
  } = usePlaybackStore();

  const formatDate = (date: string | null) => {
    if (!date) return 'No date';
    try {
      return format(new Date(date), 'MMM d, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-4" role="group" aria-labelledby="playback-controls-label">
      <div id="playback-controls-label" className="flex items-center gap-2 text-sm font-medium text-slate-300">
        <Play className="w-4 h-4" aria-hidden="true" />
        <span>Playback Controls</span>
      </div>

      {/* Current Date Display */}
      <div className="bg-slate-800/50 rounded-lg p-4 text-center" role="status" aria-live="polite">
        <div className="text-xs text-slate-400 mb-1">Current Date</div>
        <div className="text-xl font-bold text-blue-team-400">
          {formatDate(currentDate)}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          Frame {currentIndex + 1} of {totalFrames}
        </div>
      </div>

      {/* Playback Buttons */}
      <div className="flex items-center justify-center gap-2" role="group" aria-label="Playback navigation">
        <Button
          variant="secondary"
          size="sm"
          onClick={previousFrame}
          disabled={currentIndex === 0}
          aria-label="Go to previous frame"
        >
          <SkipBack className="w-4 h-4" aria-hidden="true" />
        </Button>

        <Button
          variant="primary"
          size="lg"
          onClick={toggle}
          className="min-w-[120px]"
          aria-label={isPlaying ? 'Pause playback' : 'Start playback'}
          aria-pressed={isPlaying}
        >
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5 mr-2" aria-hidden="true" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" aria-hidden="true" />
              Play
            </>
          )}
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={nextFrame}
          disabled={currentIndex >= totalFrames - 1}
          aria-label="Go to next frame"
        >
          <SkipForward className="w-4 h-4" aria-hidden="true" />
        </Button>
      </div>

      {/* Timeline Scrubber */}
      <div className="space-y-2">
        <label htmlFor="timeline-scrubber" className="flex items-center gap-2 text-xs text-slate-400">
          <span>Timeline</span>
        </label>
        <input
          id="timeline-scrubber"
          type="range"
          min="0"
          max={Math.max(0, totalFrames - 1)}
          value={currentIndex}
          onChange={(e) => seekToIndex(parseInt(e.target.value, 10))}
          disabled={totalFrames === 0}
          aria-label={`Timeline scrubber, frame ${currentIndex + 1} of ${totalFrames}`}
          aria-valuemin={0}
          aria-valuemax={totalFrames - 1}
          aria-valuenow={currentIndex}
          aria-valuetext={`Frame ${currentIndex + 1} of ${totalFrames}`}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: totalFrames > 1 ? `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
              (currentIndex / (totalFrames - 1)) * 100
            }%, #334155 ${(currentIndex / (totalFrames - 1)) * 100}%, #334155 100%)` : '#334155',
          }}
        />
      </div>

      {/* Speed Control */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-400" id="speed-control-label">
          <Gauge className="w-3 h-3" aria-hidden="true" />
          <span>Playback Speed: {speed}x</span>
        </div>
        <div className="flex gap-2" role="group" aria-labelledby="speed-control-label">
          {SPEED_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => setSpeed(option)}
              aria-pressed={speed === option}
              aria-label={`Set playback speed to ${option}x`}
              className={clsx(
                'flex-1 px-3 py-2 rounded text-sm font-medium transition-colors',
                speed === option
                  ? 'bg-blue-team-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              )}
            >
              {option}x
            </button>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={reset}
        aria-label="Reset playback to start"
        className="w-full px-3 py-2 text-xs font-medium rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
      >
        Reset to Start
      </button>
    </div>
  );
};
