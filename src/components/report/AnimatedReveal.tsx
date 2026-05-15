import type { ReactNode } from 'react'
import { useReducedMotion } from 'motion/react'
import { AnimatedListItem } from '@/components/AnimatedList'

interface AnimatedRevealProps {
  index: number
  children: ReactNode
}

/** Revelação ao scroll da página (sem scroll interno). */
export function AnimatedReveal({ index, children }: AnimatedRevealProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <>{children}</>
  }

  return (
    <AnimatedListItem
      index={index}
      delay={Math.min(index * 0.06, 0.36)}
      itemGap="0"
      interactive={false}
    >
      {children}
    </AnimatedListItem>
  )
}
