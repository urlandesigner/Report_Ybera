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

Você recebe o conteúdo do mês como texto solto (Google Docs). Há dois caminhos:

### Caminho automatizado (recomendado) — comando `/format-report`

Converte o texto cru no template Markdown usando IA, dentro do Claude Code.

1. Cole o texto do doc em `content/raw/YYYY-MM.txt` (ex.: `content/raw/2026-07.txt`).
   - Alternativa: cole o texto direto no chat ao rodar o comando, sem criar o `.txt`.
2. No Claude Code, rode:

   ```
   /format-report 2026-07
   ```

   Ele gera `content/reports/2026-07.md` já no padrão do template.
3. Gere os JSONs:

   ```bash
   npm run generate-reports
   ```

Veja `content/raw/README.md` para detalhes do fluxo.

### Caminho manual

1. Crie `content/reports/YYYY-MM.md` seguindo o **Formato do Markdown mensal** (abaixo).
2. Rode `npm run generate-reports`.

O comando gera `src/data/reports/YYYY-MM.json`. O `npm run build` também roda
`generate-reports` antes de compilar, então em deploy os reports são atualizados
automaticamente a partir dos arquivos em `content/reports/`.

## Formato do Markdown mensal

O gerador (`scripts/generate-report-json.ts`) reconhece estas seções. Os títulos `##` devem
ser escritos **exatamente** como abaixo (com acentos e `&`), senão a seção é ignorada.

```markdown
# Relatório Mensal de Tecnologia
## Julho 2026

metaTag: Julho 2026
heroFooterLine1: Ciclo de Desenvolvimento 1.2.37 — Sprints 10, 11 e 12
heroFooterLine2: Versão lançada em 16 de junho de 2026.

## Resumo Executivo
- Título do tópico: descrição em uma linha.

## Destaques
- Título do destaque: descrição.

## Entregas Principais
### Categoria (ex.: Ybera Club Brasil)
- Título da entrega: descrição.

## Produto & Design
- Título: descrição.

## Comparativo
overview: Visão geral da versão, em uma linha.
historyIntro: Intro do comparativo histórico, em uma linha.
insightsIntro: Intro dos insights, em uma linha.
conclusion: Conclusão estratégica, em uma linha.

### Histórico
- Janeiro 26 | 1.2.32 | 42 entregas | 2.914 pontos.

### Insights
- Insight 1: Autonomia Operacional | Descrição completa do insight.

## Arquitetura
- Título: descrição.

## Próximos Passos
- Título: descrição.
```

Regras de sintaxe:

- **Capa**: após o `#` título e o `##` do mês, use linhas `chave: valor` (`metaTag`,
  `heroFooterLine1`, `heroFooterLine2`) até o próximo `##`. Se `metaTag` ficar vazio, a página
  usa o texto do `##` mês como fallback.
- **Bullets** (`Resumo Executivo`, `Destaques`, `Entregas Principais`, `Produto & Design`,
  `Arquitetura`, `Próximos Passos`): `- Título: descrição` — o **primeiro** `:` separa os dois.
- **Entregas Principais** usa subcategorias `### Nome da Categoria` com os bullets abaixo.
- **Comparativo** (opcional — omita a seção se não houver dados no mês):
  - `overview`, `historyIntro`, `insightsIntro`, `conclusion`: cada um em **uma única linha**.
  - `### Histórico`: `- Mês AA | versão | resumo` (o resumo pode conter `|`).
  - `### Insights`: `- Título | Descrição` (o **primeiro** `|` separa; a descrição não pode conter `|`).

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

Não edite os `src/data/reports/*.json` à mão — eles são regenerados por `npm run generate-reports`
a partir dos `.md`. Edite o Markdown em `content/reports/` e rode o gerador.

Exceção atual: `src/data/reports/2026-05.json` não tem `.md` correspondente em `content/reports/`,
então é mantido à mão (o gerador não o sobrescreve). Para passá-lo ao fluxo Markdown, crie
`content/reports/2026-05.md`.

### Fluxo legado (`report-input.md` → `report.json`)

`content/report-input.md` + `npm run generate-report` (singular) geram `src/data/report.json`.
Esse arquivo **não é mais consumido** pela aplicação (a página lê apenas os JSONs mensais em
`src/data/reports/`). Mantido apenas por compatibilidade — para publicar conteúdo, use o fluxo
mensal acima.
