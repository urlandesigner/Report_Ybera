/**
 * Separa o título vindo do JSON (ex.: "Nome (630 pontos) - Área") em headline + subtítulo,
 * sem alterar dados na origem — só para exibição na section Destaques.
 * Aceita "(NNN pontos)" colado à palavra anterior (ex.: "Saques(225 pontos)").
 */
export function splitHighlightTitle(raw: string): { headline: string; subtitle: string | null } {
  const t = raw.trim()
  if (!t) return { headline: '', subtitle: null }

  const m = t.match(/^(.*)(\s*\(\d+[^)]*\bpontos\b[^)]*\)\s*[\s\S]*)$/i)
  if (!m) return { headline: t, subtitle: null }

  const headline = m[1].trim()
  const subtitle = m[2].trim()
  if (!headline || !subtitle) return { headline: t, subtitle: null }
  return { headline, subtitle }
}
