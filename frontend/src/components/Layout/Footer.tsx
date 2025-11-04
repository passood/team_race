import type { FC } from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { useStockMetadata } from '@/hooks/useStockData';

export const Footer: FC = () => {
  const { data: metadata } = useStockMetadata();

  const currentYear = new Date().getFullYear();
  const formattedDate = metadata?.lastUpdated
    ? format(new Date(metadata.lastUpdated), 'MMM d, yyyy')
    : null;

  return (
    <footer className="bg-slate-900 border-t border-slate-800 px-4 py-6 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Data Attribution */}
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <span>Data source:</span>
              <a
                href="https://finance.yahoo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-team-400 hover:text-blue-team-300 transition-colors inline-flex items-center gap-1"
              >
                Yahoo Finance
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            {formattedDate && (
              <div className="text-xs text-slate-500">
                Data last updated: {formattedDate}
              </div>
            )}
          </div>

          {/* GitHub Link & Copyright */}
          <div className="flex flex-col md:items-end gap-2">
            <a
              href="https://github.com/joono/team-race"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-sm"
            >
              <Github className="w-4 h-4" />
              <span>View on GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <div className="text-xs text-slate-500">
              © {currentYear} Team Race. All rights reserved.
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-500 text-center md:text-left">
            Disclaimer: This visualization is for educational purposes only. Stock performance data is historical and does not guarantee future results.
            Always conduct your own research before making investment decisions.
          </p>
        </div>
      </div>
    </footer>
  );
};
