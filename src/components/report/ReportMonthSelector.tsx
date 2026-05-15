import { Calendar, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { periodValue, type ReportPeriodMeta } from '../../data/reportRegistry'
import { cn } from '@/lib/utils'

interface ReportMonthSelectorProps {
  options: ReportPeriodMeta[]
  /** Valor atual `YYYY-MM` */
  value: string
  onChange: (year: string, month: string) => void
}

/**
 * Seletor de período na barra de navegação sticky (dropdown Origin UI / Radix).
 */
export function ReportMonthSelector({ options, value, onChange }: ReportMonthSelectorProps) {
  if (options.length === 0) return null

  const selectedLabel =
    options.find((o) => periodValue(o.year, o.month) === value)?.label ?? 'Mês do relatório'

  return (
    <div
      className="relative w-fit max-w-full"
      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              'hero-premium-badge w-fit max-w-full cursor-pointer outline-none',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E1E20]',
            )}
            aria-label="Selecionar mês do relatório"
          >
            <span className="hero-premium-badge__fill gap-1.5 whitespace-nowrap px-2.5 py-1.5 text-sm">
              <Calendar className="size-4 shrink-0 opacity-70" aria-hidden />
              <span>{selectedLabel}</span>
              <ChevronDown className="size-3.5 shrink-0 opacity-70" aria-hidden />
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="min-w-[var(--radix-dropdown-menu-trigger-width)] border-[#E6E8EC] bg-white p-1 text-[#3C3C3C] shadow-report-md"
        >
          <DropdownMenuRadioGroup
            value={value}
            onValueChange={(next) => {
              const [y, m] = next.split('-')
              if (y && m) onChange(y, m)
            }}
          >
            {options.map((o) => {
              const optionValue = periodValue(o.year, o.month)
              return (
                <DropdownMenuRadioItem
                  key={optionValue}
                  value={optionValue}
                  className="cursor-pointer rounded-md py-2 pl-8 pr-2 text-sm font-medium text-[#505052] focus:bg-[#F8F8F8] focus:text-[#3C3C3C] data-[state=checked]:text-[#3C3C3C]"
                >
                  {o.label}
                </DropdownMenuRadioItem>
              )
            })}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
