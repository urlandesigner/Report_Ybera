import { useEffect } from 'react'

/**
 * Atualiza o hash com `history.replaceState` conforme a secção ativa (sem recarregar).
 * Opcionalmente desativado até o primeiro layout (evita limpar # ao abrir com deep link).
 */
export function useSectionHashSync(
  activeSectionId: string | null,
  options?: { enabled?: boolean }
) {
  const enabled = options?.enabled ?? true

  useEffect(() => {
    if (!enabled) return

    const base = `${window.location.pathname}${window.location.search}`

    if (activeSectionId) {
      const nextHash = `#${activeSectionId}`
      if (window.location.hash !== nextHash) {
        window.history.replaceState(null, '', `${base}${nextHash}`)
      }
      return
    }

    if (window.location.hash) {
      window.history.replaceState(null, '', base)
    }
  }, [activeSectionId, enabled])
}
