interface ReadingProgressBarProps {
  /** 0 a 1 */
  progress: number
  className?: string
}

/**
 * Barra de progresso de leitura (fluxo normal; abaixo do menu sticky, largura da viewport).
 * Preenchimento neutro suavizado (`rgba(0,0,0,0.85)`); transição suave no avanço.
 */
export function ReadingProgressBar({ progress, className }: ReadingProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, progress))

  return (
    <div
      className={`pointer-events-none relative left-0 w-screen max-w-none shrink-0 overflow-hidden bg-black/[0.06] h-[3px] sm:h-1 ${className ?? ''}`}
      role="progressbar"
      aria-valuenow={Math.round(clamped * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progresso de leitura da página"
    >
      <div
        className="h-full w-full origin-left bg-[rgba(0,0,0,0.85)] transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: `scaleX(${clamped})` }}
      />
    </div>
  )
}
