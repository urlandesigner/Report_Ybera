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
  /** CTA opcional do card hero — markdown: `| cta: Texto do CTA:` */
  ctaLabel?: string
  /** Link opcional do CTA — markdown: `| ctaUrl: https://...` */
  ctaHref?: string
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
  notes?: DeliveryNoteJson[]
}

export interface SupportItem {
  title: string
  description: string
}

export interface HighlightItem {
  title: string
  description: string
  /** Sub-itens (lista) exibidos dentro do card — bullets `-` sem `:` abaixo do destaque. */
  bullets?: string[]
}

/** Item de `## Próximos Passos` — `- título: descrição` */
export interface NextStepItem {
  title: string
  description: string
}

/** Coluna agrupada em `## Próximos Passos` (`### Título` + bullets simples). */
export interface NextStepsColumnItem {
  title: string
  items: string[]
}

/** Card de versão no "Comparativo Histórico (Acumulado)". */
export interface ComparativeVersionItem {
  /** Rótulo do mês, ex. "Janeiro 26" */
  month: string
  /** Versão, ex. "1.2.32" */
  version: string
  /** Resumo da versão, ex. "42 entregas | 2.914 pontos." */
  summary: string
}

/** Insight estratégico (subtítulo + texto) na section Comparativo. */
export interface ComparativeInsightItem {
  title: string
  description: string
}

/** Section `## Comparativo` — visão geral, histórico de versões e insights. */
export interface ComparativeSection {
  /** Texto de "Visão Geral da Versão" */
  overview: string
  /** Intro de "Comparativo Histórico (Acumulado)" */
  historyIntro: string
  /** Cards de versão por mês */
  history: ComparativeVersionItem[]
  /** Intro de "Insights Estratégicos para a Diretoria" */
  insightsIntro: string
  /** Insights numerados */
  insights: ComparativeInsightItem[]
  /** Texto da "Conclusão Estratégica" */
  conclusion: string
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
  /** Origem visual da seção de arquitetura: `Melhorias & Otimizações` ou `Arquitetura` */
  architectureSectionVariant?: 'improvements' | 'architecture'
  /** Section `## Produto & Design` */
  productDesign: ProductDesignItem[]
  /** Section `## Novo PRO` */
  newPro: ProductDesignItem[]
  /** Section `## ERP Sênior` */
  erpSenior: ArchitectureItem[]
  /** Section `## Suporte & Relatórios` */
  support: SupportItem[]
  /** Section `## Comparativo` (opcional) — exibida após Produto & Design */
  comparative?: ComparativeSection
  /** Variante agrupada de `## Próximos Passos` */
  nextStepsColumns?: NextStepsColumnItem[]
  /** Section `## Próximos Passos` — `- título: descrição` */
  nextSteps: NextStepItem[]
}
