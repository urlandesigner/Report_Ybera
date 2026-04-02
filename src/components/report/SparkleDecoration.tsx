import { Sparkles } from 'lucide-react'

type Position = 'top-right' | 'bottom-left' | 'top-left' | 'bottom-right'

interface SparkleDecorationProps {
  position?: Position
  className?: string
}

const positionClasses: Record<Position, string> = {
  'top-right': 'top-2 right-4',
  'bottom-left': 'bottom-2 left-4',
  'top-left': 'top-2 left-4',
  'bottom-right': 'bottom-2 right-4',
}

export function SparkleDecoration({ position = 'top-right', className = '' }: SparkleDecorationProps) {
  return (
    <div
      className={`absolute pointer-events-none text-report-accent/25 ${positionClasses[position]} ${className}`}
      aria-hidden
    >
      <Sparkles className="w-4 h-4" />
    </div>
  )
}
