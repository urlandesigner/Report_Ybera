# Report Ybera

Relatório mensal de tecnologia — React + TypeScript + Vite.

A página é **data-driven**: cada mês é um JSON em `src/data/reports/YYYY-MM.json`, gerado a
partir de um Markdown em `content/reports/YYYY-MM.md`. Qualquer JSON nessa pasta entra no site
automaticamente (sem editar imports nem registrar o mês).

## Como rodar

**Importante:** execute os comandos na **pasta raiz do projeto** (onde está o `package.json`).

```bash
# Instalar dependências
npm install

# Desenvolvimento — use SEMPRE este comando para ver suas alterações
npm run dev
```

Depois abra no navegador a URL que aparecer no terminal (ex.: **http://localhost:5173** —
a porta pode variar se a padrão estiver ocupada).
Se as alterações não aparecerem: use **aba anônima** ou **Ctrl+Shift+R** (Cmd+Shift+R no Mac)
para forçar atualização sem cache. Em pastas com espaços no caminho, o file-watcher do Vite às
vezes não detecta mudanças — nesse caso, **reinicie o `npm run dev`** e dê um hard reload.

```bash
# Build para produção (roda generate-reports antes de compilar)
npm run build

# Preview do build (só use depois de rodar npm run build)
npm run preview
```

**Não use** `npm run preview` para desenvolver — ele serve a pasta `dist/` (última build).
Para ver mudanças, use sempre `npm run dev`.

## Publicar um novo mês

O input oficial de cada mês é o Markdown em `content/reports/YYYY-MM.md`.
Os JSONs em `src/data/reports/YYYY-MM.json` são gerados a partir desses arquivos e não devem
ser editados à mão.

Fluxo recomendado:

1. Cole o texto bruto recebido do Google Docs em `content/raw/YYYY-MM.txt`
   (ex.: `content/raw/2026-07.txt`).
2. Gere ou edite o Markdown mensal em `content/reports/YYYY-MM.md`.
3. Rode:

   ```bash
   npm run generate-reports
   ```

4. Rode `npm run dev` para revisar no site ou `npm run build` para validar produção.

O comando `npm run build` também executa `generate-reports` antes de compilar. Em
desenvolvimento, `npm run dev` roda `predev`, que também regenera os relatórios ao iniciar.

### Comando `/format-report`

O comando `.claude/commands/format-report.md` converte o texto bruto no Markdown que o
gerador entende:

```text
/format-report 2026-07
```

Ele procura primeiro `content/raw/2026-07.txt`. Se esse arquivo não existir, use o texto
colado na conversa como fonte.

## Regras do conteúdo mensal

- O `## Resumo Executivo` normalmente **não vem do Google Docs**: ele deve ser gerado
  a partir da leitura completa do documento do mês, resumindo os principais temas em
  cards executivos.
- A única seção que pode ter texto sintetizado/redigido é `## Resumo Executivo`.
- Como padrão, gere até 6 cards no `Resumo Executivo`; use menos apenas quando o mês tiver
  pouco conteúdo (ex.: janeiro ficou com 5).
- Todas as outras seções devem espelhar o documento-fonte o mais fielmente possível.
- Se o documento trouxer só o título de um item, mantenha só o título no `.md`.
- Não invente cards, descrições, números, versões, próximos passos ou destaques.
- Se uma seção não existir no documento do mês, omita a seção no `.md`.
- Janeiro/fevereiro, por exemplo, podem não ter `Destaques`; fevereiro também pode não ter
  `Próximos Passos`.

## Formato do Markdown mensal

O gerador (`scripts/generate-report-json.ts`) reconhece estas seções. Os títulos `##` devem
ser escritos exatamente como abaixo, com acentos e `&`, senão a seção é ignorada.

```markdown
# Relatório Mensal de Tecnologia
## Julho 2026

metaTag: Julho 2026
heroFooterLine1: Ciclo de Desenvolvimento 1.2.37 — Sprints 10, 11 e 12
heroFooterLine2: Versão lançada em 16 de junho de 2026.

## Resumo Executivo
- Título do tópico: descrição em uma linha.
- Outro tópico: descrição em uma linha.

## Destaques
- Título do destaque: descrição.
  - Subitem do destaque sem dois-pontos
  - Outro subitem do destaque sem dois-pontos

## Entregas Principais
### Categoria (ex.: Ybera Club Brasil)
- Título da entrega: descrição.
  - Subitem opcional: texto do subitem

## Melhorias & Otimizações
- Título: descrição.

## Produto & Design
- Título: descrição.
- Card hero com imagem | image: /assets/arquivo.png | cta: Texto do CTA | ctaUrl: https://exemplo.com: descrição.

## Novo PRO
- Título: descrição.

## Arquitetura
- Título: descrição.
  - Subitem opcional: texto do subitem

## ERP Sênior
- Título: descrição.
  - Subitem opcional: texto do subitem

## Comparativo
overview: Visão geral da versão, em uma linha.
historyIntro: Intro do comparativo histórico, em uma linha.
insightsIntro: Intro dos insights, em uma linha.
conclusion: Conclusão estratégica, em uma linha.

### Histórico
- Janeiro 26 | 1.2.32 | 42 entregas | 2.914 pontos.

### Insights
- Insight 1: Autonomia Operacional | Descrição completa do insight.

## Suporte & Relatórios
- Título: descrição.

## Próximos Passos
- Título: descrição.

### Aguardando aprovação
- Item simples sem descrição
- Outro item simples sem descrição

### Em desenvolvimento
- Item simples sem descrição
```

