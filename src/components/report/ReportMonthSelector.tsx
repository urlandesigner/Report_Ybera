import type { ReportPeriodMeta } from '../../data/reportRegistry'

interface ReportMonthSelectorProps {
  options: ReportPeriodMeta[]
  /** Valor atual `YYYY-MM` */
  value: string
  onChange: (year: string, month: string) => void
}

/**
 * Controlo nativo de período na barra de navegação sticky (tom neutro, alinhado aos links).
 */
export function ReportMonthSelector({ options, value, onChange }: ReportMonthSelectorProps) {
  if (options.length === 0) return null

  return (
    <div className="relative w-full min-w-0 sm:w-auto sm:max-w-[min(100%,14rem)]">
      <label className="sr-only" htmlFor="report-month-select">
        Mês do relatório
      </label>
      <select
        id="report-month-select"
        className="w-full cursor-pointer rounded-md border border-[#E6E8EC] bg-white px-2.5 py-2 text-left text-sm font-medium text-[#505052] shadow-none outline-none transition-colors hover:border-[#D1D5DB] hover:bg-[#FAFAFA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E1E20] sm:min-w-[11rem]"
        style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
        aria-label="Selecionar mês do relatório"
        value={value}
        onChange={(e) => {
          const v = e.target.value
          const [y, m] = v.split('-')
          if (y && m) onChange(y, m)
        }}
      >
        {options.map((o) => (
          <option key={`${o.year}-${o.month}`} value={`${o.year}-${o.month}`}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
