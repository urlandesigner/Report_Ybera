import type { SatisfactionSurveyData } from './types'

/** Chave default usada no Report Ybera; em outro projeto passe a tua própria `storageKey`. */
export const DEFAULT_STORAGE_KEY = 'report-ybera-satisfaction-surveys'

export function saveSurveyToLocalStorage(data: SatisfactionSurveyData, storageKey: string): void {
  try {
    const raw = localStorage.getItem(storageKey)
    const list: SatisfactionSurveyData[] = raw ? JSON.parse(raw) : []
    list.push(data)
    localStorage.setItem(storageKey, JSON.stringify(list))
  } catch (e) {
    console.error('[satisfaction-survey] Erro ao salvar no localStorage:', e)
  }
}

export function getSurveyResponses(storageKey: string): SatisfactionSurveyData[] {
  try {
    const raw = localStorage.getItem(storageKey)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export async function sendSurveyToApi(data: SatisfactionSurveyData, url: string): Promise<void> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`API respondeu com ${res.status}`)
}

export interface RegisterSurveyOptions {
  storageKey: string
  /** Se definido, envia POST para esta URL depois de gravar no localStorage. */
  apiUrl?: string | null
}

/**
 * Grava no localStorage e, opcionalmente, envia para API (fire-and-forget).
 */
export function registerSurveyResponse(data: SatisfactionSurveyData, options: RegisterSurveyOptions): void {
  saveSurveyToLocalStorage(data, options.storageKey)
  const url = options.apiUrl?.trim()
  if (url) {
    sendSurveyToApi(data, url).catch((e) =>
      console.error('[satisfaction-survey] Falha ao enviar para API:', e)
    )
  }
}

/**
 * Retorna um handler pronto para `onSubmit` do popup (útil para passar `apiUrl` do Vite/env).
 */
export function createSurveySubmitHandler(options: RegisterSurveyOptions) {
  return (data: SatisfactionSurveyData) => {
    registerSurveyResponse(data, options)
  }
}
