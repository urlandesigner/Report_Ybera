import clsx from 'clsx'
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
      <h4 className="text-[18px] font-semibold leading-7 text-[#3C3C3C]" style={fontSans}>
        {delivery.title}
      </h4>
      {delivery.bullets.length > 0 ? (
        <div
          className="space-y-2 text-base font-light leading-[22.75px] text-[#505052]"
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
          className={clsx(
            'list-disc list-outside space-y-2 pl-5 text-base font-light leading-[22.75px] text-[#505052] marker:text-[#505052]',
            delivery.bullets.length > 0 && 'mt-2'
          )}
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
  return (
    <div className="flex w-full min-w-0 flex-col font-sans" aria-labelledby="deliveries-heading">
      <h2 id="deliveries-heading" className="sr-only">
        Entregas por categoria
      </h2>
      {categories.map((category, index) => (
        <article
          key={category.id}
          className={clsx(
            'flex w-full min-w-0 flex-col gap-6 rounded-report-lg bg-[rgba(241,241,241,0.5)] p-3 lg:flex-row lg:items-stretch lg:gap-20',
            index > 0 && 'mt-6 md:mt-12'
          )}
        >
          {/* Coluna esquerda: flex col + min-h-0 no desktop para o sticky limitar-se ao article; wrapper interno com sticky + self-start */}
          <div className="min-w-0 shrink-0 p-3 sm:p-6 lg:flex lg:min-h-0 lg:max-w-sm lg:basis-[min(100%,303px)] lg:flex-col">
            <div className="w-full max-w-full lg:sticky lg:top-[32px] lg:z-[1] lg:self-start">
              <h3
                className="text-[24px] font-semibold leading-[130%] tracking-[-0.06em] text-[#3C3C3C] sm:text-3xl md:text-[40px] lg:text-[48px] lg:leading-[3rem] lg:tracking-[-1.44px]"
                style={fontSans}
              >
                {renderDeliveryCategoryTitle(category.name)}
              </h3>
            </div>
          </div>

          {/* Coluna direita: entregas em painel branco */}
          <div className="min-w-0 flex-1 px-0 pb-0 sm:px-3 sm:pb-3 lg:px-0 lg:pb-0">
            <div className="flex flex-col gap-6 rounded-2xl bg-report-card p-card shadow-report-soft">
              {category.deliveries.map((delivery, idx) => (
                <DeliveryItemBlock key={idx} delivery={delivery} />
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
