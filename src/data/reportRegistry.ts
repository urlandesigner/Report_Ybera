import type { ReportJson } from './report.types'
import report202602 from './reports/2026-02.json'
import report202603 from './reports/2026-03.json'

type ReportEntry = { year: string; month: string; data: ReportJson }

const ENTRIES: ReportEntry[] = [
  { year: '2026', month: '03', data: report202603 as ReportJson },
  { year: '2026', month: '02', data: report202602 as ReportJson },
]

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
