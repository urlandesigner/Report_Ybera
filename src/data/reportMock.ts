/**
 * Dados mock do Relatório Mensal de Tecnologia.
 * Edite este arquivo para alterar o conteúdo exibido na página.
 */

export interface HeroData {
  title: string
  highlight: string
  subtitle: string
  /** Tag glass superior direita (ex.: "Março 2026") */
  metaTag: string
  heroFooterLine1: string
  heroFooterLine2: string
  brandingLeft?: string
  brandingRight?: string
}

export interface SectionMeta {
  id: string
  /** Número no badge (ex: "01", "02") */
  badge: string
  title: string
  description: string
  icon?: string
  /** Título em duas cores (ex: "Resumo" verde + "Executivo" roxo) */
  titleSplit?: { left: string; right: string }
  /** Marca acima do título (ex: "Ybera") */
  brand?: string
}

/** Cor da bolinha do card (Figma: blue, purple, green, orange) */
export type ExecutiveCardDotColor = 'blue' | 'purple' | 'green' | 'orange'

export interface ExecutiveCard {
  id: string
  /** Cor da bolinha no topo do card */
  dotColor: ExecutiveCardDotColor
  title: string
  text: string
  /** Opcional: número ou tag (legado) */
  number?: string
  tag?: string
}

export interface DeliveryNote {
  label: string
  text: string
}

export interface DeliveryItem {
  title: string
  bullets: string[]
  notes?: DeliveryNote[]
}

export interface DeliveryCategory {
  id: string
  name: string
  deliveries: DeliveryItem[]
}

export interface ImprovementCard {
  id: string
  icon?: string
  title: string
  text: string
}

export interface ProductDesignCard {
  id: string
  number: string
  variant: 'pastel-green' | 'pastel-blue' | 'pastel-orange' | 'pastel-yellow' | 'pastel-lavender'
  title: string
  text: string
  image?: string
}

export interface SupportCard {
  id: string
  title: string
  description: string
  /** Texto do botão/link (ex: "View Reports") */
  ctaLabel?: string
}

export interface NextStepsColumn {
  title: string
  items: string[]
}

export interface ReportData {
  hero: HeroData
  sections: SectionMeta[]
  executiveSummaryCards: ExecutiveCard[]
  deliveries: DeliveryCategory[]
  improvementsCards: ImprovementCard[]
  productDesignCards: ProductDesignCard[]
  supportCards: SupportCard[]
  nextSteps: {
    left: NextStepsColumn
    right: NextStepsColumn
  }
  footer: {
    title: string
    slogan: string
    contactPrompt: string
    email: string
    brand: string
  }
}

