import type { FC, ReactNode } from 'react'

export interface GradientTextProps {
  children: ReactNode
  className?: string
  colors?: string[]
  animationSpeed?: number
  showBorder?: boolean
  direction?: 'horizontal' | 'vertical' | string
  pauseOnHover?: boolean
  yoyo?: boolean
}

declare const GradientText: FC<GradientTextProps>
export default GradientText
