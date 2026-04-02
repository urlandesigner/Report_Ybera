# Report Ybera

Projeto de relatórios com React + TypeScript + Vite.

## Como rodar

**Importante:** execute os comandos na **pasta raiz do projeto** (onde está o `package.json`).

```bash
# Instalar dependências
npm install

# Desenvolvimento — use SEMPRE este comando para ver suas alterações
npm run dev
```

Depois abra no navegador a URL que aparecer no terminal (ex: **http://localhost:5173**).  
Se as alterações não aparecerem: use **aba anônima** ou **Ctrl+Shift+R** (Cmd+Shift+R no Mac) para forçar atualização sem cache.

```bash
# Build para produção
npm run build

# Preview do build (só use depois de rodar npm run build)
npm run preview
```

**Não use** `npm run preview` para desenvolver — ele serve a pasta `dist/` (última build). Para ver mudanças, use sempre `npm run dev`.

## Estrutura

- `index.html` — entrada HTML (script aponta para `/src/main.tsx`)
- `src/main.tsx` — entrada da aplicação (carrega `index.css` e `App`)
- `src/index.css` — estilos globais e fonte Plus Jakarta Sans
- `src/App.tsx` — rotas (/) → `MonthlyTechReport`
- `src/pages/MonthlyTechReport.tsx` — página do relatório
- `src/components/report/` — componentes da seção (incl. `ExecutiveSummarySection`)
- `src/data/reportMock.ts` — dados exibidos na página (fallbacks)
- `content/report-input.md` — fonte do relatório; `npm run generate-report` gera `src/data/report.json`

### Conflito ao salvar ou fechar `report.json` no Cursor/VS Code

Isso costuma acontecer quando o arquivo **mudou no disco** (por exemplo depois de `npm run generate-report`) e o editor ainda tem **outra versão na memória**.

**O que fazer:**

1. **Não edite `report.json` à mão** — altere só `content/report-input.md` e rode `npm run generate-report`. Assim você não compete com o gerador.
2. Se aparecer aviso de conflito ao fechar/salvar: escolha **Recarregar do disco** / **Revert** (descartar alterações do editor) se você não tinha mudanças intencionais no JSON — ou feche a aba com **Don’t Save** / **Descartar**.
3. Opcional: feche a aba do `report.json` **antes** de rodar `npm run generate-report`, para o editor não segurar uma cópia antiga.

### Capa (hero) no `report-input.md`

Após o `#` título e o `##` do mês, use linhas `chave: valor` (até o próximo `##`):

- `metaTag` — tag glass superior direita (ex.: `Março 2026`)
- `heroFooterLine1` / `heroFooterLine2` — duas linhas do rodapé da capa

Se `metaTag` estiver vazio no JSON, a página usa o texto do `##` mês como fallback.
