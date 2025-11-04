import type { FC, ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface MainLayoutProps {
  children: ReactNode;
  showControlPanel?: boolean;
  controlPanel?: ReactNode;
}

export const MainLayout: FC<MainLayoutProps> = ({
  children,
  showControlPanel = false,
  controlPanel,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      {/* Header */}
      <Header />

      {/* Control Panel (if provided) */}
      {showControlPanel && controlPanel && (
        <div className="bg-slate-800 border-b border-slate-700 px-4 py-4 md:px-6">
          <div className="max-w-7xl mx-auto">{controlPanel}</div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-6 md:px-6 md:py-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
