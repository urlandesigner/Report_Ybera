import { useMemo, useRef, useState } from 'react'
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
} from '../components/report'
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
import reportJson from '../data/report.json'
import {
  SatisfactionSurveyPopup,
  createSurveySubmitHandler,
  DEFAULT_STORAGE_KEY,
} from 'satisfaction-survey-react'
import { REPORT_SECTION_INNER_CLASS } from '../constants/reportLayout'

const report = reportJson as ReportJson

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

/** Mesma rotação de variantes dos cards mock (layout inalterado). */
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

/** Section `## Destaques` → cards no padrão Produto & Design (pastéis + grid). */
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

/** `deliveries` no JSON → `DeliveryCategory[]` do layout (descrição vira um bullet). */
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

/** Section `## Arquitetura` → cards da seção 05 (badge 05). */
function architectureCardsFromReport(data: ReportJson): ImprovementCard[] {
  const items = data.architecture ?? []
  if (!items.length) return reportMock.improvementsCards
  return items.map((item, i) => ({
    id: `arch-${i + 1}`,
    title: item.title,
    text: item.description,
  }))
}

/** Ícone padrão dos cards: arrow-right na cor #0F131B */
const cardIcon = <ArrowRight className="w-6 h-6 stroke-[1.5]" style={{ color: '#0F131B' }} />

const { sections, footer } = reportMock

const hero = {
  ...reportMock.hero,
  ...(report.title.trim() ? splitHeroTitle(report.title) : {}),
  metaTag: report.metaTag?.trim() || report.month?.trim() || reportMock.hero.metaTag,
  heroFooterLine1: report.heroFooterLine1?.trim() || reportMock.hero.heroFooterLine1,
  heroFooterLine2: report.heroFooterLine2?.trim() || reportMock.hero.heroFooterLine2,
}

const executiveSummaryCards = executiveCardsFromReport(report)
const deliveries = deliveriesFromReport(report)
const architectureCards = architectureCardsFromReport(report)
const productDesignCards = productDesignCardsFromReport(report)

/** Linhas de 2 cards (mesmo grid da terceira linha da section). */
function chunkPairs<T>(arr: T[]): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += 2) out.push(arr.slice(i, i + 2))
  return out
}

const highlightCards = highlightsCardsFromReport(report)

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
  const section06Ref = useRef<HTMLElement>(null)
  const [surveyDismissed, setSurveyDismissed] = useState(false)
  const nextStepsItems = normalizeNextStepsItems(report.nextSteps)

  const handleSurveySubmit = useMemo(
    () =>
      createSurveySubmitHandler({
        storageKey: DEFAULT_STORAGE_KEY,
        apiUrl: import.meta.env.VITE_SURVEY_API_URL,
      }),
    []
  )

  return (
    <ReportPageLayout>
      {/* Hero: largura total do navegador, sem margin */}
      <section className="w-full">
        <HeroHeader data={hero} />
      </section>

      {/* Seção 1: Resumo Executivo — background #F8F8F8 */}
      <section className="w-full bg-[#F8F8F8]" aria-labelledby="executive-summary-heading">
        <div className={`relative ${REPORT_SECTION_INNER_CLASS}`}>
          <ExecutiveSummarySection
            section={sections[0]}
            cards={executiveSummaryCards}
          />
        </div>
      </section>

      {/* Destaques — só exibe se `## Destaques` tiver bullets no markdown */}
      {highlightCards.length > 0 && (
        <section className="w-full bg-white relative" aria-labelledby="section-destaques-heading">
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
                <img
                  src="/assets/image01.svg"
                  alt=""
                  className="opacity-80 sm:opacity-100"
                  aria-hidden
                />
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
        </section>
      )}

      {/* Seção 2: Entregas Principais — mesmo container que as demais */}
      <section className="w-full bg-white" aria-labelledby="section-2">
        <div className={`relative ${REPORT_SECTION_INNER_CLASS}`}>
          <ReportSectionTitle
            badge={sections[1].badge}
            brand={sections[1].brand}
            titleSplit={sections[1].titleSplit}
            title={!sections[1].titleSplit ? sections[1].title : undefined}
            description={sections[1].description}
            titleId="section-2-heading"
            badgeColor="#F0F0F0"
            decoration={
              <img src="/assets/image02.svg" alt="" className="opacity-90 sm:opacity-100" aria-hidden />
            }
          />
          <DeliveriesSection categories={deliveries} />
        </div>
      </section>

      {/* Seção 4: Produto & Design — mesmo fundo cinza e número branco da seção 01 (Resumo Executivo) */}
      <section className="relative w-full bg-[#F8F8F8]" aria-labelledby="section-4">
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
      </section>

      {/* Seção 5: Arquitetura (conteúdo de ## Arquitetura no markdown) — background #ffffff */}
      <section className="w-full bg-white" aria-labelledby="section-5-heading">
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
              <div
                key={`architecture-row-${rowIdx}`}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-[32px]"
              >
                {pair.map((item) => (
                  <Card key={item.id} variant="soft" backgroundColor="#F8F8F8" title={item.title}>
                    {item.text}
                  </Card>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção 6: Próximos Passos — background #ffffff */}
      <section ref={section06Ref} className="w-full bg-white" aria-labelledby="section-6">
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
            <NextStepsCard
              key={`next-step-${idx}`}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
        </div>
      </section>

      {!surveyDismissed && (
        <SatisfactionSurveyPopup
          triggerRef={section06Ref}
          onSubmit={handleSurveySubmit}
          onClose={() => setSurveyDismissed(true)}
          fontFamily='"Plus Jakarta Sans", sans-serif'
        />
      )}

      {/* Footer: fundo 100% largura, conteúdo alinhado às secções */}
      <section className="w-full bg-white">
        <div className={REPORT_SECTION_INNER_CLASS}>
          <ReportFooter title={footer.title} slogan={footer.slogan} contactPrompt={footer.contactPrompt} email={footer.email} brand={footer.brand} />
        </div>
      </section>
    </ReportPageLayout>
  )
}
