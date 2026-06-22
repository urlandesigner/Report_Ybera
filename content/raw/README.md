# content/raw — texto bruto dos relatórios mensais

Cole aqui o texto **sem formatação** que você recebe do Google Docs, um arquivo por mês,
nomeado `YYYY-MM.txt` (ex.: `2026-07.txt`).

## Fluxo mensal

1. Cole o conteúdo do doc em `content/raw/2026-07.txt`.
2. No Claude Code, rode: `/format-report 2026-07`
   - Ele lê esse `.txt` e gera `src/../content/reports/2026-07.md` no padrão do template.
3. Rode `npm run generate-reports` para gerar o JSON (`src/data/reports/2026-07.json`).
4. O relatório aparece automaticamente (o `reportRegistry` carrega todos os JSONs).

Você também pode colar o texto direto no chat ao rodar `/format-report 2026-07`, sem criar o `.txt`.

> Estes `.txt` são fonte de trabalho — não impactam o build. O build só lê os `.md` em `content/reports/`.
