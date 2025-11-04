import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './UI/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component to catch React errors
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 *
 * Or with custom fallback:
 * ```tsx
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // TODO: Log to error reporting service (e.g., Sentry) in production
    // if (process.env.NODE_ENV === 'production') {
    //   logErrorToService(error, errorInfo);
    // }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-slate-800 border-2 border-red-500/30 rounded-lg p-8">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="bg-red-500/10 rounded-full p-4">
                  <AlertTriangle className="w-12 h-12 text-red-500" />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-slate-50 text-center mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-slate-400 text-center mb-6">
                We encountered an unexpected error. Please try reloading the
                page.
              </p>

              {/* Error Details (Development only) */}
              {import.meta.env.DEV && error && (
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-6">
                  <h2 className="text-sm font-semibold text-red-400 mb-2">
                    Error Details (Development Mode)
                  </h2>
                  <pre className="text-xs text-slate-300 overflow-x-auto">
                    {error.toString()}
                  </pre>
                  {errorInfo && (
                    <details className="mt-3">
                      <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-300">
                        Component Stack
                      </summary>
                      <pre className="text-xs text-slate-400 mt-2 overflow-x-auto">
                        {errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="primary" onClick={this.handleReload}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload Page
                </Button>
                <Button variant="secondary" onClick={this.handleReset}>
                  Try Again
                </Button>
              </div>

              {/* Help Text */}
              <p className="text-xs text-slate-500 text-center mt-6">
                If this problem persists, please contact support or check the
                browser console for more details.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}
