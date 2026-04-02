import { type ReactNode } from 'react'

interface CardsGridProps {
  children: ReactNode
  /** 2 colunas no mobile; 2-3 em telas maiores. Use "dense" para cards menores. */
  variant?: 'default' | 'dense'
  className?: string
}

export function CardsGrid({
  children,
  variant = 'default',
  className = '',
}: CardsGridProps) {
  return (
    <div
      className={
        variant === 'dense'
          ? `grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-[32px] lg:grid-cols-3 ${className}`
          : `grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-[32px] lg:grid-cols-3 ${className}`
      }
    >
      {children}
    </div>
  )
}
