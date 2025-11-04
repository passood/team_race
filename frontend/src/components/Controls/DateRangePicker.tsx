import type { FC } from 'react';
import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { sub, format } from 'date-fns';
import { useFilterStore } from '@/stores/useFilterStore';
import { Button } from '@/components/UI/Button';
import { clsx } from 'clsx';

type DatePreset = '1M' | '3M' | '6M' | '1Y' | '3Y' | '5Y' | 'custom';

interface DatePresetOption {
  label: string;
  value: DatePreset;
  getDateRange: () => { start: string; end: string };
}

export const DateRangePicker: FC = () => {
  const { dateRange, setDateRange } = useFilterStore();
  const [selectedPreset, setSelectedPreset] = useState<DatePreset>('1Y');
  const [showCustom, setShowCustom] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const today = new Date();

  const presets: DatePresetOption[] = [
    {
      label: '1M',
      value: '1M',
      getDateRange: () => ({
        start: format(sub(today, { months: 1 }), 'yyyy-MM-dd'),
        end: format(today, 'yyyy-MM-dd'),
      }),
    },
    {
      label: '3M',
      value: '3M',
      getDateRange: () => ({
        start: format(sub(today, { months: 3 }), 'yyyy-MM-dd'),
        end: format(today, 'yyyy-MM-dd'),
      }),
    },
    {
      label: '6M',
      value: '6M',
      getDateRange: () => ({
        start: format(sub(today, { months: 6 }), 'yyyy-MM-dd'),
        end: format(today, 'yyyy-MM-dd'),
      }),
    },
    {
      label: '1Y',
      value: '1Y',
      getDateRange: () => ({
        start: format(sub(today, { years: 1 }), 'yyyy-MM-dd'),
        end: format(today, 'yyyy-MM-dd'),
      }),
    },
    {
      label: '3Y',
      value: '3Y',
      getDateRange: () => ({
        start: format(sub(today, { years: 3 }), 'yyyy-MM-dd'),
        end: format(today, 'yyyy-MM-dd'),
      }),
    },
    {
      label: '5Y',
      value: '5Y',
      getDateRange: () => ({
        start: format(sub(today, { years: 5 }), 'yyyy-MM-dd'),
        end: format(today, 'yyyy-MM-dd'),
      }),
    },
  ];

  const handlePresetClick = (preset: DatePresetOption) => {
    setSelectedPreset(preset.value);
    setShowCustom(false);
    const range = preset.getDateRange();
    setDateRange(range);
  };

  const handleCustomClick = () => {
    setSelectedPreset('custom');
    setShowCustom(true);
    if (dateRange) {
      setCustomStart(dateRange.start);
      setCustomEnd(dateRange.end);
    }
  };

  const handleCustomApply = () => {
    if (customStart && customEnd) {
      // Validate start < end
      if (new Date(customStart) > new Date(customEnd)) {
        alert('Start date must be before end date');
        return;
      }
      setDateRange({ start: customStart, end: customEnd });
    }
  };

  return (
    <div className="space-y-3" role="group" aria-labelledby="date-range-label">
      <div id="date-range-label" className="flex items-center gap-2 text-sm font-medium text-slate-300">
        <Calendar className="w-4 h-4" aria-hidden="true" />
        <span>Date Range</span>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Date range presets">
        {presets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handlePresetClick(preset)}
            aria-pressed={selectedPreset === preset.value}
            aria-label={`Select ${preset.label} date range`}
            className={clsx(
              'px-3 py-1.5 rounded text-sm font-medium transition-colors',
              selectedPreset === preset.value
                ? 'bg-blue-team-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            )}
          >
            {preset.label}
          </button>
        ))}
        <button
          onClick={handleCustomClick}
          aria-pressed={selectedPreset === 'custom'}
          aria-label="Select custom date range"
          className={clsx(
            'px-3 py-1.5 rounded text-sm font-medium transition-colors',
            selectedPreset === 'custom'
              ? 'bg-blue-team-500 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          )}
        >
          Custom
        </button>
      </div>

      {/* Custom Date Inputs */}
      {showCustom && (
        <div className="flex flex-col sm:flex-row gap-3 p-3 bg-slate-700/50 rounded-lg">
          <div className="flex-1">
            <label htmlFor="custom-start-date" className="block text-xs text-slate-400 mb-1">
              Start Date
            </label>
            <input
              id="custom-start-date"
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              aria-label="Custom start date"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-team-500"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="custom-end-date" className="block text-xs text-slate-400 mb-1">
              End Date
            </label>
            <input
              id="custom-end-date"
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              aria-label="Custom end date"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-team-500"
            />
          </div>
          <div className="flex items-end">
            <Button size="sm" onClick={handleCustomApply} aria-label="Apply custom date range">
              Apply
            </Button>
          </div>
        </div>
      )}

      {/* Current Selection Display */}
      {dateRange && (
        <div className="text-xs text-slate-400" role="status" aria-live="polite">
          Selected: {format(new Date(dateRange.start), 'MMM d, yyyy')} -{' '}
          {format(new Date(dateRange.end), 'MMM d, yyyy')}
        </div>
      )}
    </div>
  );
};
