import type { ReportJson } from './report.types'

type ReportEntry = { year: string; month: string; data: ReportJson }

const reportModules = import.meta.glob<ReportJson>('./reports/*.json', {
  eager: true,
  import: 'default',
})

const ENTRIES: ReportEntry[] = Object.entries(reportModules).flatMap(([path, data]) => {
  const match = path.match(/\/(\d{4})-(\d{2})\.json$/)
  if (!match) return []
  return [{ year: match[1], month: match[2], data }]
})

function sortDesc(a: ReportEntry, b: ReportEntry): number {
  if (a.year !== b.year) return b.year.localeCompare(a.year)
  return b.month.localeCompare(a.month)
}

const SORTED: ReportEntry[] = [...ENTRIES].sort(sortDesc)

export interface ReportPeriodMeta {
  year: string
  /** Dois dígitos (ex.: "03") */
  month: string
  /** Rótulo para UI (ex.: "Março 2026") */
  label: string
}

export function listReportPeriods(): ReportPeriodMeta[] {
  return SORTED.map(({ year, month, data }) => ({
    year,
    month,
    label: data.month?.trim() || `${month}/${year}`,
  }))
}

export function getLatestReport(): ReportEntry {
  return SORTED[0]
}

export function getReportByPeriod(year: string, month: string): ReportJson | null {
  const m = month.padStart(2, '0')
  const found = ENTRIES.find((e) => e.year === year && e.month === m)
  return found ? found.data : null
}

export function periodValue(year: string, month: string): string {
  return `${year}-${month.padStart(2, '0')}`
}
