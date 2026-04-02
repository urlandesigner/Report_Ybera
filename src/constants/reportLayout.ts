/**
 * Coluna única do relatório (desktop e mobile): mesma largura máx., padding e ritmo vertical
 * em todas as secções (exceto hero, que partilha só o alinhamento horizontal).
 */
export const REPORT_MAX_WIDTH_CLASS = 'max-w-[1000px]'

/** Padding horizontal unificado (alinhado com a capa em lg). */
export const REPORT_PAD_X = 'px-4 sm:px-6 lg:px-8'

/** Padding vertical do bloco de conteúdo dentro de cada secção. */
export const REPORT_PAD_Y = 'py-8 sm:py-10'

/**
 * Margem entre o cabeçalho de secção (`ReportSectionTitle`) e o conteúdo seguinte.
 * Igual em todas as secções do relatório.
 */
export const REPORT_SECTION_TITLE_MARGIN_CLASS = 'mb-6 sm:mb-[60px]'

/**
 * Container interior padrão: use uma vez por secção, em volta de título + conteúdo.
 */
export const REPORT_SECTION_INNER_CLASS = [
  'mx-auto w-full min-w-0',
  REPORT_MAX_WIDTH_CLASS,
  REPORT_PAD_X,
  REPORT_PAD_Y,
].join(' ')
