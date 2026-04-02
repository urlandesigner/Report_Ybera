import { type ReactNode } from 'react'

interface SectionHeaderProps {
  /** Número no badge (ex: "01") - fundo teal, texto branco */
  badge: string
  title: string
  description?: string
  /** Ícone em teal à direita do bloco título/descrição */
  icon?: ReactNode
}

export function SectionHeader({ badge, title, description, icon }: SectionHeaderProps) {
  return (
    <header className="mb-8 sm:mb-10 flex flex-wrap items-start justify-between gap-4">
      <div>
        <span className="inline-flex items-center rounded-lg bg-report-accent px-3 py-1.5 text-sm font-bold text-white">
          {badge}
        </span>
        <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-report-dark tracking-tight leading-tight">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-report-muted text-base sm:text-lg max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {icon && (
        <span className="hidden text-report-accent sm:inline-flex [&_svg]:w-8 [&_svg]:h-8 shrink-0" aria-hidden>
          {icon}
        </span>
      )}
    </header>
  )
}
