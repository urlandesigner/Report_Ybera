import { type ReactNode } from 'react'
import type { SectionMeta, ExecutiveCard, ExecutiveCardDotColor } from '../../data/reportMock'
import { CARD_HOVER_ARTICLE_CLASSES } from './Card'
import { ReportSectionTitle } from './ReportSectionTitle'

interface ExecutiveSummarySectionProps {
  section: SectionMeta
  cards: ExecutiveCard[]
  decoration?: ReactNode
}

/** Cores das bolinhas conforme Figma (node 8-1692): azul vibrante, roxo, verde, laranja */
const dotColorClasses: Record<ExecutiveCardDotColor, string> = {
  blue: 'bg-[#3399FF]',
  purple: 'bg-purple-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
}

/**
 * Seção "Resumo Executivo" conforme Figma (Ybera Changelog / Tech Report).
 * Header com "01" de fundo, marca Ybera, título bicolor (Resumo verde + Executivo roxo),
 * descrição à direita; grid 6 cards (3+3 no desktop).
 */
export function ExecutiveSummarySection({
  section,
  cards,
  decoration,
}: ExecutiveSummarySectionProps) {
  const titleSplit = section.titleSplit
  const brand = section.brand

  return (
    <section
      data-section="resumo-executivo-figma"
      className="relative overflow-visible"
      aria-labelledby="executive-summary-heading"
    >
      {decoration}

      {/* Seção de título conforme Figma (node 41-1644) */}
      <ReportSectionTitle
        badge={section.badge}
        brand={brand}
        titleSplit={titleSplit}
        title={!titleSplit ? section.title : undefined}
        description={section.description}
        titleId="executive-summary-heading"
      />

      {/* Grid 6 cards: 3 por linha no desktop (lg:grid-cols-3); 2 colunas no sm; 1 no mobile */}
      <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-[32px] lg:grid-cols-3">
        {cards.map((item) => (
          <article
            key={item.id}
            className={`${CARD_HOVER_ARTICLE_CLASSES} flex flex-col items-start gap-[1.25rem] p-6 flex-1 min-w-0 rounded-[20px] border bg-[#FFF]`}
            style={{ borderColor: '#E6E8EC', ['--card-hover-shadow' as string]: '0 25px 50px -12px #E6E8ECcc' }}
          >
            <span
              className={`inline-block w-3 h-3 rounded-full shrink-0 ${dotColorClasses[item.dotColor]}`}
              aria-hidden
            />
            <h3
              className="text-[18px] font-bold leading-[130%] tracking-[-0.02em] text-[#3C3C3C] sm:text-xl md:text-2xl lg:text-[26px] lg:tracking-[-0.78px]"
              style={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontStyle: 'normal',
              }}
            >
              {item.title}
            </h3>
            <p
              style={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                color: '#505052',
                fontSize: 16,
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '160%',
                whiteSpace: 'normal',
              }}
            >
              {item.text}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
