import { clsx } from 'clsx'
import { type CSSProperties, type ReactNode } from 'react'

/**
 * Mesmo padrão da secção 01 (Resumo Executivo): `card-hover-tinted` em index.css + lift + transição.
 * Reutilizar em todos os cards do relatório, exceto Entregas Principais.
 */
export const CARD_HOVER_ARTICLE_CLASSES =
  'card-hover-tinted transition duration-300 ease-out hover:-translate-y-2'

export function cardHoverShadowStyle(backgroundHex: string): CSSProperties {
  return {
    ['--card-hover-shadow' as string]: `0 25px 50px -12px ${backgroundHex}99`,
  }
}

export type CardVariant =
  | 'default'
  | 'soft'
  | 'pastel-green'
  | 'pastel-blue'
  | 'pastel-orange'
  | 'pastel-yellow'
  | 'pastel-lavender'

interface CardProps {
  variant?: CardVariant
  /** Número no canto superior esquerdo (ex: "01") - cor teal */
  number?: string
  /** Tag no canto inferior direito - fundo teal, texto branco */
  tag?: string
  icon?: ReactNode
  /** Classe do wrapper do ícone (ex: text-report-muted para ícone outline cinza) */
  iconClassName?: string
  title: string
  children: ReactNode
  className?: string
  /** Cor de fundo customizada (ex: "#F0F5FF") — sobrescreve o variant */
  backgroundColor?: string
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-report-card',
  soft: 'bg-report-offWhite',
  'pastel-green': 'bg-report-pastel-green',
  'pastel-blue': 'bg-report-pastel-blue',
  'pastel-orange': 'bg-report-pastel-orange',
  'pastel-yellow': 'bg-report-pastel-yellow',
  'pastel-lavender': 'bg-report-pastel-lavender',
}

/** Cor de fundo por variant (para sombra no hover) */
const variantShadowColors: Record<CardVariant, string> = {
  default: '#ffffff',
  soft: '#f8fafc',
  'pastel-green': '#dcfce7',
  'pastel-blue': '#dbeafe',
  'pastel-orange': '#ffedd5',
  'pastel-yellow': '#fef9c3',
  'pastel-lavender': '#ede9fe',
}

export function Card({
  variant = 'default',
  number,
  tag,
  icon,
  iconClassName,
  title,
  children,
  className,
  backgroundColor,
}: CardProps) {
  const shadowColor = backgroundColor ?? variantShadowColors[variant]
  const hoverShadow = `0 25px 50px -12px ${shadowColor}99`
  return (
    <article
      className={clsx(
        CARD_HOVER_ARTICLE_CLASSES,
        'flex flex-col items-start gap-[1.25rem] rounded-report-lg relative flex-[1_0_0]',
        !backgroundColor && variantStyles[variant],
        className
      )}
      style={{
        padding: 24,
        ...(backgroundColor ? { backgroundColor } : {}),
        ['--card-hover-shadow' as string]: hoverShadow,
      }}
    >
      {number && (
        <span className="text-report-accent font-bold text-sm" aria-hidden>
          {number}
        </span>
      )}
      {icon && (
        <div
          className={clsx(
            'mt-1 hidden w-11 h-11 shrink-0 items-center justify-center rounded-full p-3 sm:flex [&_svg]:w-6 [&_svg]:h-6',
            iconClassName ?? 'text-report-accent'
          )}
          style={{ background: 'rgba(255, 255, 255, 0.35)' }}
          aria-hidden
        >
          {icon}
        </div>
      )}
      <h3
        className={clsx(
          'text-[18px] font-bold leading-[120%] sm:text-2xl',
          (number || icon) && 'mt-2'
        )}
        style={{ color: '#3C3C3C', fontFamily: '"Plus Jakarta Sans", sans-serif' }}
      >
        {title}
      </h3>
      <div
        className="mt-1 text-base font-normal leading-normal text-neutral-600"
        style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
      >
        {children}
      </div>
      {tag && (
        <span className="absolute bottom-4 right-4 inline-flex rounded-lg bg-report-accent px-2.5 py-1 text-xs font-medium text-white">
          {tag}
        </span>
      )}
    </article>
  )
}
