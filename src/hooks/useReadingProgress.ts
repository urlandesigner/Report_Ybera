import { useEffect, useMemo, useState } from 'react'

/** Linha de ativação (px do topo da viewport), abaixo do bloco sticky (links + barra de progresso). */
const ACTIVATION_OFFSET_PX = 76

/**
 * Progresso de scroll 0–1 e secção ativa (última cujo topo já passou da linha de ativação).
 * Um único requestAnimationFrame por “rajada” de eventos de scroll/resize.
 */
export function useReadingProgress(sectionIds: readonly string[]) {
  const [progress, setProgress] = useState(0)
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)

  const sectionIdsKey = useMemo(() => sectionIds.join('|'), [sectionIds])

  useEffect(() => {
    let rafId = 0
    let pending = false

    const read = () => {
      const root = document.documentElement
      const scrollTop = root.scrollTop
      const scrollable = root.scrollHeight - window.innerHeight
      const p = scrollable > 0 ? Math.min(1, Math.max(0, scrollTop / scrollable)) : 0
      setProgress(p)

      let active: string | null = null
      for (const id of sectionIds) {
        const node = document.getElementById(id)
        if (!node) continue
        if (node.getBoundingClientRect().top <= ACTIVATION_OFFSET_PX) {
          active = id
        }
      }
      setActiveSectionId(active)
    }

    const onScrollOrResize = () => {
      if (pending) return
      pending = true
      rafId = requestAnimationFrame(() => {
        pending = false
        read()
      })
    }

    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize, { passive: true })
    read()

    return () => {
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
      cancelAnimationFrame(rafId)
    }
  }, [sectionIdsKey, sectionIds])

  return { progress, activeSectionId }
}
