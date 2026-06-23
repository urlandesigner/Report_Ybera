import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ReadingProgressBar } from './ReadingProgressBar'
import AnimatedTabs from '../forgeui/animated-tabs'
import { cn } from '@/lib/utils'

export interface ReportTocItem {
  id: string
  label: string
}

interface ReportTableOfContentsProps {
  items: ReportTocItem[]
  activeSectionId?: string | null
  progress: number
  monthSelector?: ReactNode
  visible?: boolean
}

/**
 * Navegação in-page em menu flutuante (vidro Creator Fuel, largura ao conteúdo, 12px do topo).
 */
export function ReportTableOfContents({
  items,
  activeSectionId = null,
  progress,
  monthSelector,
  visible = true,
}: ReportTableOfContentsProps) {
  const [optimisticActiveTab, setOptimisticActiveTab] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const [scrollEdge, setScrollEdge] = useState<'none' | 'start' | 'middle' | 'end'>('none')

  useEffect(() => {
    const nav = navRef.current
    const scroller = nav?.firstElementChild as HTMLElement | null
    if (!scroller) return

    const update = () => {
      const max = scroller.scrollWidth - scroller.clientWidth
      if (max <= 1) return setScrollEdge('none')
      if (scroller.scrollLeft <= 1) return setScrollEdge('start')
      if (scroller.scrollLeft >= max - 1) return setScrollEdge('end')
      setScrollEdge('middle')
    }

    update()
    scroller.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(scroller)
    return () => {
      scroller.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [items])

  const fadeMask =
    scrollEdge === 'start'
      ? 'linear-gradient(to right, #000 calc(100% - 28px), transparent)'
      : scrollEdge === 'end'
        ? 'linear-gradient(to right, transparent, #000 28px)'
        : scrollEdge === 'middle'
          ? 'linear-gradient(to right, transparent, #000 28px, #000 calc(100% - 28px), transparent)'
          : undefined

  useEffect(() => {
    if (!optimisticActiveTab) return
    if (activeSectionId === optimisticActiveTab) {
      setOptimisticActiveTab(null)
      return
    }
    const t = window.setTimeout(() => setOptimisticActiveTab(null), 650)
    return () => window.clearTimeout(t)
  }, [activeSectionId, optimisticActiveTab])

  const activeTab = optimisticActiveTab ?? activeSectionId ?? items[0]?.id

  // Mantém o tab ativo visível: ao mudar de secção (via scroll da página),
  // desliza o menu horizontalmente para centralizar o tab correspondente.
  useEffect(() => {
    const scroller = navRef.current?.firstElementChild as HTMLElement | null
    if (!scroller) return
    const active = scroller.querySelector<HTMLElement>('[data-current="true"]')
    if (!active) return
    const target = active.offsetLeft - (scroller.clientWidth - active.offsetWidth) / 2
    const max = scroller.scrollWidth - scroller.clientWidth
    scroller.scrollTo({ left: Math.min(Math.max(0, target), max), behavior: 'smooth' })
  }, [activeTab])

  if (items.length === 0) return null

  return (
    <>
      {monthSelector ? (
        <div
          className={cn(
            'fixed right-3 top-3 z-30 flex transition-[opacity,transform] duration-300 ease-out sm:hidden',
            visible ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0',
          )}
          aria-hidden={!visible}
        >
          {monthSelector}
        </div>
      ) : null}

      <div
      className={cn(
        'pointer-events-none fixed inset-x-0 bottom-3 z-30 flex justify-center px-3 transition-[opacity,transform] duration-300 ease-out sm:bottom-auto sm:top-3',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0 sm:-translate-y-2',
      )}
      aria-hidden={!visible}
    >
      <div
        className={cn(
          'report-floating-nav-border w-full max-w-[calc(100vw-24px)] sm:w-fit',
          visible ? 'pointer-events-auto' : 'pointer-events-none',
        )}
      >
        <div
          className="report-floating-nav flex w-full flex-col overflow-hidden"
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
        >
        <div className="flex w-full min-w-0 flex-col items-stretch gap-2 p-1.5 sm:w-fit sm:flex-row sm:items-center sm:gap-2 sm:pr-2">
          <nav
            ref={navRef}
            className="min-w-0 overflow-hidden"
            style={fadeMask ? { maskImage: fadeMask, WebkitMaskImage: fadeMask } : undefined}
            aria-label="Secções desta página"
          >
            <AnimatedTabs
              activeTab={activeTab}
              tabs={items.map((item) => ({
                value: item.id,
                label: item.label,
                href: `#${item.id}`,
              }))}
              onTabChange={(value) => {
                setOptimisticActiveTab(value)
              }}
              className="mx-0 w-auto max-w-full justify-start gap-1 overflow-x-auto rounded-full bg-transparent p-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:overflow-visible [&::-webkit-scrollbar]:hidden"
              triggerClassName="h-8 shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold text-[#3c3d3e] hover:text-[#3c3d3e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E1E20] data-[current=true]:text-white"
            />
          </nav>
          {monthSelector ? (
            <>
              <div
                className="mx-1 hidden h-6 w-px shrink-0 bg-[#E6E8EC]/90 sm:block"
                aria-hidden
              />
              <div className="hidden shrink-0 sm:flex sm:justify-start">{monthSelector}</div>
            </>
          ) : null}
        </div>
        <ReadingProgressBar progress={progress} className="!h-[2px] !w-full !max-w-none !rounded-none" />
        </div>
      </div>
    </div>
    </>
  )
}
