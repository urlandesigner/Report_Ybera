import type { ReactNode } from 'react'
import { useReducedMotion } from 'motion/react'
import Aurora from '@/components/Aurora'
import GradientText from '@/components/GradientText'
import type { HeroData } from '../../data/reportMock'
import { REPORT_MAX_WIDTH_CLASS } from '../../constants/reportLayout'
import { AnimatedSection, ParallaxImage } from '../animations'

const HERO_GRADIENT_COLORS = ['#83FF8F', '#B89EF5', '#CC7FF0'] as const

const HERO_BG_LAYERS = [
  'radial-gradient(circle at 6% 12%, rgba(138, 92, 255, 0.2), transparent 46%)',
  'radial-gradient(circle at 92% 72%, rgba(168, 85, 247, 0.13), transparent 44%)',
  'radial-gradient(circle at 22% 88%, rgba(95, 205, 145, 0.11), transparent 48%)',
  'linear-gradient(90deg, #1E1E1F 0%, #1E1E1F 42%, #171718 100%)',
].join(', ')

const HERO_AURORA_COLORS = ['#83FF8F', '#CC7FF0', '#A855F7'] as const

/** Mesma coluna de conteúdo que `REPORT_SECTION_INNER_CLASS` (sem padding vertical das secções). */
const HERO_CONTENT_COLUMN = ['mx-auto w-full min-w-0', REPORT_MAX_WIDTH_CLASS, 'px-4 sm:px-6 lg:px-0'].join(' ')

function HeroTitleLine({
  children,
  className,
  reduceMotion,
}: {
  children: ReactNode
  className: string
  reduceMotion: boolean | null
}) {
  if (reduceMotion) {
    return <span className={`hero-title-gradient ${className}`}>{children}</span>
  }

  return (
    <GradientText
      className={`hero-title-animated ${className}`}
      colors={[...HERO_GRADIENT_COLORS]}
      animationSpeed={10}
      showBorder={false}
      pauseOnHover={false}
    >
      {children}
    </GradientText>
  )
}

/**
 * Capa do relatório — tipografia / gradiente do título conforme Figma.
 */
export function HeroHeader({ data }: { data: HeroData }) {
  const reduceMotion = useReducedMotion()

  return (
    <header
      id="report-hero"
      className="relative flex min-h-0 w-full flex-col overflow-x-hidden bg-[#171718] py-9 text-white lg:min-h-[600px]"
      style={{
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        background: reduceMotion ? HERO_BG_LAYERS : undefined,
      }}
    >
      <div className="hero-grid-bg pointer-events-none absolute inset-0 z-0" aria-hidden />
      {!reduceMotion ? (
        <div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-[0.88]"
          aria-hidden
        >
          <Aurora
            colorStops={[...HERO_AURORA_COLORS]}
            amplitude={1.05}
            blend={0.62}
            speed={0.72}
          />
        </div>
      ) : null}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(90deg,rgba(30,30,31,0.58)_0%,rgba(30,30,31,0.52)_42%,rgba(23,23,24,0.76)_100%)]"
        aria-hidden
      />
      <div
        className={`relative flex min-h-0 flex-1 flex-col justify-between gap-8 md:gap-10 lg:gap-12 ${HERO_CONTENT_COLUMN}`}
      >
        {/* Faixa superior: tags — podem quebrar linha em telas estreitas */}
        <div id="report-hero-tags" className="relative z-[1] flex w-full flex-wrap items-start justify-between gap-2 gap-y-3">
          <span className="hero-premium-badge">
            <span className="hero-premium-badge__fill px-3 py-1.5 text-[12px] sm:text-[13px]">
              Status Report
            </span>
          </span>
          <span className="hero-premium-badge max-w-[min(100%,14rem)] sm:max-w-none">
            <span className="hero-premium-badge__fill px-3 py-1.5 text-[12px] sm:text-[13px]">
              {data.metaTag}
            </span>
          </span>
        </div>

        {/* Área central: título + arte 3D em uma composição editorial. */}
        <AnimatedSection
          className="relative z-[1] grid min-h-0 flex-1 grid-cols-1 items-center gap-8 py-2 sm:grid-cols-[minmax(0,1.1fr)_auto] sm:gap-3 md:gap-4 lg:py-0"
          delay={0.05}
        >
          <h1 className="relative z-[1] min-w-0" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              <HeroTitleLine
                reduceMotion={reduceMotion}
                className="block w-fit max-w-full text-[clamp(1.5rem,5.5vw,4.375rem)] font-extralight leading-[1.08] tracking-tight sm:leading-[1.1]"
              >
                {data.title}
              </HeroTitleLine>
              {/* leading generoso no mobile: clip de descendentes (ex. "g") com background-clip:text + overflow no header */}
              <HeroTitleLine
                reduceMotion={reduceMotion}
                className="block w-fit max-w-full pb-[0.12em] text-[clamp(2rem,10vw,6rem)] !font-bold leading-[1.38] sm:pb-0 sm:leading-[1.1] lg:leading-[120px]"
              >
                {data.highlight}
              </HeroTitleLine>
            </h1>
          <div className="relative hidden min-h-[180px] items-center justify-start overflow-visible sm:-ms-10 sm:mr-[100px] sm:flex md:-ms-14">
            <ParallaxImage
              src="/assets/chrome51.png"
              alt=""
              className="pointer-events-none h-auto w-[min(280px,42vw)] max-w-[320px] object-contain opacity-90 lg:w-[320px]"
              intensity={16}
              floatAmplitude={26}
              floatDuration={5}
              ariaHidden
            />
          </div>
        </AnimatedSection>

        {/* Rodapé da capa: metadados e símbolo alinhados à base da área de conteúdo. */}
        <div className="relative z-[1] mt-auto flex h-auto min-h-0 w-full flex-col gap-4 sm:min-h-[60px] sm:flex-row sm:items-end sm:justify-between">
          <img
            src="/assets/logo-ybera.png"
            alt="Ybera"
            className="pointer-events-none absolute bottom-0 left-1/2 z-0 max-sm:hidden max-w-[min(100%,700px)] -translate-x-1/2 object-contain object-center opacity-50 sm:block"
            style={{ width: 'min(100%, 700px)' }}
            aria-hidden
          />
          <div className="relative z-10 min-w-0">
            <p className="text-[14px] leading-snug text-white/60 sm:text-[16px] sm:leading-relaxed">{data.heroFooterLine1}</p>
            <p className="mt-2 text-[14px] leading-snug text-white/60 sm:text-[16px] sm:leading-relaxed">{data.heroFooterLine2}</p>
          </div>
          <img
            src="/assets/icon-ybera.png"
            alt="Ybera"
            className="relative z-10 h-6 w-6 shrink-0 object-contain max-sm:hidden sm:block sm:h-[28px] sm:w-[28px]"
            aria-hidden
          />
        </div>
      </div>
    </header>
  )
}
