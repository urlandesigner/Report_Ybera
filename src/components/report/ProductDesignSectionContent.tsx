import { type ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { clsx } from 'clsx'
import type { ProductDesignCard } from '../../data/reportMock'
import { CARD_HOVER_ARTICLE_CLASSES, cardHoverShadowStyle } from './Card'

/** Hero (índice 0): lilás claro */
const PD_HERO_BG = '#EDE9FE'

/**
 * Itens 1–3 no grid de 3 colunas (posições fixas):
 * 1 → azul claro, 2 → rosa claro, 3 → verde claro
 */
const PD_TRIO_BGS = ['#E8F0FF', '#FDEDF4', '#E7F5E8'] as const

/**
 * Itens 4+ no grid 2 colunas: cores por linha [esquerda, direita], ciclo de 4 linhas.
 */
const PD_PAIR_ROW_BGS: [string, string][] = [
  ['#FFF3E6', '#FEEDFA'], // linha 1: bege, rosa
  ['#F1EBFF', '#E8F0FF'], // linha 2: lilás, azul
  ['#FEEDFA', '#E7F5E8'], // linha 3: rosa, verde
  ['#FFF3E6', '#FEEDFA'], // linha 4: bege, rosa
]

function chunkPairs<T>(arr: T[]): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += 2) out.push(arr.slice(i, i + 2))
  return out
}

function ProductDesignSurfaceCard({
  title,
  children,
  backgroundColor,
  icon,
  className,
}: {
  title: string
  children: ReactNode
  backgroundColor: string
  icon: ReactNode
  className?: string
}) {
  return (
    <article
      className={clsx(
        CARD_HOVER_ARTICLE_CLASSES,
        'flex min-h-0 flex-col items-start gap-5 rounded-report-lg p-6 font-sans',
        className
      )}
      style={{ backgroundColor, ...cardHoverShadowStyle(backgroundColor) }}
    >
      <div
        className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full p-3 sm:flex [&_svg]:h-6 [&_svg]:w-6"
        style={{ background: 'rgba(255, 255, 255, 0.45)' }}
        aria-hidden
      >
        {icon}
      </div>
      <h3
        className="text-[18px] font-bold leading-[120%] text-[#3C3C3C] sm:text-xl md:text-2xl"
        style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
      >
        {title}
      </h3>
      <div
        className="text-base font-normal text-[#505052]"
        style={{
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          lineHeight: '22.75px',
        }}
      >
        {children}
      </div>
    </article>
  )
}

function ProductDesignHeroCard({
  item,
  icon,
}: {
  item: ProductDesignCard
  icon: ReactNode
}) {
  return (
    <article
      className={clsx(CARD_HOVER_ARTICLE_CLASSES, 'w-full rounded-report-2xl font-sans')}
      style={{ backgroundColor: PD_HERO_BG, ...cardHoverShadowStyle(PD_HERO_BG) }}
    >
      <div
        className={clsx(
          'grid w-full min-w-0 gap-4 overflow-hidden rounded-report-2xl p-6 md:gap-10 md:p-8',
          item.image ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
        )}
      >
        <div
          className={clsx(
            'flex min-w-0 flex-col items-start gap-5',
            item.image && 'order-2 md:order-1'
          )}
        >
          <div
            className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full p-3 sm:flex [&_svg]:h-6 [&_svg]:w-6"
            style={{ background: 'rgba(255, 255, 255, 0.5)' }}
            aria-hidden
          >
            {icon}
          </div>
          <h3
            className="text-[18px] font-bold leading-[120%] text-[#3C3C3C] sm:text-2xl md:text-3xl"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
          >
            {item.title}
          </h3>
          <div
            className="text-base font-normal text-[#505052] md:text-lg"
            style={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              lineHeight: '160%',
            }}
          >
            {item.text}
          </div>
          <button
            type="button"
            className="mt-1 inline-flex max-md:self-center items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition hover:opacity-90"
            style={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              backgroundColor: '#1E1E20',
              color: '#ffffff',
            }}
          >
            Por que o Design System importa
            <ArrowRight className="hidden h-4 w-4 shrink-0 stroke-[2] sm:block" style={{ color: '#ffffff' }} aria-hidden />
          </button>
        </div>
        {item.image ? (
          <div className="order-1 flex min-w-0 w-full items-center justify-center overflow-hidden rounded-2xl md:order-2">
            <img
              src={item.image}
              alt=""
              className="h-auto w-full max-w-full object-contain"
              aria-hidden
            />
          </div>
        ) : null}
      </div>
    </article>
  )
}

export interface ProductDesignSectionContentProps {
  cards: ProductDesignCard[]
  cardIcon: ReactNode
}

/**
 * Layout Produto & Design: hero (item 0) + grid 3 (itens 1–3) + grids 2 (demais), cores por posição.
 */
export function ProductDesignSectionContent({ cards, cardIcon }: ProductDesignSectionContentProps) {
  if (cards.length === 0) return null

  const hero = cards[0]
  const trio = cards.slice(1, 4)
  const rest = cards.slice(4)

  return (
    <div className="flex flex-col gap-4 md:gap-[32px]">
      <ProductDesignHeroCard item={hero} icon={cardIcon} />

      {trio.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-[32px] lg:grid-cols-3 lg:gap-[32px]">
          {trio.map((item, i) => (
            <ProductDesignSurfaceCard
              key={item.id}
              title={item.title}
              backgroundColor={PD_TRIO_BGS[i]}
              icon={cardIcon}
            >
              {item.text}
            </ProductDesignSurfaceCard>
          ))}
        </div>
      )}

      {chunkPairs(rest).map((pair, rowIdx) => {
        const [leftBg, rightBg] = PD_PAIR_ROW_BGS[rowIdx % PD_PAIR_ROW_BGS.length]
        return (
          <div
            key={`pd-pair-row-${rowIdx}`}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-[32px]"
          >
            {pair.map((item, colIdx) => (
              <ProductDesignSurfaceCard
                key={item.id}
                title={item.title}
                backgroundColor={colIdx === 0 ? leftBg : rightBg}
                icon={cardIcon}
              >
                {item.text}
              </ProductDesignSurfaceCard>
            ))}
          </div>
        )
      })}
    </div>
  )
}
