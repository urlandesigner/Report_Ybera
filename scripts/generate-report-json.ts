import { existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type {
  ReportJson,
  ExecutiveSummaryItem,
  DeliveryCategoryJson,
  DeliveryItemJson,
  DeliveryNoteJson,
  ProductDesignItem,
} from '../src/data/report.types.ts'

const root = process.cwd()
const contentDir = join(root, 'content')
const inputPath = join(contentDir, 'report-input.md')
const outputDir = join(root, 'src', 'data')
const outputPath = join(outputDir, 'report.json')

type TitleDescriptionItem = ExecutiveSummaryItem

function normalizeNewlines(s: string): string {
  return s.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Bloco entre `## {sectionTitle}` e o próximo `## ...` (trim em cada linha para \r, espaços finais, etc.) */
function extractSectionBody(lines: string[], sectionTitle: string): string[] {
  const re = new RegExp(`^##\\s+${escapeRegex(sectionTitle)}\\s*$`, 'i')
  let i = 0
  while (i < lines.length) {
    const trimmed = lines[i].trim()
    if (re.test(trimmed)) {
      i += 1
      const body: string[] = []
      while (i < lines.length) {
        const t = lines[i].trim()
        if (t.startsWith('##') && /^##\s+/.test(t)) break
        body.push(lines[i])
        i += 1
      }
      return body
    }
    i += 1
  }
  return []
}

/** Primeira linha `# Título` */
function extractMainTitle(lines: string[]): string {
  for (const line of lines) {
    const m = line.match(/^#\s+(.+?)\s*$/)
    if (m) return m[1].trim()
  }
  return ''
}

/**
 * Primeiro `##` logo após o `#` (ignorando linhas vazias).
 * Se for "Resumo Executivo", não há linha de mês — retorna string vazia.
 */
function extractMonthAfterTitle(lines: string[]): string {
  let i = 0
  while (i < lines.length && !/^#\s+/.test(lines[i])) i++
  if (i >= lines.length) return ''
  i++
  while (i < lines.length && lines[i].trim() === '') i++
  if (i >= lines.length) return ''
  const m = lines[i].match(/^##\s+(.+?)\s*$/)
  if (!m) return ''
  const heading = m[1].trim()
  if (heading.toLowerCase() === 'resumo executivo') return ''
  return heading
}

/**
 * Linhas `key: valor` após o primeiro `##` (mês) e antes do próximo `##`.
 * Chaves: metaTag, heroFooterLine1, heroFooterLine2 (valor = tudo após o primeiro `:`).
 */
function extractHeroFrontMatter(lines: string[]): {
  metaTag: string
  heroFooterLine1: string
  heroFooterLine2: string
} {
  const empty = { metaTag: '', heroFooterLine1: '', heroFooterLine2: '' }
  let i = 0
  while (i < lines.length && !/^#\s+/.test(lines[i])) i++
  if (i >= lines.length) return empty
  i++
  while (i < lines.length && lines[i].trim() === '') i++
  if (i >= lines.length) return empty
  if (!/^##\s+/.test(lines[i].trim())) return empty
  i++
  const out = { ...empty }
  while (i < lines.length) {
    const t = lines[i].trim()
    if (t.startsWith('##') && /^##\s+/.test(t)) break
    if (t) {
      const colon = t.indexOf(':')
      if (colon > 0) {
        const key = t.slice(0, colon).trim()
        const val = t.slice(colon + 1).trim()
        if (key === 'metaTag') out.metaTag = val
        else if (key === 'heroFooterLine1') out.heroFooterLine1 = val
        else if (key === 'heroFooterLine2') out.heroFooterLine2 = val
      }
    }
    i++
  }
  return out
}

/** Bullets `- título: descrição` */
function parseTitleDescriptionBullets(bodyLines: string[]): TitleDescriptionItem[] {
  const items: TitleDescriptionItem[] = []
  for (const raw of bodyLines) {
    const line = raw.trim()
    if (!line.startsWith('-')) continue
    const content = line.replace(/^-\s+/, '').trim()
    if (!content) continue
    const colon = content.indexOf(':')
    if (colon === -1) {
      items.push({ title: content, description: '' })
      continue
    }
    items.push({
      title: content.slice(0, colon).trim(),
      description: content.slice(colon + 1).trim(),
    })
  }
  return items
}

/**
 * `## Produto & Design`: bullets `- título: descrição` ou
 * `- Título | image: /assets/foo.png: descrição`
 */
function parseProductDesignBullets(bodyLines: string[]): ProductDesignItem[] {
  const items: ProductDesignItem[] = []
  const withImage = /^(.+?)\s*\|\s*image:\s*(\S+)\s*:\s*(.*)$/i

  for (const raw of bodyLines) {
    const line = raw.trim()
    if (!line.startsWith('-')) continue
    const content = line.replace(/^-\s+/, '').trim()
    if (!content) continue

    const m = content.match(withImage)
    if (m) {
      const title = m[1].trim()
      const image = m[2].trim()
      const description = m[3].trim()
      if (title) {
        const row: ProductDesignItem = { title, description }
        if (image) row.image = image
        items.push(row)
      }
      continue
    }

    const colon = content.indexOf(':')
    if (colon === -1) {
      items.push({ title: content, description: '' })
      continue
    }
    items.push({
      title: content.slice(0, colon).trim(),
      description: content.slice(colon + 1).trim(),
    })
  }
  return items
}

/**
 * Mede indentação visual antes do `-` (espaço, NBSP, narrow space; tab = 2).
 * Usado para distinguir item principal (início de linha) de subitem (indentado).
 */
function leadingWhitespaceLength(s: string): number {
  let n = 0
  for (const ch of s) {
    if (ch === '\t') n += 2
    else if (
      ch === ' ' ||
      ch === '\u00A0' ||
      ch === '\u2007' ||
      ch === '\u202F' ||
      ch === '\uFEFF'
    )
      n += 1
    else break
  }
  return n
}

function parseDeliveryLineContent(content: string): { title: string; description: string } {
  const colon = content.indexOf(':')
  if (colon === -1) return { title: content.trim(), description: '' }
  return {
    title: content.slice(0, colon).trim(),
    description: content.slice(colon + 1).trim(),
  }
}

function noteFromContent(content: string): DeliveryNoteJson {
  const colon = content.indexOf(':')
  if (colon === -1) return { label: '', text: content.trim() }
  return {
    label: content.slice(0, colon).trim(),
    text: content.slice(colon + 1).trim(),
  }
}

/**
 * `## Entregas Principais`: `### Categoria` + `- título: descrição` e, opcionalmente,
 * linhas `  - rótulo: texto` indentadas (2+ espaços / tab; NBSP contado como espaço)
 * como `notes` da última entrega.
 */
function parseEntregasPrincipais(bodyLines: string[]): DeliveryCategoryJson[] {
  const categories: DeliveryCategoryJson[] = []
  let currentCategory: string | null = null
  let currentItems: DeliveryItemJson[] = []

  const flush = () => {
    if (currentCategory !== null && currentItems.length > 0) {
      categories.push({ category: currentCategory, items: [...currentItems] })
    }
    currentItems = []
  }

  for (const raw of bodyLines) {
    const trimmed = raw.trim()
    if (!trimmed) continue

    const h3 = trimmed.match(/^###\s+(.+?)\s*$/)
    if (h3) {
      flush()
      currentCategory = h3[1].trim()
      continue
    }

    if (currentCategory === null) continue

    const bullet = raw.match(/^(\s*)-\s+(.*)$/)
    if (!bullet) continue

    const indent = leadingWhitespaceLength(bullet[1] ?? '')
    const rest = (bullet[2] ?? '').trim()
    if (!rest) continue

    if (indent < 2) {
      const { title, description } = parseDeliveryLineContent(rest)
      const row: DeliveryItemJson = { title, description }
      currentItems.push(row)
      continue
    }

    const last = currentItems[currentItems.length - 1]
    if (!last) continue

    const note = noteFromContent(rest)
    const notes = last.notes ?? []
    notes.push(note)
    last.notes = notes
  }

  flush()

  return categories
}

/**
 * Monta o objeto final com todas as chaves sempre definidas (string vazia / []).
 * Assim `JSON.stringify` nunca omite propriedades por `undefined` e o formato fica estável.
 */
function buildReportJson(content: string): ReportJson {
  const lines = normalizeNewlines(content).split('\n')
  const title = extractMainTitle(lines)
  const month = extractMonthAfterTitle(lines)
  const { metaTag, heroFooterLine1, heroFooterLine2 } = extractHeroFrontMatter(lines)
  const executiveSummary = parseTitleDescriptionBullets(extractSectionBody(lines, 'Resumo Executivo'))
  const highlights = parseTitleDescriptionBullets(extractSectionBody(lines, 'Destaques'))
  const deliveries = parseEntregasPrincipais(extractSectionBody(lines, 'Entregas Principais'))
  const architecture = parseTitleDescriptionBullets(extractSectionBody(lines, 'Arquitetura'))
  const productDesign = parseProductDesignBullets(extractSectionBody(lines, 'Produto & Design'))
  const nextSteps = parseTitleDescriptionBullets(extractSectionBody(lines, 'Próximos Passos'))

  return {
    title: title ?? '',
    month: month ?? '',
    metaTag: metaTag ?? '',
    heroFooterLine1: heroFooterLine1 ?? '',
    heroFooterLine2: heroFooterLine2 ?? '',
    executiveSummary: executiveSummary ?? [],
    highlights: highlights ?? [],
    deliveries: deliveries ?? [],
    architecture: architecture ?? [],
    productDesign: productDesign ?? [],
    nextSteps: nextSteps ?? [],
  }
}

/**
 * Serializa com `JSON.stringify` e valida com `JSON.parse` antes de gravar.
 * Garante arquivo sempre parseável (evita erros de vírgula / concatenação manual).
 */
function writeValidatedJson(filePath: string, data: ReportJson): void {
  const text = `${JSON.stringify(data, null, 2)}\n`
  try {
    JSON.parse(text)
  } catch (e) {
    throw new Error(`JSON gerado é inválido (não passou em JSON.parse): ${String(e)}`)
  }
  // Gravação atômica: evita `report.json` pela metade e reduz “conflito” com o editor ao recarregar.
  const tmp = `${filePath}.${process.pid}.tmp`
  try {
    writeFileSync(tmp, text, 'utf-8')
    renameSync(tmp, filePath)
  } catch (e) {
    try {
      unlinkSync(tmp)
    } catch {
      /* ignore */
    }
    throw e
  }
}

if (!existsSync(inputPath)) {
  console.error(`Arquivo não encontrado: ${inputPath}`)
  console.error('Crie content/report-input.md com o texto vindo do Google Docs.')
  process.exit(1)
}

const md = readFileSync(inputPath, 'utf-8')
const payload = buildReportJson(md)

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true })
}

writeValidatedJson(outputPath, payload)
console.log(`OK → ${outputPath}`)
console.log(`  title: ${payload.title || '(vazio)'}`)
console.log(`  month: ${payload.month || '(vazio)'}`)
console.log(
  `  capa: metaTag="${payload.metaTag || '(vazio)'}" | footer L1/L2: ${payload.heroFooterLine1 ? 'ok' : '—'} / ${payload.heroFooterLine2 ? 'ok' : '—'}`
)
console.log(`  executiveSummary: ${payload.executiveSummary.length} card(s)`)
console.log(`  highlights: ${payload.highlights.length} card(s)`)
const deliveryItems = payload.deliveries.reduce((n, c) => n + c.items.length, 0)
console.log(`  deliveries: ${payload.deliveries.length} categor(ies), ${deliveryItems} item(s)`)
console.log(`  architecture: ${payload.architecture.length} card(s)`)
console.log(`  productDesign: ${payload.productDesign.length} card(s)`)
console.log(`  nextSteps: ${payload.nextSteps.length} item(s)`)
