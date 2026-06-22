import { HighlightCard, type HighlightCardItem } from './HighlightCard'
import { AnimatedReveal } from './AnimatedReveal'

export interface DestaquesCardsProps {
  items: HighlightCardItem[]
}

/**
 * Layout Destaques: 1º card full width; cards 2–5 em grid 2 colunas; 6º card full width; 7+ em grid 2 colunas.
 */
export function DestaquesCards({ items }: DestaquesCardsProps) {
  if (!items.length) return null

  if (items.length === 1) {
    return (
      <div className="flex flex-col gap-4 md:gap-[32px]">
        <AnimatedReveal index={0}>
          <HighlightCard item={items[0]} className="w-full" />
        </AnimatedReveal>
      </div>
    )
  }

  // Para coleções pequenas, priorizamos equilíbrio visual em vez do layout editorial
  // com card hero, evitando uma última célula vazia quando há 4 cards.
  if (items.length <= 4) {
    return (
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-[32px]">
        {items.map((item, index) => (
          <AnimatedReveal key={item.id} index={index}>
            <HighlightCard item={item} className="h-full min-w-0" />
          </AnimatedReveal>
        ))}
      </div>
    )
  }

  const [first, ...rest] = items
  const cards2to5 = rest.slice(0, 4)
  const card6 = rest[4]
  const tail = rest.slice(5)
  const tailGridItems = tail.length % 2 === 1 ? tail.slice(0, -1) : tail
  const tailFullWidth = tail.length % 2 === 1 ? tail[tail.length - 1] : null

  let animIndex = 0

  return (
    <div className="flex flex-col gap-4 md:gap-[32px]">
      <AnimatedReveal index={animIndex++}>
        <HighlightCard item={first} className="w-full" />
      </AnimatedReveal>
      {cards2to5.length > 0 && (
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-[32px]">
          {cards2to5.map((item) => (
            <AnimatedReveal key={item.id} index={animIndex++}>
              <HighlightCard item={item} className="h-full min-w-0" />
            </AnimatedReveal>
          ))}
        </div>
      )}
      {card6 ? (
        <AnimatedReveal index={animIndex++}>
          <HighlightCard item={card6} className="w-full" />
        </AnimatedReveal>
      ) : null}
      {tailGridItems.length > 0 && (
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-[32px]">
          {tailGridItems.map((item) => (
            <AnimatedReveal key={item.id} index={animIndex++}>
              <HighlightCard item={item} className="h-full min-w-0" />
            </AnimatedReveal>
          ))}
        </div>
      )}
      {tailFullWidth ? (
        <AnimatedReveal index={animIndex++}>
          <HighlightCard item={tailFullWidth} className="w-full" />
        </AnimatedReveal>
      ) : null}
    </div>
  )
}
