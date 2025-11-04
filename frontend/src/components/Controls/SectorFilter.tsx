import type { FC } from 'react';
import { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { useFilterStore } from '@/stores/useFilterStore';
import { clsx } from 'clsx';

// Import from shared config (we'll need to copy this or create types)
const ALL_SECTORS = [
  'Quantum Computing',
  'Aerospace & Defense',
  'Longevity Biotech',
  'AI & Cloud',
  'Semiconductors',
  'Robotics & EV',
  'Traditional Energy',
  'Future Energy',
  'Industrials',
  'Banking',
  'Consumer Goods',
];

export const SectorFilter: FC = () => {
  const { sectors, setSectors, toggleSector, clearSectors } = useFilterStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectAll = () => {
    setSectors(ALL_SECTORS);
  };

  const handleClearAll = () => {
    clearSectors();
  };

  const selectedCount = sectors.length;
  const allSelected = selectedCount === ALL_SECTORS.length;

  return (
    <div className="space-y-3">
      <div id="sector-filter-label" className="flex items-center gap-2 text-sm font-medium text-slate-300">
        <Filter className="w-4 h-4" aria-hidden="true" />
        <span>Sector Filter</span>
      </div>

      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="sector-dropdown-content"
        aria-label={`Sector filter: ${selectedCount === 0 ? 'No sectors selected' : allSelected ? 'All sectors selected' : `${selectedCount} sector${selectedCount !== 1 ? 's' : ''} selected`}`}
        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-300">
            {selectedCount === 0
              ? 'No sectors selected'
              : allSelected
              ? 'All sectors selected'
              : `${selectedCount} sector${selectedCount !== 1 ? 's' : ''} selected`}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div id="sector-dropdown-content" className="bg-slate-800 border border-slate-700 rounded-lg p-3 space-y-2" role="group" aria-labelledby="sector-filter-label">
          {/* Select All / Clear All */}
          <div className="flex gap-2 pb-2 border-b border-slate-700">
            <button
              onClick={handleSelectAll}
              disabled={allSelected}
              aria-label="Select all sectors"
              className="flex-1 px-3 py-1.5 text-xs font-medium rounded bg-blue-team-500/10 text-blue-team-400 hover:bg-blue-team-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Select All
            </button>
            <button
              onClick={handleClearAll}
              disabled={selectedCount === 0}
              aria-label="Clear all selected sectors"
              className="flex-1 px-3 py-1.5 text-xs font-medium rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear All
            </button>
          </div>

          {/* Sector Checkboxes */}
          <div className="max-h-64 overflow-y-auto space-y-1" role="group" aria-label="Sector checkboxes">
            {ALL_SECTORS.map((sector) => {
              const isSelected = sectors.includes(sector);
              return (
                <label
                  key={sector}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-colors',
                    isSelected
                      ? 'bg-blue-team-500/10 hover:bg-blue-team-500/20'
                      : 'hover:bg-slate-700'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSector(sector)}
                    aria-label={`Toggle ${sector} sector`}
                    className="sr-only"
                  />
                  {/* Custom checkbox */}
                  <div
                    className={clsx(
                      'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                      isSelected
                        ? 'border-blue-team-500 bg-blue-team-500'
                        : 'border-slate-600 bg-slate-800'
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span
                    className={clsx(
                      'text-sm flex-1',
                      isSelected ? 'text-slate-200 font-medium' : 'text-slate-400'
                    )}
                  >
                    {sector}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
