import type { FC } from 'react';
import { DateRangePicker } from './DateRangePicker';
import { TeamFilter } from './TeamFilter';
import { SectorFilter } from './SectorFilter';
import { PlaybackControls } from './PlaybackControls';
import { Card } from '@/components/UI/Card';

interface ControlPanelProps {
  totalFrames?: number;
}

export const ControlPanel: FC<ControlPanelProps> = ({ totalFrames }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column: Filters */}
      <div className="space-y-6">
        {/* Date Range Picker */}
        <Card>
          <DateRangePicker />
        </Card>

        {/* Team Filter */}
        <Card>
          <TeamFilter />
        </Card>

        {/* Sector Filter */}
        <Card>
          <SectorFilter />
        </Card>
      </div>

      {/* Right Column: Playback Controls */}
      <div>
        <Card>
          <PlaybackControls totalFrames={totalFrames} />
        </Card>
      </div>
    </div>
  );
};
