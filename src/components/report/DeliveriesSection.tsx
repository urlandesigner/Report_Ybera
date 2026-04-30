import { useState } from 'react'
import type { DeliveryCategory, DeliveryItem } from '../../data/reportMock'

const fontSans = { fontFamily: '"Plus Jakarta Sans", sans-serif' } as const

/** "Implementações" no título da categoria usa escala ligeiramente menor no desktop. */
function renderDeliveryCategoryTitle(name: string) {
  const word = 'Implementações'
  const i = name.indexOf(word)
  if (i === -1) return name
  return (
    <>
      {name.slice(0, i)}
      <span className="text-[1.75rem] md:text-[2rem] lg:text-[38px]">{word}</span>
      {name.slice(i + word.length)}
    </>
  )
}

function DeliveryItemBlock({ delivery }: { delivery: DeliveryItem }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <h4 className="text-[17px] font-medium leading-6 text-[#3C3C3C]" style={fontSans}>
        {delivery.title}
      </h4>
      {delivery.bullets.length > 0 ? (
        <div
          className="space-y-1.5 text-base font-normal leading-normal text-neutral-600"
          style={fontSans}
        >
          {delivery.bullets.map((bullet, i) => (
            <p key={i} className="min-w-0">
              {bullet}
            </p>
          ))}
        </div>
      ) : null}
      {delivery.notes && delivery.notes.length > 0 ? (
        <ul
          className={`list-disc list-outside space-y-1.5 pl-5 text-base font-normal leading-normal text-neutral-600 marker:text-neutral-400 ${
            delivery.bullets.length > 0 ? 'mt-2' : ''
          }`}
          style={fontSans}
        >
          {delivery.notes.map((note, ni) => (
            <li key={ni} className="pl-1">
              {note.label ? (
                <>
                  <strong className="font-bold text-[#3C3C3C]" style={fontSans}>
                    {note.label}:
                  </strong>{' '}
                </>
              ) : null}
              {note.text}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

interface DeliveriesSectionProps {
  categories: DeliveryCategory[]
}

/**
 * Entregas por categoria — alinhado ao Figma (node 10-2965): bloco cinza envolvente,
 * título grande à esquerda como âncora, lista à direita dentro de painel branco (título + texto).
 */
export function DeliveriesSection({ categories }: DeliveriesSectionProps) {
  const [expandedByCategory, setExpandedByCategory] = useState<Record<string, boolean>>({})

  const toggleCategory = (id: string) => {
    setExpandedByCategory((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <section className="w-full min-w-0 font-sans" aria-labelledby="deliveries-heading">
      <h2 id="deliveries-heading" className="sr-only">
        Entregas por categoria
      </h2>
      {categories.map((category, index) => (
        <article
          key={category.id}
          className={`relative grid grid-cols-1 gap-10 overflow-visible rounded-report-lg bg-[rgba(241,241,241,0.5)] p-3 lg:grid-cols-[320px_1fr] ${
            index > 0 ? 'mt-6 md:mt-12' : ''
          }`}
        >
          <aside className="relative overflow-visible p-3 sm:p-6 lg:p-0">
            <div className="w-fit rounded-2xl px-4 py-3 lg:sticky lg:top-[96px]">
              <h3
                className="text-[24px] font-semibold leading-[130%] tracking-[-0.06em] text-[#3C3C3C] sm:text-3xl md:text-[40px] lg:text-[48px] lg:leading-[3rem] lg:tracking-[-1.44px]"
                style={fontSans}
              >
                {renderDeliveryCategoryTitle(category.name)}
              </h3>
            </div>
          </aside>

          <div className="min-w-0 px-0 pb-0 sm:px-3 sm:pb-3 lg:px-0 lg:pb-0">
            <div className="flex flex-col gap-5 rounded-2xl bg-report-card p-card shadow-report-soft">
              {category.deliveries.slice(0, 3).map((delivery, idx) => (
                <DeliveryItemBlock key={idx} delivery={delivery} />
              ))}

              {category.deliveries.length > 3 ? (
                <>
                  <div
                    className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
                      expandedByCategory[category.id] ? 'max-h-[1800px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="mt-1 flex flex-col gap-5 pt-1">
                      {category.deliveries.slice(3).map((delivery, idx) => (
                        <DeliveryItemBlock key={`extra-${idx}`} delivery={delivery} />
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className="group mt-1 inline-flex w-fit items-center gap-1 rounded-full px-0 py-1 text-sm font-medium text-[#6A6A70] transition-colors duration-200 hover:text-[#2F2F33] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E1E20]"
                    style={fontSans}
                    aria-expanded={Boolean(expandedByCategory[category.id])}
                  >
                    {expandedByCategory[category.id] ? (
                      'Ver menos ↑'
                    ) : (
                      <>
                        +{category.deliveries.length - 3} entregas
                        <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-0.5">
                          →
                        </span>
                      </>
                    )}
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}
