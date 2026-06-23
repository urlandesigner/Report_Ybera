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
  ComparativeSectionContent,
  DeliveriesSection,
  ReportFooter,
  ReportTableOfContents,
  ReportMonthSelector,
  SupportCard,
  type ReportTocItem,
  type HighlightCardItem,
} from '../components/report'
import { useReadingProgress } from '../hooks/useReadingProgress'
import {
  reportMock,
  destaquesSectionMeta,
  comparativeSectionMeta,
  type DeliveryCategory,
  type ExecutiveCard,
  type ExecutiveCardDotColor,
  type ImprovementCard,
  type ProductDesignCard,
  type SupportCard as SupportCardModel,
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
    ...(item.ctaLabel?.trim() ? { ctaLabel: item.ctaLabel.trim() } : {}),
    ...(item.ctaHref?.trim() ? { ctaHref: item.ctaHref.trim() } : {}),
  }))
}

function newProCardsFromReport(data: ReportJson): ProductDesignCard[] {
  const items = data.newPro ?? []
  if (!items.length) return []
  return items.map((item, i) => ({
    id: `np-${i + 1}`,
    number: String(i + 1).padStart(2, '0'),
    variant: PD_VARIANTS[i % PD_VARIANTS.length],
    title: item.title,
    text: item.description,
    ...(item.image?.trim() ? { image: item.image.trim() } : {}),
    ...(item.ctaLabel?.trim() ? { ctaLabel: item.ctaLabel.trim() } : {}),
    ...(item.ctaHref?.trim() ? { ctaHref: item.ctaHref.trim() } : {}),
  }))
}

