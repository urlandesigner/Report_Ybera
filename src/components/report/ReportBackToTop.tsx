import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

const SHOW_AFTER_PX = 450

/**
 * Comportamental: reduz esforço para regressar à capa após leitura longa (mesma paleta de CTAs escuros já usada no relatório).
 */
export function ReportBackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <a
      href="#report-hero"
      className="fixed bottom-6 left-4 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[#1E1E20] text-white shadow-lg opacity-90 transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      aria-label="Voltar ao início da página"
    >
      <ArrowUp className="h-5 w-5 shrink-0 stroke-[2]" aria-hidden />
    </a>
  )
}