export const reportMock: ReportData = {
  hero: {
    title: 'Relatório Mensal de',
    highlight: 'Tecnologia',
    subtitle: 'O panorama completo das nossas inovações, entregas e métricas do time de tecnologia.',
    metaTag: 'Fevereiro de 2026',
    heroFooterLine1: 'Ciclo de Desenvolvimento 1.2.32 — Sprints 25 (2025), 1 e 2 (2026).',
    heroFooterLine2: 'Versão lançada em 27 de janeiro de 2026.',
    brandingLeft: 'YBERA',
    brandingRight: 'by Cursor',
  },
  sections: [
    {
      id: '1',
      badge: '01',
      title: 'Resumo Executivo',
      description:
        'Panorama das principais entregas do ciclo, com foco em autonomia operacional, integrações críticas e eficiência no e-commerce, além de avanços em dados, arquitetura e IA.',
      /** Título split para header estilo Figma: "Resumo" (verde) + "Executivo" (roxo) */
      titleSplit: { left: 'Resumo', right: 'Executivo' },
      brand: 'Executive Summary',
    },
    {
      id: '2',
      badge: '03',
      title: 'Entregas Principais',
      description:
        'Implementações estratégicas que impactam diretamente receita, eficiência operacional e experiência do cliente.',
      titleSplit: { left: 'Entregas', right: 'Principais' },
      brand: 'Main Deliveries',
    },
    { id: '3', badge: '03', title: 'Melhorias & Otimizações', description: 'Ajustes estruturais e refatorações com foco em performance, governança técnica e sustentabilidade do ecossistema.', titleSplit: { left: 'Melhorias &', right: 'Otimizações' }, brand: 'Ybera' },
    {
      id: '4',
      badge: '04',
      title: 'Produto & Design',
      description:
        'Evoluções de experiência e novos conceitos de produto desenvolvidos para apoiar inovação e crescimento da plataforma.',
      titleSplit: { left: 'Produto &', right: 'Design' },
      brand: 'Product & Design',
    },
    {
      id: '5',
      badge: '05',
      title: 'Arquitetura',
      description:
        'Iniciativas estruturais voltadas à evolução da base técnica da plataforma, com foco em performance, eficiência operacional e sustentação do crescimento do ecossistema.',
      brand: 'Architecture',
    },
    {
      id: '6',
      badge: '06',
      title: 'Próximos passos',
      description:
        'Principais iniciativas em andamento e próximas entregas, com foco na evolução do ecossistema, expansão de funcionalidades e ganho de escala operacional.',
      brand: 'Next steps',
    },
  ],
  executiveSummaryCards: [
    {
      id: 'e1',
      dotColor: 'blue',
      title: 'Implementações Globais',
      text: 'V3 da Lybera Shop com sistema de tags, redirecionamento do novo domínio do Club e ajustes em e-mails transacionais.',
    },
    {
      id: 'e2',
      dotColor: 'purple',
      title: 'Expansão Internacional',
      text: 'Checkout Pro do Mercado Pago no México, promoções Buy X Get Y agendadas e integração TikTok Ads para Chile e Panamá.',
    },
    {
      id: 'e3',
      dotColor: 'green',
      title: 'Ecommerce Brasil',
      text: 'Implementação do Pix Parcelado (Pagaleve), regionalização de frete com cálculo antecipado e organização completa do Strapi.',
    },
    {
      id: 'e4',
      dotColor: 'purple',
      title: 'Inteligência Artificial',
      text: 'Integração com Impulsis para WhatsApp no Zendesk e automação de leitura de NFEs com novos códigos CNAE.',
    },
    {
      id: 'e5',
      dotColor: 'orange',
      title: 'Arquitetura & Performance',
      text: 'Migração para .NET 10, Open Telemetry implementado e refatoração completa do processamento de metas.',
    },
  ],
  deliveries: [
    {
      id: 'd1',
      name: 'Ybera Club Global',
      deliveries: [
        { title: 'V3 – Ybera Shop com Tags', bullets: ['Implementação de tags que desabilitam produtos: servirá para Cliente Novo, Revendedora, Parceiro e Lojista. Tags para identificar quem é o usuário do ecommerce.'] },
        { title: 'Redirect URL Club', bullets: ['Redirecionamento implementado como o novo domínio Ybera e melhorias na área.'] },
        { title: 'Ajustes de Copy – E-mails Transacionais', bullets: ['Ajustes nos e-mails transacionais para deixá-los mais adequados e com o branding correto.'] },
      ],
    },
    {
      id: 'd2',
      name: 'Ybera Club Brasil',
      deliveries: [
        { title: 'Melhorias Administrativas do Connect', bullets: ['Módulo de conferência, importação de pedidos com o Connect. E visualização do valor solicitado na tela de aprovação.'] },
        { title: 'Gestão de Aprovação de Leads', bullets: ['Gerenciamento e controle dos leads em sistema, incluindo aprovação e rejeição de solicitações.'] },
        { title: 'Meta Qualificada – Tesouraria Ybera', bullets: ['Cadastro de meta automática para todos os vendedores, com gerenciamento e controle de cada um.'] },
        { title: 'Cadastramento de Metas Combinadas', bullets: ['Novos campos de nível de vendedor e metas combinadas com parâmetros específicos.'] },
      ],
    },
    {
      id: 'd3',
      name: 'Ecommerce Brasil',
      deliveries: [
        { title: 'Pix Parcelado (Pagar.me)', bullets: ['Substituição do operador de split para o Pagar.me para melhor experiência de compra.'] },
        { title: 'Regionalização de Frete', bullets: ['Cálculo e exibição de frete atualizados para os clientes, com base em suas regiões.'] },
      ],
    },
    {
      id: 'd4',
      name: 'Ybera Club PRO Brasil',
      deliveries: [
        { title: 'Disparo em Massa de E-mails', bullets: ['Envio em massa para um grande número de clientes, com personalização e rastreamento.'] },
      ],
    },
    {
      id: 'd5',
      name: 'Ybera Club EUA',
      deliveries: [
        { title: 'Tradução Modal Termos e Condições', bullets: ['Tradução do modal de termos e condições para o inglês, melhorando a experiência do cliente.'] },
        { title: 'Expiração Pedido Club – Pagamento Zelle', bullets: ['Expiração de pedidos do Club com pagamentos Zelle, com avisos automatizados.'] },
      ],
    },
    {
      id: 'd6',
      name: 'Ecommerce Shopify Global',
      deliveries: [
        { title: 'Promoção Buy X Get Y Agridade', bullets: ['Promoção de "Compre 1 Leve 2" com variação de acordo com a quantidade de produtos.'] },
        { title: 'TikTok Ads – Chile e Panamá', bullets: ['Integração da plataforma de anúncios do TikTok para campanhas no Shopify.'] },
        { title: 'Judge.me – Avaliações de Produtos', bullets: ['Integração da ferramenta Judge.me para avaliações de produtos e comentários.'] },
        { title: 'Checkout Pro Mercado Pago – México', bullets: ['Checkout Pro através do Mercado Pago para vendedores com pagamentos em até 12 meses.'] },
      ],
    },
    {
      id: 'd7',
      name: 'Implementações No Code',
      deliveries: [
        { title: 'Abertura Vendas Acelerador e Influencers', bullets: ['Configuração e abertura das vendas no Acelerador, com acompanhamento de leads.'] },
        { title: 'Ajustes Página de Venda – Acelerador ou Pass', bullets: ['Ajustes na página de venda do Acelerador, exibindo dados e funcionalidades.'] },
        { title: 'E-mail Onboarding Acelerador 2024', bullets: ['Ajustes no copy do e-mail de onboarding do Acelerador, com informações atualizadas.'] },
        { title: 'Exclusão de Usuários – Academy', bullets: ['Implementação de lógica de exclusão de usuários na Academy.'] },
      ],
    },
    {
      id: 'd8',
      name: 'Implementações em IA',
      deliveries: [
        { title: 'Integração Impulsus – WhatsApp', bullets: ['Fornecimento de integração do módulo Impulsus com o WhatsApp, para envio de mensagens.'] },
        { title: 'Leitor Automático de NFe\'s', bullets: ['Aquisição e leitura automática de NF-e para emissão de notas fiscais.'] },
        { title: 'Ajustes Gerais no Zendesk', bullets: ['Integração da ferramenta Zendesk para gerenciamento de chamados e suporte.'] },
        { title: 'Checkout Pro Mercado Pago – México', bullets: ['Ajustes no portal do SUAC SAC para organização dos dados do cliente.'] },
      ],
    },
  ],
  improvementsCards: [
    { id: 'i1', title: 'Refactor Front/Mobile - APP', text: 'Alterações de Frontend para republicação do APP nas stores Apple e Android, atualizando identidade visual do club.' },
    { id: 'i2', title: 'Ajustes Processamento de Metas', text: 'Resolução de problema de memória para diminuir lentidão nos processamentos futuros.' },
    { id: 'i3', title: 'Refactor Backend - Configurações', text: 'Alteração na estrutura de configurações (projeto base) para facilitar gestão de configurações do sistema.' },
    { id: 'i4', title: 'Open Telemetry Implementado', text: 'Rastreamento e métricas distribuídas para observabilidade e diagnóstico do sistema.' },
    { id: 'i5', title: 'Atualização para .NET 10', text: 'Migração do projeto base para .NET 10.' },
    { id: 'i6', title: 'Migração para System.Text.Json', text: 'Substituição de Newtonsoft.Json por System.Text.Json para serialização nativa e performance.' },
    { id: 'i7', title: 'Controle de Pagamento Duplicado', text: 'Prevenção e tratamento de pagamentos duplicados no fluxo de checkout.' },
    { id: 'i8', title: 'Novo Modelo de Critério de Vendas', text: 'Nova modelagem de regras e critérios para cálculo e atribuição de vendas.' },
  ],
  productDesignCards: [
    { id: 'p1', number: '01', variant: 'pastel-green', title: 'Protótipo Novo Pass', text: 'Ticketeira para venda dos ingressos dos eventos do Grupo.' },
    { id: 'p2', number: '02', variant: 'pastel-yellow', title: 'Protótipo Live Interativa', text: 'Componente de LiveShop pronto para implementação.' },
    { id: 'p3', number: '03', variant: 'pastel-orange', title: 'Landing Page #TBT', text: 'Prototipagem completa da experiência do TBT Black November.' },
    { id: 'p4', number: '04', variant: 'pastel-blue', title: 'Ferramenta de Banners', text: 'Design Thinking da nova ferramenta de banners para Escritório global.' },
    { id: 'p5', number: '05', variant: 'pastel-green', title: 'Site Institucional Ybera Group', text: 'Estrutura completa prototipada, aguardando imagens do Marketing.' },
    { id: 'p6', number: '06', variant: 'pastel-yellow', title: 'Protótipo Cotação de Frete na PDP', text: 'Reinserção da cotação de frete dentro da página de detalhamento do produto.' },
    { id: 'p7', number: '07', variant: 'pastel-orange', title: 'Live Commerce USA', text: 'Protótipo para primeira experiência de Liveshop nos EUA.' },
    { id: 'p8', number: '08', variant: 'pastel-blue', title: 'Modais e Barra de Progresso', text: 'Demonstrativo de limites mensais de aquisição de conexões no Connect.' },
  ],
  supportCards: [
    { id: 's1', title: 'Relatórios Extraídos', description: 'Relatório de Crescimento do Club em 2025 e Comissões pagas ao Club em 2025, mediante solicitação das áreas.' },
    { id: 's2', title: 'Tech Intelligence', description: 'Finalização da documentação de cronograma de entregas com escopo claro sobre o que será entregue pelo time de Dados.' },
    { id: 's3', title: 'Operações', description: 'Suporte com implementações de exportação de relatórios, gestão de leads e automação de processos administrativos.' },
  ],
  nextSteps: {
    left: {
      title: 'AGUARDANDO APROVAÇÃO',
      items: [
        'Publicação do APP atualizado nas stores Apple e Android',
        'Apresentação do protótipo do Site Institucional Ybera Group',
        'Apresentação da nova ferramenta de banners para Escritório',
      ],
    },
    right: {
      title: 'EM DESENVOLVIMENTO',
      items: [
        'Novo componente de metas para melhor performance',
        'Implementação dos protótipos de Live Commerce (Brasil e USA)',
        'Cotação de frete na página de produto (PDP)',
      ],
    },
  },
  footer: {
    title: 'Time de Tecnologia Ybera',
    slogan: 'Comprometidos com transparência, inovação e colaboração',
    contactPrompt: 'Para duvidas ou sugestões',
    email: 'lucas.rolim@ybera.com',
    brand: 'Y.',
  },
}

/** Metadados do título da section Destaques (conteúdo dos cards vem do `report.json`). */
export const destaquesSectionMeta: SectionMeta = {
  id: 'destaques',
  badge: '02',
  title: 'Destaques',
  description:
    'Principais entregas estratégicas do ciclo, destacando iniciativas de maior impacto em negócio, operação e evolução da plataforma.',
  brand: 'Highlights',
}
