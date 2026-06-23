import { clsx } from 'clsx'
import type { ComparativeSection } from '../../data/report.types'
import { CARD_HOVER_ARTICLE_CLASSES, cardHoverShadowStyle } from './Card'

const FONT_SANS = '"Plus Jakarta Sans", sans-serif'

/** Fundo lilás dos cards de versão (Figma). */
const VERSION_CARD_BG = '#EDE9FE'

function splitHistoryRows<T>(items: T[]): T[][] {
  if (items.length <= 5) return [items]

  const rowCount = Math.ceil(items.length / 5)
  const baseSize = Math.floor(items.length / rowCount)
  const remainder = items.length % rowCount

  const rows: T[][] = []
  let cursor = 0

  for (let i = 0; i < rowCount; i += 1) {
    const rowSize = baseSize + (i < remainder ? 1 : 0)
    rows.push(items.slice(cursor, cursor + rowSize))
    cursor += rowSize
  }

  return rows
}

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
  const historyRows = splitHistoryRows(data.history)

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
          <div className="mt-1 flex flex-col gap-3 lg:gap-4">
            {historyRows.map((row, rowIdx) => (
              <div
                key={`history-row-${rowIdx}`}
                className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:gap-4 lg:[grid-template-columns:repeat(var(--history-cols),minmax(0,1fr))]"
                style={{ ['--history-cols' as string]: String(row.length) }}
              >
                {row.map((item, itemIdx) => (
                  <article
                    key={`${item.version}-${rowIdx}-${itemIdx}`}
                    className={clsx(
                      CARD_HOVER_ARTICLE_CLASSES,
                      'flex h-full flex-col items-start gap-2 rounded-report-lg p-5'
                    )}
                    style={{
                      backgroundColor: VERSION_CARD_BG,
                      ...cardHoverShadowStyle(VERSION_CARD_BG),
                    }}
                  >
                    <span
                      className="inline-flex rounded-full px-3 py-1 text-xs font-semibold text-neutral-500"
                      style={{ fontFamily: FONT_SANS, background: 'rgba(255, 255, 255, 0.35)' }}
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
                      className="mt-1 text-sm font-bold leading-snug text-neutral-600"
                      style={{ fontFamily: FONT_SANS }}
                    >
                      {item.summary}
                    </span>
                  </article>
                ))}
              </div>
            ))}
          </div>
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

          <div className="flex flex-col gap-6 lg:col-span-8 lg:col-start-5">
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
