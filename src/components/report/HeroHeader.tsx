import type { HeroData } from '../../data/reportMock'
import { REPORT_MAX_WIDTH_CLASS, REPORT_PAD_X } from '../../constants/reportLayout'

/** Mesma coluna de conteúdo que `REPORT_SECTION_INNER_CLASS` (sem padding vertical das secções). */
const HERO_CONTENT_COLUMN = ['mx-auto w-full min-w-0', REPORT_MAX_WIDTH_CLASS, REPORT_PAD_X].join(' ')

/**
 * Capa do relatório — tipografia / gradiente do título conforme Figma.
 */
export function HeroHeader({ data }: { data: HeroData }) {
  const gradient = 'linear-gradient(91deg, #83FF8F -7.59%, #CC7FF0 81.27%)'

  return (
    <header
      className="relative flex h-auto min-h-0 w-full flex-col overflow-x-hidden text-white lg:h-[630px] lg:min-h-[630px]"
      style={{
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        background:
          'radial-gradient(circle at 5% 10%, rgba(120, 80, 255, 0.18), transparent 45%), linear-gradient(90deg, #1E1E1F 0%, #1E1E1F 42%, #171718 100%)',
      }}
    >
      <div
        className={`relative flex min-h-0 flex-1 flex-col py-4 sm:pb-10 sm:pt-8 lg:py-[30px] ${HERO_CONTENT_COLUMN}`}
      >
      {/* Ícone decorativo (canto) — alinhado à coluna do conteúdo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="relative h-full w-full">
          <img
            src="/assets/icon-ybera.png"
            alt="Ybera"
            className="absolute bottom-6 right-0 h-6 w-6 max-sm:hidden object-contain sm:bottom-[30px] sm:block sm:h-[28px] sm:w-[28px]"
            aria-hidden
          />
        </div>
      </div>
      {/* Faixa superior: tags — podem quebrar linha em telas estreitas */}
      <div className="relative z-[1] flex w-full flex-wrap items-center justify-between gap-2 gap-y-3">
        <span className="glass-effect inline-flex max-w-full items-center px-3 py-1.5 text-[12px] font-medium text-white/95 sm:text-[13px]">
          Status Report
        </span>
        <span className="glass-effect inline-flex max-w-[min(100%,14rem)] items-center px-3 py-1.5 text-[12px] font-medium text-white/95 sm:max-w-none sm:text-[13px]">
          {data.metaTag}
        </span>
      </div>

      {/* Conteúdo principal — altura automática no mobile; lg: ocupa o espaço da capa fixa */}
      <div className="relative z-[1] flex flex-col justify-center py-6 sm:py-8 lg:flex-1 lg:py-0">
        <div className="relative w-full min-w-0">
          {/* chrome51 — Figma capa; só desktop/tablet (oculto no mobile) */}
          <img
            src="/assets/chrome51.png"
            alt=""
            className="pointer-events-none absolute right-0 top-8 z-0 hidden h-auto w-[min(200px,42vw)] max-w-[230px] object-contain opacity-90 sm:top-10 sm:block md:top-12 lg:top-14 lg:w-[230px]"
            aria-hidden
          />
          <h1 className="relative z-[1]" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            <span
              className="block text-[clamp(1.5rem,5.5vw,4.375rem)] font-extralight leading-[1.08] tracking-tight sm:leading-[1.1]"
              style={{
                background: gradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {data.title}
            </span>
            {/* leading generoso no mobile: clip de descendentes (ex. "g") com background-clip:text + overflow no header */}
            <span
              className="mt-1 block pb-[0.12em] text-[clamp(2rem,10vw,6rem)] font-bold leading-[1.38] sm:mt-0 sm:pb-0 sm:leading-[1.1] lg:leading-[120px]"
              style={{
                background: gradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {data.highlight}
            </span>
          </h1>
        </div>
      </div>

      {/* Rodapé da capa */}
      <div className="relative z-[1] mt-auto h-auto min-h-0 w-full sm:min-h-[60px]">
        <img
          src="/assets/logo-ybera.png"
          alt="Ybera"
          className="pointer-events-none absolute bottom-0 left-1/2 z-0 max-sm:hidden max-w-[min(100%,700px)] -translate-x-1/2 object-contain object-center opacity-50 sm:block"
          style={{ width: 'min(100%, 700px)' }}
          aria-hidden
        />
        <div className="relative z-10 w-full">
          <p className="text-[14px] leading-snug text-white/60 sm:text-[16px] sm:leading-relaxed">{data.heroFooterLine1}</p>
          <p className="mt-1 text-[14px] leading-snug text-white/60 sm:text-[16px] sm:leading-relaxed">{data.heroFooterLine2}</p>
        </div>
      </div>
      </div>
    </header>
  )
}
