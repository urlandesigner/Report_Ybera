import { useEffect, useState, type ReactNode } from 'react'
import { ReadingProgressBar } from './ReadingProgressBar'
import AnimatedTabs from '../forgeui/animated-tabs'

export interface ReportTocItem {
  id: string
  label: string
}

interface ReportTableOfContentsProps {
  items: ReportTocItem[]
  /** Secção cujo topo já passou da linha de ativação (viewport). */
  activeSectionId?: string | null
  /** Progresso de leitura 0–1 (barra logo abaixo dos links, mesmo bloco sticky). */
  progress: number
  /** Seletor de período (ex.: mês do relatório), à direita da navegação in-page. */
  monthSelector?: ReactNode
}

/**
 * Navegação in-page (estrutural): reduz fricção e rolagem exploratória sem mudar tipografia/cores dos blocos de conteúdo.
 */
export function ReportTableOfContents({
  items,
  activeSectionId = null,
  progress,
  monthSelector,
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
    <div className="sticky top-0 z-30 border-b border-[#E6E8EC]/80 bg-report-offWhite/95 backdrop-blur-sm">
      <div className="mx-auto w-full min-w-0 max-w-[1200px] px-0">
        <div className="flex w-full min-w-0 flex-col gap-2 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-0">
          <nav className="min-w-0 flex-1" aria-label="Secções desta página" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
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
              className="mx-0 min-h-[54px] w-full justify-start gap-3 overflow-x-auto rounded-none bg-transparent p-0 [-ms-overflow-style:none] [scrollbar-width:none] sm:min-h-[58px] sm:flex-wrap sm:gap-4 sm:overflow-visible sm:py-2 [&::-webkit-scrollbar]:hidden"
              triggerClassName="h-auto whitespace-nowrap rounded-full px-4 py-2 text-[16px] font-normal text-[#505052] hover:text-[#3C3C3C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E1E20] data-[current=true]:font-medium data-[current=true]:text-white"
            />
          </nav>
          {monthSelector ? (
            <div className="flex w-full shrink-0 items-stretch justify-stretch sm:w-auto sm:items-center sm:justify-end sm:self-center sm:py-2">
              {monthSelector}
            </div>
          ) : null}
        </div>
      </div>
      <ReadingProgressBar progress={progress} />
    </div>
  )
}
