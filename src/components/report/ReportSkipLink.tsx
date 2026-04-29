/**
 * Primeiro foco útil para teclado (comportamental; cores já usadas em cartões/botões).
 */
export function ReportSkipLink() {
  return (
    <a
      href="#resumo"
      className="pointer-events-none fixed left-4 top-4 z-[100] -translate-y-[120vh] rounded-lg bg-white px-4 py-3 text-sm font-medium text-[#3C3C3C] shadow-md outline-none ring-2 ring-[#1E1E20] ring-offset-2 transition-transform duration-200 focus:pointer-events-auto focus:translate-y-0 focus-visible:translate-y-0"
      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
    >
      Ir para o conteúdo principal
    </a>
  )
}
