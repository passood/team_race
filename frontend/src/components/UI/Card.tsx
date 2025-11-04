import { memo } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode
  footer?: ReactNode
  noPadding?: boolean
}

export const Card = memo(function Card({
  header,
  footer,
  noPadding = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        'bg-slate-800 border border-slate-700 rounded-lg shadow-lg',
        className
      )}
      {...props}
    >
      {header && (
        <div className="px-6 py-4 border-b border-slate-700">{header}</div>
      )}
      <div className={clsx(!noPadding && 'p-6')}>{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-slate-700">{footer}</div>
      )}
    </div>
  )
})
