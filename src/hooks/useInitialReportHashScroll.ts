import { useLayoutEffect, useState } from 'react'
import { REPORT_HASH_LEGACY, resolveReportHashToSectionId } from '../constants/reportSectionAnchors'

interface Options {
  /** Secção `destaques` existe no DOM */
  hasDestaquesSection: boolean
  /** Rota do relatório (ex.: `/report/2026/03`) — reexecuta ao trocar de mês */
  pathname: string
}

/**
 * Deep link: normaliza hash legado, `replaceState` para slug curto e posiciona a secção
 * (scroll-margin das secções trata do offset do header/TOC).
 */
export function useInitialReportHashScroll({ hasDestaquesSection, pathname }: Options) {
  const [ready, setReady] = useState(false)

  useLayoutEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    setReady(false)

    const raw = window.location.hash.slice(1)
    const resolved = resolveReportHashToSectionId(raw)

    if (!resolved) {
      setReady(true)
      return
    }

    if (resolved === 'destaques' && !hasDestaquesSection) {
      const base = `${window.location.pathname}${window.location.search}`
      window.history.replaceState(null, '', base)
      setReady(true)
      return
    }

    const el = document.getElementById(resolved)
    if (!el) {
      setReady(true)
      return
    }

    const normalized = `#${resolved}`
    const base = `${window.location.pathname}${window.location.search}`
    if (window.location.hash !== normalized || (raw && REPORT_HASH_LEGACY[raw])) {
      window.history.replaceState(null, '', `${base}${normalized}`)
    }

    el.scrollIntoView({ behavior: 'auto', block: 'start' })
    window.dispatchEvent(new Event('scroll'))

    setReady(true)
  }, [hasDestaquesSection, pathname])

  return { hashSyncEnabled: ready }
}
