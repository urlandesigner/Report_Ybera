import { clsx } from 'clsx'
import type { ComparativeSection } from '../../data/report.types'
import { CARD_HOVER_ARTICLE_CLASSES, cardHoverShadowStyle } from './Card'
import { StaggerContainer, StaggerItem } from '../animations'

const FONT_SANS = '"Plus Jakarta Sans", sans-serif'

/** Fundo lilás dos cards de versão (Figma). */
const VERSION_CARD_BG = '#EDE9FE'

function BlockHeading({ children }: { children: string }) {
  return (
    <h3
      className="text-xl font-bold leading-[120%] text-[#3C3C3C] sm:text-2xl"
      style={{ fontFamily: FONT_SANS }}
    >
      {children}
    </h3>
  )
}

function BodyText({ children, className }: { children: string; className?: string }) {
  return (
    <p
      className={clsx('text-base font-normal leading-relaxed text-neutral-600', className)}
      style={{ fontFamily: FONT_SANS }}
    >
      {children}
    </p>
  )
}

/** Container cinza-claro arredondado que envolve um bloco da section. */
function SurfaceBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-report-2xl bg-[#F2F2F2] p-6 sm:gap-5 sm:p-8">
      {children}
    </div>
  )
}

export interface ComparativeSectionContentProps {
  data: ComparativeSection
}

/**
 * Section Comparativo: Visão Geral da Versão + Comparativo Histórico (cards de versão)
 * + Insights Estratégicos para a Diretoria (duas colunas) + Conclusão Estratégica.
 */
export function ComparativeSectionContent({ data }: ComparativeSectionContentProps) {
  return (
    <div className="flex flex-col gap-4 md:gap-[32px]">
      {/* Visão Geral da Versão */}
      {data.overview ? (
        <SurfaceBlock>
          <BlockHeading>Visão Geral da Versão</BlockHeading>
          <BodyText>{data.overview}</BodyText>
        </SurfaceBlock>
      ) : null}

      {/* Comparativo Histórico (Acumulado) */}
      {data.history.length > 0 ? (
        <SurfaceBlock>
          <BlockHeading>Comparativo Histórico (Acumulado 2026)</BlockHeading>
          {data.historyIntro ? <BodyText>{data.historyIntro}</BodyText> : null}
          <StaggerContainer
            className="mt-1 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-5 lg:gap-4"
            stagger={0.06}
          >
            {data.history.map((item, i) => (
              <StaggerItem key={`${item.version}-${i}`}>
                <article
                  className={clsx(
                    CARD_HOVER_ARTICLE_CLASSES,
                    'flex h-full flex-col items-start gap-2 rounded-report-lg p-5'
                  )}
                  style={{ backgroundColor: VERSION_CARD_BG, ...cardHoverShadowStyle(VERSION_CARD_BG) }}
                >
                  <span
                    className="text-xs font-medium text-neutral-500"
                    style={{ fontFamily: FONT_SANS }}
                  >
                    {item.month}
                  </span>
                  <span
                    className="text-2xl font-bold leading-tight text-[#1E1E20]"
                    style={{ fontFamily: FONT_SANS }}
                  >
                    Versão
                    <br />
                    {item.version}
                  </span>
                  <span
                    className="mt-1 text-sm font-normal leading-snug text-neutral-600"
                    style={{ fontFamily: FONT_SANS }}
                  >
                    {item.summary}
                  </span>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </SurfaceBlock>
      ) : null}

      {/* Insights Estratégicos para a Diretoria */}
      {data.insights.length > 0 ? (
        <div className="grid grid-cols-1 items-stretch gap-6 pt-2 lg:grid-cols-12 lg:gap-x-8">
          <div className="flex h-full flex-col rounded-report-2xl bg-[#F2F2F2] p-6 sm:p-8 lg:col-span-4">
            <h3
              className="text-2xl font-bold leading-tight text-[#3C3C3C] sm:text-3xl"
              style={{ fontFamily: FONT_SANS }}
            >
              Insights Estratégicos para a Diretoria
            </h3>
            {data.insightsIntro ? (
              <BodyText className="mt-4">{data.insightsIntro}</BodyText>
            ) : null}
          </div>

          <div className="flex flex-col gap-6 lg:col-span-7 lg:col-start-6">
            {data.insights.map((insight, i) => (
              <div key={`insight-${i}`} className="flex flex-col gap-2">
                <h4
                  className="text-lg font-bold leading-snug text-[#1E1E20]"
                  style={{ fontFamily: FONT_SANS }}
                >
                  {insight.title}
                </h4>
                <BodyText>{insight.description}</BodyText>
              </div>
            ))}

            {data.conclusion ? (
              <div className="flex flex-col gap-2">
                <h4
                  className="text-lg font-bold leading-snug text-[#1E1E20]"
                  style={{ fontFamily: FONT_SANS }}
                >
                  Conclusão Estratégica
                </h4>
                <BodyText>{data.conclusion}</BodyText>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
