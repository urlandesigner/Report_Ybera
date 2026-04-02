import { type ReactNode } from 'react'
import { CARD_HOVER_ARTICLE_CLASSES } from './Card'

interface SupportCardProps {
  icon: ReactNode
  title: string
  description: string
  ctaLabel?: string
}

export function SupportCard({ icon, title, description, ctaLabel }: SupportCardProps) {
  return (
    <article
      className={`${CARD_HOVER_ARTICLE_CLASSES} rounded-report-lg bg-report-card border border-slate-200/80 shadow-report p-card sm:p-card-lg flex flex-col gap-[1.25rem] h-full`}
      style={{ ['--card-hover-shadow' as string]: '0 25px 50px -12px #ffffff99' }}
    >
      <div
        className="hidden w-11 h-11 shrink-0 items-center justify-center rounded-full p-3 text-report-accent sm:flex [&_svg]:w-6 [&_svg]:h-6"
        style={{ background: 'rgba(255, 255, 255, 0.35)' }}
        aria-hidden
      >
        {icon}
      </div>
      <h3 className="text-[18px] font-semibold text-report-dark">{title}</h3>
      <p className="text-report-muted text-sm leading-relaxed flex-1">{description}</p>
      {ctaLabel && (
        <div className="flex justify-end">
          <span className="inline-flex rounded-lg bg-report-accent px-3 py-1.5 text-sm font-medium text-white">
            {ctaLabel}
          </span>
        </div>
      )}
    </article>
  )
}
