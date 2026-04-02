import { HighlightCard, type HighlightCardItem } from './HighlightCard'

export interface DestaquesCardsProps {
  items: HighlightCardItem[]
}

/**
 * Layout Destaques: 1º card full width; cards 2–5 em grid 2 colunas; 6º card full width; 7+ em grid 2 colunas.
 */
export function DestaquesCards({ items }: DestaquesCardsProps) {
  if (!items.length) return null

  const [first, ...rest] = items
  const cards2to5 = rest.slice(0, 4)
  const card6 = rest[4]
  const tail = rest.slice(5)

  return (
    <div className="flex flex-col gap-4 md:gap-[32px]">
      <HighlightCard item={first} className="w-full" />
      {cards2to5.length > 0 && (
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-[32px]">
          {cards2to5.map((item) => (
            <HighlightCard key={item.id} item={item} className="h-full min-w-0" />
          ))}
        </div>
      )}
      {card6 ? <HighlightCard item={card6} className="w-full" /> : null}
      {tail.length > 0 && (
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-[32px]">
          {tail.map((item) => (
            <HighlightCard key={item.id} item={item} className="h-full min-w-0" />
          ))}
        </div>
      )}
    </div>
  )
}