Regras de sintaxe:

- **Capa**: após o `#` título e o `##` do mês, use linhas `chave: valor` (`metaTag`,
  `heroFooterLine1`, `heroFooterLine2`) até o próximo `##`. Se `metaTag` ficar vazio, a página
  usa o texto do `##` mês como fallback.
- **Bullets padrão** (`Resumo Executivo`, `Entregas Principais`, `Produto & Design`,
  `Melhorias & Otimizações`, `Arquitetura`, `Novo PRO`, `ERP Sênior`, `Suporte & Relatórios`,
  `Próximos Passos` simples): `- Título: descrição`; o primeiro `:` separa título e descrição.
- **Entregas Principais** usa subcategorias `### Nome da Categoria` com os bullets abaixo.
  Subitens indentados com dois espaços viram notas dentro da entrega.
- **Destaques**: o bullet principal com `:` vira card. Subitens indentados abaixo devem evitar
  `:`; use travessão ou texto simples, senão o parser entende como novo card.
- **Melhorias & Otimizações vs. Arquitetura**:
  - Use `## Melhorias & Otimizações` quando o mês tiver essa seção com esse nome visual.
  - Use `## Arquitetura` quando o mês tiver arquitetura como seção própria.
  - Se as duas existirem, o gerador prioriza `Melhorias & Otimizações` para os cards de arquitetura visual.
- **Novo PRO**: seção opcional; quando existe, aparece como seção própria com cards verdes.
- **ERP Sênior**: seção opcional; quando existe, aparece como seção própria.
- **Produto & Design com hero**: para um card grande com imagem e CTA, use a sintaxe
  `- Título | image: /assets/imagem.png | cta: Texto | ctaUrl: https://...: descrição`.
- **Comparativo** (opcional — omita a seção se não houver dados no mês):
  - `overview`, `historyIntro`, `insightsIntro`, `conclusion`: cada um em **uma única linha**.
  - `### Histórico`: `- Mês AA | versão | resumo` (o resumo pode conter `|`).
  - `### Insights`: `- Título | Descrição` (o **primeiro** `|` separa; a descrição não pode conter `|`).
- **Próximos Passos**:
  - Formato simples: bullets `- Título: descrição`.
  - Formato em colunas: use `### Nome da coluna` e bullets simples abaixo. Quando há colunas,
    o parser ignora o formato simples dessa seção.

## Estrutura

- `index.html` — entrada HTML (script aponta para `/src/main.tsx`)
- `src/main.tsx` — entrada da aplicação (carrega `index.css` e `App`)
- `src/index.css` — estilos globais e fonte Plus Jakarta Sans
- `src/App.tsx` — rotas: `/` e `/report` redirecionam para o último mês; `/report/:year/:month` renderiza o relatório. Inclui o popup da pesquisa de satisfação.
- `src/pages/MonthlyTechReport.tsx` — página do relatório (monta as seções a partir do JSON)
- `src/components/report/` — componentes das seções (ex.: `ExecutiveSummarySection`, `ComparativeSectionContent`)
- `src/data/reportMock.ts` — metadados de título/badge das seções e dados de fallback
- `src/data/report.types.ts` — tipos do `ReportJson`
- `src/data/reportRegistry.ts` — carrega todos os `src/data/reports/*.json` e ordena por período
- `content/reports/YYYY-MM.md` — **fonte mensal** (Markdown); `npm run generate-reports` gera `src/data/reports/YYYY-MM.json`
- `content/raw/YYYY-MM.txt` — texto cru do doc, fonte para `/format-report` (não impacta o build)
- `.claude/commands/format-report.md` — definição do comando `/format-report`

### Editar JSONs gerados

Não edite os `src/data/reports/*.json` à mão. Eles são regenerados por `npm run generate-reports`
a partir dos `.md`. Edite o Markdown em `content/reports/` e rode o gerador.

### Fluxo legado (`report-input.md` → `report.json`)

`content/report-input.md` + `npm run generate-report` (singular) geram `src/data/report.json`.
Esse arquivo **não é mais consumido** pela aplicação (a página lê apenas os JSONs mensais em
`src/data/reports/`). Mantido apenas por compatibilidade — para publicar conteúdo, use o fluxo
mensal acima.
