import { clsx } from 'clsx'
import { CARD_HOVER_ARTICLE_CLASSES } from './Card'
import { splitHighlightTitle } from './splitHighlightTitle'

const titleClass =
  'text-[18px] font-bold leading-[125%] text-[#3C3C3C] font-sans sm:text-xl md:text-2xl md:leading-[120%]'
const subtitleClass = 'text-sm font-semibold leading-snug text-[#505052] font-sans'
const descriptionClass = 'text-base font-normal leading-[22.75px] text-[#505052] font-sans'

export interface HighlightCardItem {
  id: string
  title: string
  description: string
}

interface HighlightCardProps {
  item: HighlightCardItem
  className?: string
}

/** Card da section Destaques: fundo #F8F8F8, título + subtítulo (pontos/área) + descrição. */
export function HighlightCard({ item, className }: HighlightCardProps) {
  const { headline, subtitle } = splitHighlightTitle(item.title)

  return (
    <article
      className={clsx(
        CARD_HOVER_ARTICLE_CLASSES,
        'flex flex-col gap-3 rounded-report-lg p-6 font-sans bg-[#F8F8F8]',
        className
      )}
      style={{ ['--card-hover-shadow' as string]: '0 25px 50px -12px #E6E8ECcc' }}
    >
      <h3 className={titleClass}>{headline}</h3>
      {subtitle ? <p className={subtitleClass}>{subtitle}</p> : null}
      <p className={clsx(descriptionClass, 'mt-1')}>{item.description}</p>
    </article>
  )
}
