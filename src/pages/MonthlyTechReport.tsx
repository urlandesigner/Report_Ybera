import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import {
  ReportPageLayout,
  HeroHeader,
  ReportSectionTitle,
  ExecutiveSummarySection,
  Card,
  DestaquesCards,
  NextStepsCard,
  ProductDesignSectionContent,
  DeliveriesSection,
  ReportFooter,
  ReportTableOfContents,
  ReportMonthSelector,
  type ReportTocItem,
} from '../components/report'
import { useReadingProgress } from '../hooks/useReadingProgress'
import {
  reportMock,
  destaquesSectionMeta,
  type DeliveryCategory,
  type ExecutiveCard,
  type ExecutiveCardDotColor,
  type ImprovementCard,
  type ProductDesignCard,
} from '../data/reportMock'
import type { NextStepItem, ReportJson } from '../data/report.types'
import {
  getLatestReport,
  getReportByPeriod,
  listReportPeriods,
  periodValue,
} from '../data/reportRegistry'
import { REPORT_SECTION_INNER_CLASS } from '../constants/reportLayout'
import { REPORT_ANCHOR } from '../constants/reportSectionAnchors'
import { useInitialReportHashScroll } from '../hooks/useInitialReportHashScroll'
import { useSectionHashSync } from '../hooks/useSectionHashSync'

/** Última palavra do `#` vira destaque do hero (ex.: "Relatório Mensal de" + "Tecnologia"). */
function splitHeroTitle(fullTitle: string): { title: string; highlight: string } {
  const t = fullTitle.trim()
  if (!t) return { title: reportMock.hero.title, highlight: reportMock.hero.highlight }
  const parts = t.split(/\s+/).filter(Boolean)
  if (parts.length < 2) return { title: t, highlight: '' }
  return {
    title: parts.slice(0, -1).join(' '),
    highlight: parts[parts.length - 1] ?? '',
  }
}

const EXEC_DOT_COLORS: ExecutiveCardDotColor[] = ['blue', 'purple', 'green', 'purple', 'orange']

function executiveCardsFromReport(data: ReportJson): ExecutiveCard[] {
  if (!data.executiveSummary?.length) return reportMock.executiveSummaryCards
  return data.executiveSummary.map((item, i) => ({
    id: `e-${i + 1}`,
    dotColor: EXEC_DOT_COLORS[i % EXEC_DOT_COLORS.length],
    title: item.title,
    text: item.description,
  }))
}

const PD_VARIANTS: ProductDesignCard['variant'][] = [
  'pastel-green',
  'pastel-yellow',
  'pastel-orange',
  'pastel-blue',
]

function productDesignCardsFromReport(data: ReportJson): ProductDesignCard[] {
  const items = data.productDesign ?? []
  if (!items.length) return reportMock.productDesignCards
  return items.map((item, i) => ({
    id: `p-${i + 1}`,
    number: String(i + 1).padStart(2, '0'),
    variant: PD_VARIANTS[i % PD_VARIANTS.length],
    title: item.title,
    text: item.description,
    ...(item.image?.trim() ? { image: item.image.trim() } : {}),
  }))
}

function highlightsCardsFromReport(data: ReportJson): ProductDesignCard[] {
  const items = data.highlights ?? []
  if (!items.length) return []
  return items.map((item, i) => ({
    id: `h-${i + 1}`,
    number: String(i + 1).padStart(2, '0'),
    variant: PD_VARIANTS[i % PD_VARIANTS.length],
    title: item.title,
    text: item.description,
  }))
}

function deliveriesFromReport(data: ReportJson): DeliveryCategory[] {
  const blocks = data.deliveries ?? []
  if (!blocks.length) return reportMock.deliveries
  return blocks.map((cat, i) => ({
    id: `d-${i + 1}`,
    name: cat.category,
    deliveries: cat.items.map((item) => ({
      title: item.title,
      bullets: item.description.trim() ? [item.description.trim()] : [],
      ...(item.notes?.length
        ? {
            notes: item.notes.map((n) => ({
              label: n.label,
              text: n.text,
            })),
          }
        : {}),
    })),
  }))
}

function architectureCardsFromReport(data: ReportJson): ImprovementCard[] {
  const items = data.architecture ?? []
  if (!items.length) return reportMock.improvementsCards
  return items.map((item, i) => ({
    id: `arch-${i + 1}`,
    title: item.title,
    text: item.description,
  }))
}

const cardIcon = <ArrowRight className="w-6 h-6 stroke-[1.5]" style={{ color: '#0F131B' }} />

const { sections, footer } = reportMock

function chunkPairs<T>(arr: T[]): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += 2) out.push(arr.slice(i, i + 2))
  return out
}

