/**
 * IDs estáveis das secções (atributo `id` + hash na URL).
 * Forma curta para partilha e deep linking.
 */
export const REPORT_ANCHOR = {
  resumo: 'resumo',
  destaques: 'destaques',
  entregas: 'entregas',
  produto: 'produto',
  arquitetura: 'arquitetura',
  proximosPassos: 'proximos-passos',
} as const

/** Hashes antigos (#section-*) → slug atual (compatibilidade com links antigos). */
export const REPORT_HASH_LEGACY: Record<string, string> = {
  'section-resumo-executivo': REPORT_ANCHOR.resumo,
  'section-destaques': REPORT_ANCHOR.destaques,
  'section-entregas': REPORT_ANCHOR.entregas,
  'section-produto-design': REPORT_ANCHOR.produto,
  'section-arquitetura': REPORT_ANCHOR.arquitetura,
  'section-proximos-passos': REPORT_ANCHOR.proximosPassos,
}

export function resolveReportHashToSectionId(rawHash: string): string {
  const trimmed = rawHash.replace(/^#/, '').trim()
  if (!trimmed) return ''
  return REPORT_HASH_LEGACY[trimmed] ?? trimmed
}
