import { type CSSProperties, type ReactNode } from 'react'
import { REPORT_SECTION_TITLE_MARGIN_CLASS } from '../../constants/reportLayout'

export interface ReportSectionTitleProps {
  /** Número da seção em destaque no fundo (ex: "01") */
  badge: string
  /** Marca pequena acima do título (ex: "Ybera") */
  brand?: string
  /** Título em duas partes para gradientes distintos (ex: { left: "Resumo", right: "Executivo" }) */
  titleSplit?: { left: string; right: string }
  /** Título único quando não há titleSplit */
  title?: string
  /** Texto complementar à direita do título, alinhado ao topo do título */
  description?: string
  /** Ícone no canto superior direito */
  icon?: ReactNode
  /** Ilustração decorativa no canto superior direito */
  decoration?: ReactNode
  /** id do h2 para acessibilidade (ex: "executive-summary-heading") */
  titleId?: string
  /** Cor do número de fundo (ex: "#ffffff" ou "#F0F0F0") */
  badgeColor?: string
  /** Desloca apenas os textos (marca, título, descrição) em px para baixo (padding no fluxo; o badge absoluto não acompanha). */
  contentOffsetY?: number
  /**
   * Título único (`title`) com gradiente contínuo (verde → roxo), alinhado ao efeito das duas metades de `titleSplit`.
   * Use quando a palavra não deve ser partida em dois spans (ex.: "Destaques").
   */
  fullTitleGradient?: boolean
}

/** Largura máx. do título só em mobile estreito */
const COPY_MAX_MOBILE_ONLY = 'max-sm:max-w-[min(100%,20rem)]'

const cornerDecorClass =
  'pointer-events-none absolute right-0 top-5 z-[2] flex max-h-[3.25rem] max-w-[3.25rem] flex-col items-end justify-start gap-1 sm:top-6 sm:max-h-[3.5rem] sm:max-w-[3.5rem] lg:top-8 lg:max-h-[5.5rem] lg:max-w-[5.5rem]'

/**
 * Section title: um único `<header>` relativo.
 * Desktop (`lg`): grelha `auto` + `1fr`, `min-h-[200px]` com `h-auto` para crescer com texto longo; `gap-x` 36px.
 */
export function ReportSectionTitle({
  badge,
  brand,
  titleSplit,
  title,
  description,
  icon,
  decoration,
  titleId = 'section-title-heading',
  badgeColor = '#ffffff',
  contentOffsetY,
  fullTitleGradient = false,
}: ReportSectionTitleProps) {
  const padMobileDecoration = decoration ? 'max-sm:pr-12' : 'max-sm:pr-0'
  const hasCornerDecor = Boolean(decoration ?? icon)

  const contentWrapperStyle: CSSProperties | undefined =
    contentOffsetY != null ? { paddingTop: contentOffsetY } : undefined

  const titleBlock = (
    <>
      {brand && (
        <p
          className="mb-1 w-full text-sm font-medium leading-5 text-[#505052] sm:text-base sm:leading-normal"
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
        >
          {brand}
        </p>
      )}
      <span
        className="pointer-events-none absolute left-0 top-1/2 z-0 -translate-y-1/2 select-none font-bold leading-none text-[4.25rem] opacity-[0.09] sm:hidden"
        style={{ color: badgeColor }}
        aria-hidden
      >
        {badge}
      </span>
      <h2
        id={titleId}
        className={`relative z-[1] w-full min-w-0 shrink-0 break-words text-[1.65rem] font-bold leading-tight max-sm:text-[1.625rem] max-sm:leading-tight max-sm:tracking-tight sm:max-w-full sm:text-3xl sm:leading-normal md:text-4xl lg:w-fit lg:max-w-full lg:break-normal lg:text-[40px] lg:whitespace-nowrap ${padMobileDecoration} ${COPY_MAX_MOBILE_ONLY}`}
        style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
      >
        {titleSplit ? (
          <>
            <span
              style={{
                background: 'linear-gradient(90deg, #87E097 0%, #5FB16F 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {titleSplit.left}
            </span>{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #A0A0B0 0%, #C0A0E0 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {titleSplit.right}
            </span>
          </>
        ) : fullTitleGradient && title ? (
          <span
            style={{
              background:
                'linear-gradient(90deg, #87E097 0%, #5FB16F 35%, #A0A0B0 68%, #C0A0E0 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {title}
          </span>
        ) : (
          <span style={{ color: '#1a1a1a' }}>{title}</span>
        )}
      </h2>
    </>
  )

  return (
    <header
      className={`relative h-auto min-h-0 w-full max-w-full px-0 py-0 max-sm:overflow-x-clip sm:overflow-x-visible sm:overflow-y-visible pb-0 sm:min-h-[200px] lg:flex lg:min-h-[200px] lg:h-auto lg:flex-col lg:overflow-visible ${REPORT_SECTION_TITLE_MARGIN_CLASS}`}
      aria-labelledby={titleId}
    >
      {/* Número decorativo — absoluto dentro deste header (sm+); mobile: duplicado atrás do título na coluna esquerda */}
      <span
        className="pointer-events-none absolute z-0 hidden select-none font-bold leading-none sm:left-[-38px] sm:top-[-15px] sm:block sm:text-[9rem] md:text-[11rem] lg:text-[15rem]"
        style={{ color: badgeColor }}
        aria-hidden
      >
        {badge}
      </span>

      {/* Decoração + ícone — absoluto top-right dentro do mesmo header */}
      {hasCornerDecor && (
        <div className={cornerDecorClass} aria-hidden>
          <div className="flex max-h-full max-w-full flex-col items-end justify-start [&_img]:h-auto [&_img]:max-h-full [&_img]:w-auto [&_img]:max-w-full [&_img]:object-contain [&_svg]:max-h-full [&_svg]:max-w-full">
            {decoration}
            {icon}
          </div>
        </div>
      )}

      {/* Contentor partilhado: sm–md ancorado à base; lg preenche altura do header e alinha grelha à base */}
      <div
        className="relative z-[1] box-border flex w-full min-w-0 max-w-full flex-col pr-1 sm:pr-0 sm:absolute sm:inset-x-0 sm:bottom-8 sm:pt-0 lg:relative lg:inset-auto lg:bottom-auto lg:left-auto lg:right-auto lg:top-auto lg:flex-1 lg:justify-end"
        style={contentWrapperStyle}
      >
        <div
          className="
            flex w-full min-w-0 max-w-full flex-col gap-0 max-sm:flex-none
            sm:flex-1 sm:gap-6
            md:flex-row md:items-start md:gap-10
            lg:grid lg:grid-cols-[auto_minmax(0,1fr)] lg:flex-none lg:items-end lg:gap-x-[36px] lg:gap-y-0
          "
        >
          <div className="relative min-w-0 max-w-full lg:w-min lg:max-w-full">
            {titleBlock}
          </div>

          {description ? (
            <div className="min-w-0 w-full max-w-full">
              <p
                className="min-w-0 text-sm font-normal leading-[160%] text-[#505052] max-sm:mt-0 max-sm:pt-3 pr-0 sm:pr-12 sm:text-base sm:leading-[160%] md:flex-1 md:pr-0 lg:w-full lg:pr-0"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              >
                {description}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
