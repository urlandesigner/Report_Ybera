import type { ReactNode } from 'react'

export interface AnimatedListProps<T = string> {
  items?: T[]
  onItemSelect?: (item: T, index: number) => void
  showGradients?: boolean
  enableArrowNavigation?: boolean
  className?: string
  itemClassName?: string
  displayScrollbar?: boolean
  initialSelectedIndex?: number
  renderItem?: (item: T, index: number, selected: boolean) => ReactNode
  getItemKey?: (item: T, index: number) => string | number
  itemGap?: string
  interactive?: boolean
}

declare function AnimatedList<T = string>(props: AnimatedListProps<T>): JSX.Element
export default AnimatedList

export interface AnimatedListItemProps {
  children: ReactNode
  delay?: number
  index?: number
  onMouseEnter?: () => void
  onClick?: () => void
  itemGap?: string
  interactive?: boolean
}

export const AnimatedListItem: (props: AnimatedListItemProps) => JSX.Element
