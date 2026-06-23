import type { ReportJson } from './report.types'

type ReportEntry = { year: string; month: string; data: ReportJson }
type PeriodValue = `${string}-${string}`

// Mantemos JSONs legados no repositório, mas só expomos os meses que já têm Markdown inputado no fluxo atual.
const PUBLISHED_REPORT_PERIODS: PeriodValue[] = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06']

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

function periodKey(year: string, month: string): PeriodValue {
  return `${year}-${month.padStart(2, '0')}`
}

const PUBLISHED_ENTRIES: ReportEntry[] = ENTRIES.filter((entry) =>
  PUBLISHED_REPORT_PERIODS.includes(periodKey(entry.year, entry.month))
)

const SORTED: ReportEntry[] = [...PUBLISHED_ENTRIES].sort(sortDesc)

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
  const found = PUBLISHED_ENTRIES.find((e) => e.year === year && e.month === m)
  return found ? found.data : null
}

export function periodValue(year: string, month: string): string {
  return `${year}-${month.padStart(2, '0')}`
}