function highlightsCardsFromReport(data: ReportJson): HighlightCardItem[] {
  const items = data.highlights ?? []
  if (!items.length) return []
  return items.map((item, i) => ({
    id: `h-${i + 1}`,
    title: item.title,
    description: item.description,
    ...(item.bullets?.length ? { bullets: item.bullets } : {}),
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
  if (!items.length) return []
  return items.map((item, i) => ({
    id: `arch-${i + 1}`,
    title: item.title,
    text: item.description,
    ...(item.notes?.length
      ? {
          notes: item.notes.map((n) => ({
            label: n.label,
            text: n.text,
          })),
        }
      : {}),
  }))
}

function supportCardsFromReport(data: ReportJson): SupportCardModel[] {
  const items = data.support ?? []
  if (!items.length) return []
  return items.map((item, i) => ({
    id: `s-${i + 1}`,
    title: item.title,
    description: item.description,
  }))
}

function erpSeniorCardsFromReport(data: ReportJson): ImprovementCard[] {
  const items = data.erpSenior ?? []
  if (!items.length) return []
  return items.map((item, i) => ({
    id: `erp-${i + 1}`,
    title: item.title,
    text: item.description,
    ...(item.notes?.length
      ? {
          notes: item.notes.map((n) => ({
            label: n.label,
            text: n.text,
          })),
        }
      : {}),
  }))
}

const cardIcon = <ArrowRight className="w-6 h-6 stroke-[1.5]" style={{ color: '#0F131B' }} />
const ARCHITECTURE_SECTION_BRAND = 'Architecture'
const ARCHITECTURE_SECTION_DESCRIPTION =
  'Iniciativas estruturais voltadas à evolução da base técnica da plataforma, com foco em performance, eficiência operacional e sustentação do crescimento do ecossistema.'

const { sections, footer } = reportMock

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

function normalizeNextStepsColumns(raw: ReportJson['nextStepsColumns'] | undefined) {
  if (!Array.isArray(raw)) return []
  return raw
    .filter(
      (column): column is NonNullable<ReportJson['nextStepsColumns']>[number] =>
        column != null &&
        typeof column === 'object' &&
        typeof column.title === 'string' &&
        column.title.trim().length > 0 &&
        Array.isArray(column.items)
    )
    .map((column) => ({
      title: column.title.trim(),
      items: column.items
        .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
        .map((item) => item.trim()),
    }))
    .filter((column) => column.items.length > 0)
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
  const supportCards = useMemo(() => (report ? supportCardsFromReport(report) : []), [report])
  const productDesignCards = useMemo(
    () => (report ? productDesignCardsFromReport(report) : []),
    [report]
  )
  const newProCards = useMemo(() => (report ? newProCardsFromReport(report) : []), [report])
  const highlightCards = useMemo(
    () => (report ? highlightsCardsFromReport(report) : []),
    [report]
  )
  const erpSeniorCards = useMemo(() => (report ? erpSeniorCardsFromReport(report) : []), [report])
  const comparative = useMemo(() => report?.comparative ?? null, [report])
  const architectureSectionVariant = report?.architectureSectionVariant ?? 'improvements'
  const hasComparative =
    !!comparative &&
    (comparative.overview.trim().length > 0 ||
      comparative.history.length > 0 ||
      comparative.insights.length > 0)
  const hasSplitArchitectureSections = newProCards.length > 0 || erpSeniorCards.length > 0

  const nextStepsItems = useMemo(
    () => (report ? normalizeNextStepsItems(report.nextSteps) : []),
    [report]
  )
  const nextStepsColumns = useMemo(
    () => (report ? normalizeNextStepsColumns(report.nextStepsColumns) : []),
    [report]
  )
  const hasNextSteps = nextStepsColumns.length > 0 || nextStepsItems.length > 0
  const sectionBadges = useMemo(() => {
    const orderedIds: string[] = [REPORT_ANCHOR.resumo]
    if (highlightCards.length > 0) orderedIds.push(REPORT_ANCHOR.destaques)
    orderedIds.push(REPORT_ANCHOR.entregas)
    if (!hasSplitArchitectureSections && architectureCards.length > 0) {
      orderedIds.push(REPORT_ANCHOR.arquitetura)
    }
    if (productDesignCards.length > 0) orderedIds.push(REPORT_ANCHOR.produto)
    if (newProCards.length > 0) orderedIds.push(REPORT_ANCHOR.novoPro)
    if (hasSplitArchitectureSections && architectureCards.length > 0) {
      orderedIds.push(REPORT_ANCHOR.arquitetura)
    }
    if (erpSeniorCards.length > 0) orderedIds.push(REPORT_ANCHOR.erpSenior)
    if (hasComparative) orderedIds.push(REPORT_ANCHOR.comparativo)
    if (supportCards.length > 0) orderedIds.push(REPORT_ANCHOR.suporte)
    if (hasNextSteps) orderedIds.push(REPORT_ANCHOR.proximosPassos)

    return Object.fromEntries(
      orderedIds.map((id, index) => [id, String(index + 1).padStart(2, '0')])
    ) as Record<string, string>
  }, [
    architectureCards.length,
    erpSeniorCards.length,
    hasComparative,
    hasNextSteps,
    hasSplitArchitectureSections,
    highlightCards.length,
    newProCards.length,
    productDesignCards.length,
    supportCards.length,
  ])

  const tocItems = useMemo((): ReportTocItem[] => {
    const items: ReportTocItem[] = [{ id: REPORT_ANCHOR.resumo, label: 'Resumo' }]
    if (highlightCards.length > 0) {
      items.push({ id: REPORT_ANCHOR.destaques, label: 'Destaques' })
    }
    items.push({ id: REPORT_ANCHOR.entregas, label: 'Entregas' })
    if (!hasSplitArchitectureSections && architectureCards.length > 0) {
      items.push({
        id: REPORT_ANCHOR.arquitetura,
        label: architectureSectionVariant === 'architecture' ? 'Arquitetura' : 'Melhorias',
      })
    }
    if (productDesignCards.length > 0) {
      items.push({ id: REPORT_ANCHOR.produto, label: 'Produto & Design' })
    }
    if (newProCards.length > 0) {
      items.push({ id: REPORT_ANCHOR.novoPro, label: 'Novo PRO' })
    }
    if (hasSplitArchitectureSections && architectureCards.length > 0) {
      items.push({ id: REPORT_ANCHOR.arquitetura, label: 'Arquitetura' })
    }
    if (erpSeniorCards.length > 0) {
      items.push({ id: REPORT_ANCHOR.erpSenior, label: 'ERP Sênior' })
    }
    if (hasComparative) {
      items.push({ id: REPORT_ANCHOR.comparativo, label: 'Comparativo' })
    }
    if (supportCards.length > 0) {
      items.push({ id: REPORT_ANCHOR.suporte, label: 'Suporte' })
    }
    if (hasNextSteps) {
      items.push({ id: REPORT_ANCHOR.proximosPassos, label: 'Próximos passos' })
    }
    return items
  }, [
    architectureCards.length,
    architectureSectionVariant,
    erpSeniorCards.length,
    hasComparative,
    hasNextSteps,
    hasSplitArchitectureSections,
    highlightCards.length,
    newProCards.length,
    productDesignCards.length,
    supportCards.length,
  ])

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
        visible={showMonthSelector}
        monthSelector={monthSelector}
      />

      <RevealSection
        id={REPORT_ANCHOR.resumo}
        className={`w-full bg-[#F8F8F8] ${SECTION_SCROLL_ANCHOR}`}
        aria-labelledby="executive-summary-heading"
      >
          <div className={`relative ${REPORT_SECTION_INNER_CLASS}`}>
          <ExecutiveSummarySection
            section={{ ...sections[0], badge: sectionBadges[REPORT_ANCHOR.resumo] ?? sections[0].badge }}
            cards={executiveSummaryCards}
          />
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
              badge={sectionBadges[REPORT_ANCHOR.destaques] ?? destaquesSectionMeta.badge}
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
            <DestaquesCards items={highlightCards} />
          </div>
        </RevealSection>
      )}

      <section
        id={REPORT_ANCHOR.entregas}
        className={`w-full bg-white ${SECTION_SCROLL_ANCHOR}`}
        aria-labelledby="section-2"
      >
        <div className={`relative ${REPORT_SECTION_INNER_CLASS}`}>
          <ReportSectionTitle
            badge={sectionBadges[REPORT_ANCHOR.entregas] ?? sections[1].badge}
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
      </section>

      {architectureCards.length > 0 && !hasSplitArchitectureSections && (
        <RevealSection
          id={REPORT_ANCHOR.arquitetura}
          className={`w-full bg-white ${SECTION_SCROLL_ANCHOR}`}
          aria-labelledby="section-3-heading"
        >
          <div className={`relative ${REPORT_SECTION_INNER_CLASS}`}>
            <ReportSectionTitle
              badge={sectionBadges[REPORT_ANCHOR.arquitetura] ?? sections[2].badge}
              brand={
                architectureSectionVariant === 'architecture'
                  ? ARCHITECTURE_SECTION_BRAND
                  : sections[2].brand
              }
              titleSplit={
                architectureSectionVariant === 'architecture' ? undefined : sections[2].titleSplit
              }
              title={
                architectureSectionVariant === 'architecture'
                  ? 'Arquitetura'
                  : !sections[2].titleSplit
                    ? sections[2].title
                    : undefined
              }
              description={
                architectureSectionVariant === 'architecture'
                  ? ARCHITECTURE_SECTION_DESCRIPTION
                  : sections[2].description
              }
              titleId="section-3-heading"
              badgeColor="#F0F0F0"
              contentOffsetY={20}
              fullTitleGradient
              decoration={
                <img
                  src={architectureSectionVariant === 'architecture' ? '/assets/image05.svg' : '/assets/image03.svg'}
                  alt=""
                  aria-hidden
                />
              }
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-[32px]">
              {architectureCards.map((item, i) => {
                const isOrphan =
                  architectureCards.length % 2 === 1 && i === architectureCards.length - 1
                return (
                  <Card
                    key={item.id}
                    variant="soft"
                    backgroundColor="#F8F8F8"
                    title={item.title}
                    className={isOrphan ? 'sm:col-span-2 !flex-none max-w-none' : undefined}
                  >
                    <>
                      {item.text}
                      {item.notes?.length ? (
                        <ul className="mt-4 list-disc space-y-2 pl-5">
                          {item.notes.map((note, noteIdx) => (
                            <li key={`${item.id}-note-${noteIdx}`}>
                              {note.label ? <strong>{`${note.label}: `}</strong> : null}
                              {note.text}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </>
                  </Card>
                )
              })}
            </div>
          </div>
        </RevealSection>
      )}

      {productDesignCards.length > 0 && (
        <RevealSection
          id={REPORT_ANCHOR.produto}
          className={`relative w-full bg-[#F8F8F8] ${SECTION_SCROLL_ANCHOR}`}
          aria-labelledby="section-4"
        >
          <div className={`relative ${REPORT_SECTION_INNER_CLASS}`}>
            <ReportSectionTitle
              badge={sectionBadges[REPORT_ANCHOR.produto] ?? sections[3].badge}
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
      )}

      {newProCards.length > 0 && (
        <RevealSection
          id={REPORT_ANCHOR.novoPro}
          className={`relative w-full bg-[#F8F8F8] ${SECTION_SCROLL_ANCHOR}`}
          aria-labelledby="section-novo-pro-heading"
        >
          <div className={`relative ${REPORT_SECTION_INNER_CLASS}`}>
            <ReportSectionTitle
              badge={sectionBadges[REPORT_ANCHOR.novoPro] ?? '04'}
              brand="New Pro"
              titleSplit={{ left: 'Novo', right: 'PRO' }}
              description="Evolução estrutural do Novo PRO, com avanços em documentação, prototipação e consolidação de fundamentos que sustentam o desenvolvimento e a escalabilidade da nova plataforma."
              titleId="section-novo-pro-heading"
              decoration={<img src="/assets/image04.svg" alt="" aria-hidden />}
            />
            <ProductDesignSectionContent cards={newProCards} cardIcon={cardIcon} colorScheme="green" />
          </div>
        </RevealSection>
      )}

      {architectureCards.length > 0 && hasSplitArchitectureSections && (
        <RevealSection
          id={REPORT_ANCHOR.arquitetura}
          className={`w-full bg-white ${SECTION_SCROLL_ANCHOR}`}
          aria-labelledby="section-arquitetura-heading"
        >
          <div className={`relative ${REPORT_SECTION_INNER_CLASS}`}>
            <ReportSectionTitle
              badge={sectionBadges[REPORT_ANCHOR.arquitetura] ?? '05'}
              brand={ARCHITECTURE_SECTION_BRAND}
              title="Arquitetura"
              description={ARCHITECTURE_SECTION_DESCRIPTION}
              titleId="section-arquitetura-heading"
              badgeColor="#F0F0F0"
              fullTitleGradient
              decoration={<img src="/assets/image05.svg" alt="" aria-hidden />}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-[32px]">
              {architectureCards.map((item, i) => {
                const isOrphan =
                  architectureCards.length % 2 === 1 && i === architectureCards.length - 1
                return (
                  <Card
                    key={item.id}
                    variant="soft"
                    backgroundColor="#F8F8F8"
                    title={item.title}
                    className={isOrphan ? 'sm:col-span-2 !flex-none max-w-none' : undefined}
                  >
                    <>
                      {item.text}
                      {item.notes?.length ? (
                        <ul className="mt-4 list-disc space-y-2 pl-5">
                          {item.notes.map((note, noteIdx) => (
                            <li key={`${item.id}-note-${noteIdx}`}>
                              {note.label ? <strong>{`${note.label}: `}</strong> : null}
                              {note.text}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </>
                  </Card>
                )
              })}
            </div>
          </div>
        </RevealSection>
      )}

      {erpSeniorCards.length > 0 && (
        <RevealSection
          id={REPORT_ANCHOR.erpSenior}
          className={`w-full bg-white ${SECTION_SCROLL_ANCHOR}`}
          aria-labelledby="section-erp-senior-heading"
        >
          <div className={`relative ${REPORT_SECTION_INNER_CLASS}`}>
            <ReportSectionTitle
              badge={sectionBadges[REPORT_ANCHOR.erpSenior] ?? '06'}
              brand="Advances"
              title="ERP Sênior"
              description="No avanço da finalização da implementação do ERP Sênior, podemos destacar os seguintes pontos:"
              titleId="section-erp-senior-heading"
              badgeColor="#F0F0F0"
              fullTitleGradient
              decoration={<img src="/assets/image06.svg" alt="" aria-hidden />}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-[32px]">
              {erpSeniorCards.map((item, i) => {
                const isOrphan = erpSeniorCards.length % 2 === 1 && i === erpSeniorCards.length - 1
                return (
                  <Card
                    key={item.id}
                    variant="soft"
                    backgroundColor="#F8F8F8"
                    title={item.title}
                    className={isOrphan ? 'sm:col-span-2 !flex-none max-w-none' : undefined}
                  >
                    <>
                      {item.text}
                      {item.notes?.length ? (
                        <ul className="mt-4 list-disc space-y-2 pl-5">
                          {item.notes.map((note, noteIdx) => (
                            <li key={`${item.id}-note-${noteIdx}`}>
                              {note.label ? <strong>{`${note.label}: `}</strong> : null}
                              {note.text}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </>
                  </Card>
                )
              })}
            </div>
          </div>
        </RevealSection>
      )}

      {hasComparative && comparative && (
        <RevealSection
          id={REPORT_ANCHOR.comparativo}
          className={`relative w-full bg-white ${SECTION_SCROLL_ANCHOR}`}
          aria-labelledby="section-comparativo-heading"
        >
          <div className={`relative ${REPORT_SECTION_INNER_CLASS}`}>
            <ReportSectionTitle
              badge={sectionBadges[REPORT_ANCHOR.comparativo] ?? comparativeSectionMeta.badge}
              brand={comparativeSectionMeta.brand}
              title={comparativeSectionMeta.title}
              description={comparativeSectionMeta.description}
              titleId="section-comparativo-heading"
              badgeColor="#F0F0F0"
              fullTitleGradient
            />
            <ComparativeSectionContent data={comparative} />
          </div>
        </RevealSection>
      )}

      {supportCards.length > 0 && (
        <RevealSection
          id={REPORT_ANCHOR.suporte}
          className={`w-full bg-white ${SECTION_SCROLL_ANCHOR}`}
          aria-labelledby="section-5-heading"
        >
          <div className={`relative ${REPORT_SECTION_INNER_CLASS}`}>
            <ReportSectionTitle
              badge={sectionBadges[REPORT_ANCHOR.suporte] ?? sections[4].badge}
              brand={sections[4].brand}
              titleSplit={sections[4].titleSplit}
              title={!sections[4].titleSplit ? sections[4].title : undefined}
              description={sections[4].description}
              titleId="section-5-heading"
              badgeColor="#F0F0F0"
              fullTitleGradient
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-[32px]">
              {supportCards.map((item) => (
                <SupportCard
                  key={item.id}
                  icon={cardIcon}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </div>
        </RevealSection>
      )}

      {hasNextSteps && (
        <RevealSection
          id={REPORT_ANCHOR.proximosPassos}
          className={`w-full bg-white ${SECTION_SCROLL_ANCHOR}`}
          aria-labelledby="section-6"
        >
          <div className={`relative ${REPORT_SECTION_INNER_CLASS}`}>
            <ReportSectionTitle
              badge={sectionBadges[REPORT_ANCHOR.proximosPassos] ?? sections[5].badge}
              brand={sections[5].brand}
              titleSplit={sections[5].titleSplit}
              title={!sections[5].titleSplit ? sections[5].title : undefined}
              description={sections[5].description}
              titleId="section-6-heading"
              badgeColor="#F0F0F0"
              fullTitleGradient
            />
            {nextStepsColumns.length > 0 ? (
              <div className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-[32px]">
                {nextStepsColumns.map((column, idx) => {
                  const cardBg = idx % 2 === 0 ? '#DDEAFD' : '#E7E1FF'
                  const badgeBg = idx % 2 === 0 ? '#C5D9FA' : '#D9CCFF'
                  const badgeText = idx % 2 === 0 ? '#427FDF' : '#7E6AE8'
                  return (
                    <article
                      key={`next-steps-column-${idx}`}
                      className="rounded-report-lg p-6 md:p-9"
                      style={{ backgroundColor: cardBg }}
                    >
                      <div
                        className="mb-8 inline-flex rounded-[20px] px-7 py-3 text-[18px] font-bold leading-none"
                        style={{ backgroundColor: badgeBg, color: badgeText }}
                      >
                        {column.title}
                      </div>
                      <div className="space-y-6">
                        {column.items.map((item, itemIdx) => (
                          <div key={`next-steps-item-${idx}-${itemIdx}`} className="flex items-start gap-5">
                            <div
                              className="mt-1 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full sm:flex [&_svg]:h-5 [&_svg]:w-5"
                              style={{ background: 'rgba(255, 255, 255, 0.55)', color: badgeText }}
                              aria-hidden
                            >
                              <ArrowRight className="stroke-[1.8]" />
                            </div>
                            <p className="text-[18px] font-normal leading-[1.35] text-[#505052] sm:text-[22px]">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : (
              <div className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-[32px]">
                {nextStepsItems.map((item, idx) => {
                  const isOrphan = nextStepsItems.length % 2 === 1 && idx === nextStepsItems.length - 1
                  return (
                    <NextStepsCard
                      key={`next-step-${idx}`}
                      title={item.title}
                      description={item.description}
                      className={isOrphan ? 'md:col-span-2' : undefined}
                    />
                  )
                })}
              </div>
            )}
          </div>
        </RevealSection>
      )}

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
