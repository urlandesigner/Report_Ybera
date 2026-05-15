import { useEffect, useState, type ReactNode } from 'react'
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
  if (items.length === 0) return null
  const [optimisticActiveTab, setOptimisticActiveTab] = useState<string | null>(null)

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

  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-x-0 top-3 z-30 flex justify-center px-3 transition-[opacity,transform] duration-300 ease-out',
        visible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
      )}
      aria-hidden={!visible}
    >
      <div
        className={cn(
          'report-floating-nav-border w-fit max-w-[calc(100vw-24px)]',
          visible ? 'pointer-events-auto' : 'pointer-events-none',
        )}
      >
        <div
          className="report-floating-nav flex w-full flex-col overflow-hidden"
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
        >
        <div className="flex w-fit min-w-0 flex-col items-stretch gap-2 p-1.5 sm:flex-row sm:items-center sm:gap-2 sm:pr-2">
          <nav className="min-w-0 w-fit" aria-label="Secções desta página">
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
              triggerClassName="h-8 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold text-[#3c3d3e] hover:text-[#3c3d3e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E1E20] data-[current=true]:text-white"
            />
          </nav>
          {monthSelector ? (
            <>
              <div
                className="mx-1 hidden h-6 w-px shrink-0 bg-[#E6E8EC]/90 sm:block"
                aria-hidden
              />
              <div className="flex shrink-0 justify-center sm:justify-start">{monthSelector}</div>
            </>
          ) : null}
        </div>
        <ReadingProgressBar progress={progress} className="!h-[2px] !w-full !max-w-none !rounded-none" />
        </div>
      </div>
    </div>
  )
}
