import type { FC } from 'react'

export interface AuroraProps {
  colorStops?: string[]
  amplitude?: number
  blend?: number
  speed?: number
  time?: number
}

declare const Aurora: FC<AuroraProps>
export default Aurora
