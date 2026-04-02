/** Estrutura gerada por `npm run generate-report` a partir de `content/report-input.md`. */
export interface ExecutiveSummaryItem {
  title: string
  description: string
}

export interface ProductDesignItem {
  title: string
  description: string
  /** Hero / card: URL pública, ex. `/assets/kaizen.png` — markdown: `| image: /caminho:` */
  image?: string
}

/** Subitem indentado sob uma entrega em `## Entregas Principais` (`  - rótulo: texto`). */
export interface DeliveryNoteJson {
  label: string
  text: string
}

export interface DeliveryItemJson {
  title: string
  description: string
  /** Opcional: bullets com indentação (2+ espaços) abaixo do item principal. */
  notes?: DeliveryNoteJson[]
}

/** Categoria em `## Entregas Principais` (`###` + bullets). */
export interface DeliveryCategoryJson {
  category: string
  items: DeliveryItemJson[]
}

export interface ArchitectureItem {
  title: string
  description: string
}

export interface HighlightItem {
  title: string
  description: string
}

/** Item de `## Próximos Passos` — `- título: descrição` */
export interface NextStepItem {
  title: string
  description: string
}

export interface ReportJson {
  title: string
  /** Texto do `##` após o `#` (ex.: período do relatório) */
  month: string
  /** Tag superior direita da capa — `metaTag: ...` no markdown */
  metaTag: string
  /** Rodapé da capa — `heroFooterLine1:` / `heroFooterLine2:` */
  heroFooterLine1: string
  heroFooterLine2: string
  executiveSummary: ExecutiveSummaryItem[]
  /** Section `## Destaques` */
  highlights: HighlightItem[]
  /** Section `## Entregas Principais` */
  deliveries: DeliveryCategoryJson[]
  /** Section `## Arquitetura` → cards da seção 05 (badge 05) */
  architecture: ArchitectureItem[]
  /** Section `## Produto & Design` */
  productDesign: ProductDesignItem[]
  /** Section `## Próximos Passos` — `- título: descrição` */
  nextSteps: NextStepItem[]
}
