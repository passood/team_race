import { memo } from 'react'
import type { HTMLAttributes } from 'react'
import { clsx } from 'clsx'
import { AlertCircle } from 'lucide-react'
import { Button } from './Button'

export interface ErrorMessageProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  message: string
  onRetry?: () => void
  retryLabel?: string
}

export const ErrorMessage = memo(function ErrorMessage({
  title = 'Error',
  message,
  onRetry,
  retryLabel = 'Try Again',
  className,
  ...props
}: ErrorMessageProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center p-6 text-center',
        className
      )}
      {...props}
    >
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-slate-50 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 mb-4 max-w-md">{message}</p>
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  )
})
