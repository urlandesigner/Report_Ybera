import { clsx } from 'clsx'
import { ArrowRight } from 'lucide-react'
import { CARD_HOVER_ARTICLE_CLASSES, cardHoverShadowStyle } from './Card'

const arrowIcon = <ArrowRight className="w-6 h-6 stroke-[1.5]" style={{ color: '#0F131B' }} />

export interface NextStepsCardProps {
  title: string
  description: string
  className?: string
}

/**
 * Card da section Próximos Passos: fundo #EEF1FB, ícone circular com seta, título + descrição.
 */
export function NextStepsCard({ title, description, className }: NextStepsCardProps) {
  const bg = '#EEF1FB'
  return (
    <article
      className={clsx(CARD_HOVER_ARTICLE_CLASSES, 'flex flex-col items-start gap-4 rounded-report-lg bg-[#EEF1FB] p-6 font-sans', className)}
      style={{ ...cardHoverShadowStyle(bg) }}
    >
      <div
        className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full p-3 sm:flex [&_svg]:h-6 [&_svg]:w-6"
        style={{ background: 'rgba(255, 255, 255, 0.45)' }}
        aria-hidden
      >
        {arrowIcon}
      </div>
      <h3 className="text-[18px] font-bold leading-[120%] text-[#3C3C3C] sm:text-2xl">{title}</h3>
      {description ? (
        <p className="text-base font-normal leading-[160%] text-[#505052]">{description}</p>
      ) : null}
    </article>
  )
}
