import { type ReactNode } from 'react'
import { StaticMeshGradient } from '@paper-design/shaders-react'
import type { SectionMeta, ExecutiveCard, ExecutiveCardDotColor } from '../../data/reportMock'
import { CARD_HOVER_ARTICLE_CLASSES } from './Card'
import { ReportSectionTitle } from './ReportSectionTitle'
import { AnimatedSection, StaggerContainer, StaggerItem } from '../animations'

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

/** Cores muito suaves para StaticMeshGradient (Paper Shaders), alinhadas ao tom da bolinha. */
const meshColorsByDot: Record<ExecutiveCardDotColor, string[]> = {
  blue: ['#ffffff', '#ffffff', '#f4f8ff', '#e8f1ff'],
  purple: ['#ffffff', '#ffffff', '#faf7ff', '#f2edff'],
  green: ['#ffffff', '#ffffff', '#f5fcf7', '#e9f6ee'],
  orange: ['#ffffff', '#ffffff', '#fffaf6', '#fff0e0'],
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
      <AnimatedSection delay={0.02}>
        <ReportSectionTitle
          badge={section.badge}
          brand={brand}
          titleSplit={titleSplit}
          title={!titleSplit ? section.title : undefined}
          description={section.description}
          titleId="executive-summary-heading"
        />
      </AnimatedSection>

      {/* Grid 6 cards: 3 por linha no desktop (lg:grid-cols-3); 2 colunas no sm; 1 no mobile */}
      <StaggerContainer className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-[32px] lg:grid-cols-3" stagger={0.07}>
        {cards.map((item, index) => (
          <StaggerItem key={item.id}>
            <article
              className={`${CARD_HOVER_ARTICLE_CLASSES} relative flex min-h-0 flex-1 flex-col items-start gap-[1.25rem] overflow-hidden rounded-[20px] border p-6`}
              style={{ borderColor: '#E6E8EC', ['--card-hover-shadow' as string]: '0 25px 50px -12px #E6E8ECcc' }}
            >
              <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[20px]" aria-hidden>
                <StaticMeshGradient
                  className="absolute inset-0 h-full w-full min-h-[12rem]"
                  speed={0}
                  colors={meshColorsByDot[item.dotColor]}
                  positions={2}
                  waveX={0.55}
                  waveXShift={0.15 + index * 0.04}
                  waveY={0.72}
                  waveYShift={0.35}
                  mixing={0.94}
                  grainMixer={0.06}
                  grainOverlay={0.12}
                  rotation={(37 + index * 41) % 360}
                />
              </div>
              <div className="relative z-[1] flex min-h-0 w-full flex-col items-start gap-[1.25rem]">
                <span
                  className={`inline-block h-3 w-3 shrink-0 rounded-full ${dotColorClasses[item.dotColor]}`}
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
                className="text-base font-normal leading-normal text-neutral-600"
                style={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontStyle: 'normal',
                  whiteSpace: 'normal',
                }}
              >
                  {item.text}
                </p>
              </div>
            </article>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  )
}
