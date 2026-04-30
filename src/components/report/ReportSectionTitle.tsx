import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
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
  'pointer-events-none absolute right-0 top-1/2 z-[2] flex -translate-y-1/2 flex-col items-end justify-center gap-1 max-h-[3.25rem] max-w-[3.25rem] sm:max-h-[3.5rem] sm:max-w-[3.5rem] lg:max-h-[5.5rem] lg:max-w-[5.5rem]'

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
  const headerRef = useRef<HTMLElement | null>(null)
  const reduceMotion = useReducedMotion()
  const [isDesktop, setIsDesktop] = useState(false)
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ['start end', 'end start'],
  })
  const parallaxY = useTransform(scrollYProgress, [0, 1], isDesktop ? [-60, 60] : [-24, 24])
  const parallaxRotate = useTransform(scrollYProgress, [0, 1], isDesktop ? [-4, 4] : [-2, 2])
  const parallaxScale = useTransform(scrollYProgress, [0, 0.5, 1], isDesktop ? [0.96, 1, 1.04] : [0.98, 1, 1.02])

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    const sync = () => setIsDesktop(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

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
      ref={headerRef}
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
          <motion.div
            className="flex max-h-full max-w-full flex-col items-end justify-start [&_img]:h-auto [&_img]:max-h-full [&_img]:w-auto [&_img]:max-w-full [&_img]:object-contain [&_img]:drop-shadow-[0_18px_35px_rgba(0,0,0,0.18)] [&_svg]:max-h-full [&_svg]:max-w-full [&_svg]:drop-shadow-[0_18px_35px_rgba(0,0,0,0.18)]"
            style={reduceMotion ? undefined : { y: parallaxY, rotate: parallaxRotate, scale: parallaxScale }}
          >
            <div>
            {decoration}
            {icon}
            </div>
          </motion.div>
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
            lg:grid lg:grid-cols-12 lg:flex-none lg:items-end lg:gap-x-8 lg:gap-y-0
          "
        >
          <div className="relative min-w-0 max-w-full lg:col-span-4 lg:col-start-1">
            {titleBlock}
          </div>

          {description ? (
            <div className="min-w-0 w-full max-w-full md:max-w-[460px] lg:col-start-5 lg:col-span-6 lg:max-w-[640px]">
              <p
                className="min-w-0 w-full text-left text-[15px] font-semibold leading-relaxed text-neutral-500 max-sm:mt-0 max-sm:pt-3 pr-0 sm:pr-12 sm:text-base md:pr-0 lg:w-full lg:pr-0"
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
