import type { FC } from 'react';
import { RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useStockMetadata } from '@/hooks/useStockData';
import { Button } from '@/components/UI/Button';

export const Header: FC = () => {
  const queryClient = useQueryClient();
  const { data: metadata, isLoading, refetch } = useStockMetadata();

  const handleRefresh = async () => {
    // Refetch metadata
    await refetch();
    // Invalidate stock data to trigger refetch
    await queryClient.invalidateQueries({ queryKey: ['stocks'] });
  };

  const formattedDate = metadata?.lastUpdated
    ? format(new Date(metadata.lastUpdated), 'MMM d, yyyy h:mm a')
    : null;

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-4 py-4 md:px-6 md:py-5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Logo/Title Section */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-team-500 to-blue-team-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">TR</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-50">
                Team Race
              </h1>
              <p className="text-xs md:text-sm text-slate-400">
                Stock Sector Chart Race Visualization
              </p>
            </div>
          </div>
        </div>

        {/* Last Updated & Refresh Section */}
        <div className="flex items-center gap-3 sm:gap-4">
          {formattedDate && (
            <div className="text-sm">
              <span className="text-slate-400">Last updated:</span>{' '}
              <span className="text-slate-200 font-medium">{formattedDate}</span>
            </div>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            isLoading={isLoading}
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">Refresh</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