const SECTION_SCROLL_ANCHOR = 'scroll-mt-16 md:scroll-mt-[4.5rem]'

type RevealSectionProps = ComponentPropsWithoutRef<'section'> & {
  children: ReactNode
}

function RevealSection({ children, className = '', style, ...props }: RevealSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setVisible(true)
      return
    }

    let rafId: number | null = null
    const syncParallax = () => {
      rafId = null
      const rect = node.getBoundingClientRect()
      const travel = window.innerHeight + rect.height
      const progress = travel > 0 ? Math.min(1, Math.max(0, (window.innerHeight - rect.top) / travel)) : 0.5
      const centered = progress - 0.5

      node.style.setProperty('--section-parallax', String(progress))
      node.style.setProperty('--section-shift', `${centered * -34}px`)
      node.style.setProperty('--section-float-a', `${centered * 120}px`)
      node.style.setProperty('--section-float-b', `${centered * -86}px`)
      node.style.setProperty('--section-scale', String(1 + Math.abs(centered) * 0.025))
    }

    const requestSync = () => {
      if (rafId != null) return
      rafId = window.requestAnimationFrame(syncParallax)
    }

    // threshold 0: secções altas (ex. Entregas) com deep link só mostram o topo no ecrã;
    // com threshold 0.12, intersectionRatio podia ficar sempre abaixo do limiar e a secção
    // permanecia invisível (comportamento inconsistente entre browsers/viewports).
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px 0px 0px', threshold: 0 }
    )

    observer.observe(node)
    syncParallax()
    window.addEventListener('scroll', requestSync, { passive: true })
    window.addEventListener('resize', requestSync)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', requestSync)
      window.removeEventListener('resize', requestSync)
      if (rafId != null) window.cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`${className} relative overflow-hidden transform-gpu transition-[opacity,transform,filter] duration-700 ease-out ${
        visible ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-8 opacity-0 blur-[2px]'
      }`}
      style={{ '--section-parallax': 0.5, ...style } as CSSProperties}
      {...props}
    >
      <div
        className="pointer-events-none absolute -left-[18%] top-[6%] h-[22rem] w-[22rem] rounded-full bg-[#83FF8F]/20 blur-3xl mix-blend-multiply will-change-transform"
        style={{
          transform: 'translate3d(0, var(--section-float-a, 0px), 0) scale(var(--section-scale, 1))',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-[16%] bottom-[8%] h-[26rem] w-[26rem] rounded-full bg-[#CC7FF0]/18 blur-3xl mix-blend-multiply will-change-transform"
        style={{
          transform: 'translate3d(0, var(--section-float-b, 0px), 0) scale(var(--section-scale, 1))',
        }}
        aria-hidden
      />
      <div
        className="relative z-[1] transform-gpu will-change-transform"
        style={{ transform: 'translate3d(0, var(--section-shift, 0px), 0)' }}
      >
        {children}
      </div>
    </section>
  )
}

function normalizeNextStepsItems(raw: ReportJson['nextSteps'] | undefined): NextStepItem[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter(
      (item): item is NextStepItem =>
        item != null &&
        typeof item === 'object' &&
        typeof (item as NextStepItem).title === 'string' &&
        (item as NextStepItem).title.trim().length > 0
    )
    .map((item) => ({
      title: item.title.trim(),
      description: typeof item.description === 'string' ? item.description.trim() : '',
    }))
}

export function MonthlyTechReport() {
  const { year: yearParam, month: monthParam } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const year = yearParam?.trim() ?? ''
  const month = monthParam ? monthParam.trim().padStart(2, '0') : ''

  const reportPeriods = useMemo(() => listReportPeriods(), [])

  const report = useMemo((): ReportJson | null => {
    if (!/^\d{4}$/.test(year) || !/^\d{2}$/.test(month)) return null
    return getReportByPeriod(year, month)
  }, [year, month])

  const latest = useMemo(() => getLatestReport(), [])
  const latestPath = `/report/${latest.year}/${latest.month}`

  const prevPeriodKeyRef = useRef<string | null>(null)
  useEffect(() => {
    const key = `${year}-${month}`
    if (!report) return
    if (prevPeriodKeyRef.current === null) {
      prevPeriodKeyRef.current = key
      return
    }
    if (prevPeriodKeyRef.current !== key) {
      prevPeriodKeyRef.current = key
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [year, month, report])

  const hero = useMemo(
    () => ({
      ...reportMock.hero,
      ...(report && report.title.trim() ? splitHeroTitle(report.title) : {}),
      metaTag: report?.metaTag?.trim() || report?.month?.trim() || reportMock.hero.metaTag,
      heroFooterLine1: report?.heroFooterLine1?.trim() || reportMock.hero.heroFooterLine1,
      heroFooterLine2: report?.heroFooterLine2?.trim() || reportMock.hero.heroFooterLine2,
    }),
    [report]
  )

  const executiveSummaryCards = useMemo(
    () => (report ? executiveCardsFromReport(report) : []),
    [report]
  )
  const deliveries = useMemo(() => (report ? deliveriesFromReport(report) : []), [report])
  const architectureCards = useMemo(
    () => (report ? architectureCardsFromReport(report) : []),
    [report]
  )
  const productDesignCards = useMemo(
    () => (report ? productDesignCardsFromReport(report) : []),
    [report]
  )
  const highlightCards = useMemo(
    () => (report ? highlightsCardsFromReport(report) : []),
    [report]
  )

  const nextStepsItems = useMemo(
    () => (report ? normalizeNextStepsItems(report.nextSteps) : []),
    [report]
  )

  const tocItems = useMemo((): ReportTocItem[] => {
    const items: ReportTocItem[] = [{ id: REPORT_ANCHOR.resumo, label: 'Resumo' }]
    if (highlightCards.length > 0) {
      items.push({ id: REPORT_ANCHOR.destaques, label: 'Destaques' })
    }
    items.push(
      { id: REPORT_ANCHOR.entregas, label: 'Entregas' },
      { id: REPORT_ANCHOR.produto, label: 'Produto' },
      { id: REPORT_ANCHOR.arquitetura, label: 'Arquitetura' },
      { id: REPORT_ANCHOR.proximosPassos, label: 'Próximos passos' }
    )
    return items
  }, [highlightCards.length])

  const tocSectionIds = useMemo(() => tocItems.map((i) => i.id), [tocItems])
  const { progress, activeSectionId } = useReadingProgress(tocSectionIds)
  const [showMonthSelector, setShowMonthSelector] = useState(false)

  useEffect(() => {
    const syncMonthSelectorVisibility = () => {
      const heroTags = document.getElementById('report-hero-tags')
      if (!heroTags) return

      const rect = heroTags.getBoundingClientRect()
      setShowMonthSelector(rect.bottom <= 0)
    }

    syncMonthSelectorVisibility()
    window.addEventListener('scroll', syncMonthSelectorVisibility, { passive: true })
    window.addEventListener('resize', syncMonthSelectorVisibility)

    return () => {
      window.removeEventListener('scroll', syncMonthSelectorVisibility)
      window.removeEventListener('resize', syncMonthSelectorVisibility)
    }
  }, [])

  const { hashSyncEnabled } = useInitialReportHashScroll({
    hasDestaquesSection: highlightCards.length > 0,
    pathname: location.pathname,
  })
  useSectionHashSync(activeSectionId, { enabled: hashSyncEnabled })

  const monthSelector = useMemo(
    () => (
      <ReportMonthSelector
        options={reportPeriods}
        value={periodValue(year, month)}
        onChange={(y, m) => {
          navigate(`/report/${y}/${m}`, { replace: false })
        }}
      />
    ),
    [reportPeriods, year, month, navigate]
  )

  if (!/^\d{4}$/.test(year) || !/^\d{1,2}$/.test(monthParam ?? '') || !report) {
    return <Navigate to={latestPath} replace />
  }

  return (
    <ReportPageLayout>
      <section className="w-full">
        <HeroHeader data={hero} />
      </section>

      <ReportTableOfContents
        items={tocItems}
        activeSectionId={activeSectionId}
        progress={progress}
        monthSelector={showMonthSelector ? monthSelector : null}
      />

      <RevealSection
        id={REPORT_ANCHOR.resumo}
        className={`w-full bg-[#F8F8F8] ${SECTION_SCROLL_ANCHOR}`}
        aria-labelledby="executive-summary-heading"
      >
        <div className={`relative ${REPORT_SECTION_INNER_CLASS}`}>
          <ExecutiveSummarySection section={sections[0]} cards={executiveSummaryCards} />
        </div>
      </RevealSection>

      {highlightCards.length > 0 && (
        <RevealSection
          id={REPORT_ANCHOR.destaques}
          className={`relative w-full bg-white ${SECTION_SCROLL_ANCHOR}`}
          aria-labelledby="section-destaques-heading"
        >
          <div className={`relative ${REPORT_SECTION_INNER_CLASS}`}>
            <ReportSectionTitle
              badge={destaquesSectionMeta.badge}
              brand={destaquesSectionMeta.brand}
              title={destaquesSectionMeta.title}
              description={destaquesSectionMeta.description}
              titleId="section-destaques-heading"
              badgeColor="#F0F0F0"
              fullTitleGradient
              decoration={
                <img src="/assets/image01.svg" alt="" className="opacity-80 sm:opacity-100" aria-hidden />
              }
            />
            <DestaquesCards
              items={highlightCards.map((item) => ({
                id: item.id,
                title: item.title,
                description: item.text,
              }))}
            />
          </div>
        </RevealSection>
      )}

      <RevealSection
        id={REPORT_ANCHOR.entregas}
        className={`w-full bg-white ${SECTION_SCROLL_ANCHOR}`}
        aria-labelledby="section-2"
      >
        <div className={`relative ${REPORT_SECTION_INNER_CLASS}`}>
          <ReportSectionTitle
            badge={sections[1].badge}
            brand={sections[1].brand}
            titleSplit={sections[1].titleSplit}
            title={!sections[1].titleSplit ? sections[1].title : undefined}
            description={sections[1].description}
            titleId="section-2-heading"
            badgeColor="#F0F0F0"
            decoration={<img src="/assets/image02.svg" alt="" className="opacity-90 sm:opacity-100" aria-hidden />}
          />
          <DeliveriesSection categories={deliveries} />
        </div>
      </RevealSection>

      <RevealSection
        id={REPORT_ANCHOR.produto}
        className={`relative w-full bg-[#F8F8F8] ${SECTION_SCROLL_ANCHOR}`}
        aria-labelledby="section-4"
      >
        <div className={`relative ${REPORT_SECTION_INNER_CLASS}`}>
          <ReportSectionTitle
            badge={sections[3].badge}
            brand={sections[3].brand}
            titleSplit={sections[3].titleSplit}
            title={!sections[3].titleSplit ? sections[3].title : undefined}
            description={sections[3].description}
            titleId="section-4-heading"
            decoration={<img src="/assets/image04.svg" alt="" aria-hidden />}
          />
          <ProductDesignSectionContent cards={productDesignCards} cardIcon={cardIcon} />
        </div>
      </RevealSection>

      <RevealSection
        id={REPORT_ANCHOR.arquitetura}
        className={`w-full bg-white ${SECTION_SCROLL_ANCHOR}`}
        aria-labelledby="section-5-heading"
      >
        <div className={`relative ${REPORT_SECTION_INNER_CLASS}`}>
          <ReportSectionTitle
            badge={sections[4].badge}
            brand={sections[4].brand}
            titleSplit={sections[4].titleSplit}
            title={!sections[4].titleSplit ? sections[4].title : undefined}
            description={sections[4].description}
            titleId="section-5-heading"
            badgeColor="#F0F0F0"
            contentOffsetY={20}
            fullTitleGradient
            decoration={<img src="/assets/image03.svg" alt="" aria-hidden />}
          />
          <div className="flex flex-col gap-4 md:gap-[32px]">
            {architectureCards[0] ? (
              <Card
                key={architectureCards[0].id}
                variant="soft"
                backgroundColor="#F8F8F8"
                title={architectureCards[0].title}
                className="w-full !flex-none max-w-none"
              >
                {architectureCards[0].text}
              </Card>
            ) : null}
            {chunkPairs(architectureCards.slice(1)).map((pair, rowIdx) => (
              <div key={`architecture-row-${rowIdx}`} className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-[32px]">
                {pair.map((item) => (
                  <Card key={item.id} variant="soft" backgroundColor="#F8F8F8" title={item.title}>
                    {item.text}
                  </Card>
                ))}
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      <RevealSection
        id={REPORT_ANCHOR.proximosPassos}
        className={`w-full bg-white ${SECTION_SCROLL_ANCHOR}`}
        aria-labelledby="section-6"
      >
        <div className={`relative ${REPORT_SECTION_INNER_CLASS}`}>
          <ReportSectionTitle
            badge={sections[5].badge}
            brand={sections[5].brand}
            titleSplit={sections[5].titleSplit}
            title={!sections[5].titleSplit ? sections[5].title : undefined}
            description={sections[5].description}
            titleId="section-6-heading"
            badgeColor="#F0F0F0"
            fullTitleGradient
          />
          <div className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-[32px]">
            {nextStepsItems.map((item, idx) => (
              <NextStepsCard key={`next-step-${idx}`} title={item.title} description={item.description} />
            ))}
          </div>
        </div>
      </RevealSection>

      <RevealSection className="w-full bg-white">
        <div className={REPORT_SECTION_INNER_CLASS}>
          <ReportFooter
            title={footer.title}
            slogan={footer.slogan}
            contactPrompt={footer.contactPrompt}
            email={footer.email}
            brand={footer.brand}
          />
        </div>
      </RevealSection>
    </ReportPageLayout>
  )
}
