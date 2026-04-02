/** Foguete 3D com linha tracejada (estilo do print - Seção 6) */
export function RocketIllustration() {
  return (
    <div className="hidden sm:block w-20 h-20 lg:w-24 lg:h-24 shrink-0 text-report-accent" aria-hidden>
      <svg viewBox="0 0 80 80" className="w-full h-full">
        {/* Linha tracejada (trajetória) */}
        <path
          d="M40 70 L40 30"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="4 4"
          fill="none"
          opacity="0.6"
        />
        {/* Corpo do foguete (roxo) */}
        <path
          d="M40 15 L52 55 L40 65 L28 55 Z"
          fill="#a78bfa"
          stroke="#7c3aed"
          strokeWidth="1"
        />
        {/* Ponta */}
        <path d="M40 8 L44 15 L40 18 L36 15 Z" fill="#c4b5fd" stroke="#7c3aed" strokeWidth="0.5" />
        {/* Nozzle (azul) */}
        <ellipse cx="40" cy="62" rx="8" ry="4" fill="#38bdf8" stroke="#0ea5e9" strokeWidth="0.5" />
        {/* Janela */}
        <circle cx="40" cy="38" r="4" fill="white" opacity="0.9" />
      </svg>
    </div>
  )
}
