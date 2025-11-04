import type { FC } from 'react';
import { Users } from 'lucide-react';
import { useFilterStore } from '@/stores/useFilterStore';
import { clsx } from 'clsx';

type TeamOption = 'all' | 'blue' | 'white';

interface TeamChoice {
  value: TeamOption;
  label: string;
  description: string;
  colorClass: string;
}

export const TeamFilter: FC = () => {
  const { team, setTeam } = useFilterStore();

  const teams: TeamChoice[] = [
    {
      value: 'all',
      label: 'All Teams',
      description: 'Show both teams',
      colorClass: 'border-slate-500 bg-slate-700',
    },
    {
      value: 'blue',
      label: 'Blue Team',
      description: 'Future-focused sectors',
      colorClass: 'border-blue-team-500 bg-blue-team-500/10',
    },
    {
      value: 'white',
      label: 'White Team',
      description: 'Traditional sectors',
      colorClass: 'border-white-team-500 bg-white-team-500/10',
    },
  ];

  return (
    <div className="space-y-3" role="radiogroup" aria-labelledby="team-filter-label">
      <div id="team-filter-label" className="flex items-center gap-2 text-sm font-medium text-slate-300">
        <Users className="w-4 h-4" aria-hidden="true" />
        <span>Team Filter</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {teams.map((option) => (
          <button
            key={option.value}
            onClick={() => setTeam(option.value)}
            role="radio"
            aria-checked={team === option.value}
            aria-label={`${option.label}: ${option.description}`}
            className={clsx(
              'relative p-4 rounded-lg border-2 transition-all text-left',
              team === option.value
                ? `${option.colorClass} ring-2 ring-offset-2 ring-offset-slate-800`
                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600',
              team === option.value && option.value === 'blue' && 'ring-blue-team-500',
              team === option.value && option.value === 'white' && 'ring-white-team-400',
              team === option.value && option.value === 'all' && 'ring-slate-500'
            )}
          >
            {/* Radio indicator */}
            <div className="absolute top-3 right-3">
              <div
                className={clsx(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                  team === option.value
                    ? option.value === 'blue'
                      ? 'border-blue-team-500 bg-blue-team-500'
                      : option.value === 'white'
                      ? 'border-white-team-400 bg-white-team-400'
                      : 'border-slate-400 bg-slate-400'
                    : 'border-slate-600'
                )}
              >
                {team === option.value && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </div>

            <div className="pr-8">
              <div
                className={clsx(
                  'font-semibold mb-1',
                  team === option.value && option.value === 'blue'
                    ? 'text-blue-team-300'
                    : team === option.value && option.value === 'white'
                    ? 'text-white-team-300'
                    : 'text-slate-200'
                )}
              >
                {option.label}
              </div>
              <div className="text-xs text-slate-400">{option.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
