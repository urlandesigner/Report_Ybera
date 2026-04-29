import { type ReactNode } from 'react'
import { ReportBackToTop } from './ReportBackToTop'
import { ReportSkipLink } from './ReportSkipLink'

interface ReportPageLayoutProps {
  children: ReactNode
}

export function ReportPageLayout({ children }: ReportPageLayoutProps) {
  return (
    <div className="min-h-screen min-w-0 overflow-x-clip bg-report-offWhite">
      {/* overflow-x-clip em vez de hidden: evita scroll horizontal sem o scrollport que quebra position:sticky nos filhos. */}
      {/* Manchas/blocos suaves de fundo (decorativo) */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden -z-10"
        aria-hidden
      >
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-report-pastel-blue/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-report-pastel-green/25 rounded-full blur-3xl" />
        <div className="absolute top-2/3 left-1/2 -translate-x-1/2 w-[28rem] h-64 bg-report-pastel-lavender/20 rounded-full blur-3xl" />
      </div>
      <main id="report-main" className="relative w-full">
        <ReportSkipLink />
        {children}
        <ReportBackToTop />
      </main>
    </div>
  )
}
