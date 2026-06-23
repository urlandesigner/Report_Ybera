---
description: Converte o texto cru do doc mensal no template Markdown do relatório (content/reports/YYYY-MM.md).
argument-hint: <ano-mes, ex. 2026-07>
---

Você vai converter o conteúdo bruto do relatório mensal (texto solto, sem formatação,
copiado do Google Docs) no **template Markdown** que o gerador do projeto entende.

## Período

O período é: **$ARGUMENTS** (formato `YYYY-MM`, ex.: `2026-07`).

Se `$ARGUMENTS` estiver vazio, pergunte ao usuário qual o período antes de continuar.

## De onde vem o texto cru

1. Primeiro, procure o arquivo `content/raw/$ARGUMENTS.txt`. Se existir, use o conteúdo dele como fonte.
2. Se NÃO existir, verifique se o usuário colou o texto do relatório na conversa. Se sim, use esse texto.
3. Se não houver nenhuma das duas fontes, **pare e peça** ao usuário para colar o texto ou criar `content/raw/$ARGUMENTS.txt`. Não invente conteúdo.

## Regra de ouro

**Apenas reestruture o que está no texto fonte.** Nunca invente entregas, números, versões,
insights ou textos que não estejam na fonte. Se uma seção não tiver conteúdo na fonte, omita-a.
Corrija ortografia/pontuação óbvias e organize, mas não crie informação nova.

## Regra adicional deste projeto

- O `## Resumo Executivo` normalmente **não existe no documento-fonte**. Gere essa seção
  a partir da leitura completa do mês, sintetizando os principais temas em cards executivos.
- **Somente a seção `## Resumo Executivo` pode ter texto sintetizado/redigido.**
- Como padrão, gere até **6 cards** no `Resumo Executivo`; use menos apenas quando o mês
  tiver pouco conteúdo.
- Em **todas as outras seções**, o conteúdo deve espelhar o documento-fonte o mais fielmente possível.
- Se o documento-fonte trouxer **apenas o título** de um item, mantenha **apenas o título** no Markdown.
- Não complete descrições faltantes, não deduza contexto e não transforme tópicos curtos em explicações novas fora do `Resumo Executivo`.
- Se uma seção não existir no documento-fonte, **omita a seção inteira** no Markdown.
- Não crie `Destaques`, `Comparativo`, `Próximos Passos`, `Suporte & Relatórios`, `Novo PRO`, `ERP Sênior` ou qualquer outra seção se ela não existir no mês.

## Saída

Escreva o resultado em `content/reports/$ARGUMENTS.md` seguindo EXATAMENTE o formato abaixo.
Ao terminar, mostre um resumo do que foi mapeado (quantos itens por seção) e lembre o usuário
de rodar `npm run generate-reports` para gerar o JSON.

## Formato do template (siga à risca)

```markdown
# Relatório Mensal de Tecnologia
## <Mês> <Ano>

metaTag: <Mês> <Ano>
heroFooterLine1: Ciclo de Desenvolvimento <versão> — <sprints>
heroFooterLine2: Versão lançada em <data>.

## Resumo Executivo
- <Título do tópico>: <descrição em uma linha>
- <Título do tópico>: <descrição em uma linha>

## Destaques
- <Título do destaque>: <descrição>
  - <Subitem do destaque sem dois-pontos>
  - <Outro subitem do destaque sem dois-pontos>

## Entregas Principais
### <Categoria, ex.: Ybera Club Brasil>
- <Título da entrega>: <descrição>
  - <Subitem opcional>: <texto do subitem>
- <Título da entrega>: <descrição>
### <Outra Categoria>
- <Título da entrega>: <descrição>

## Melhorias & Otimizações
- <Título>: <descrição>
- <Título>: <descrição>

## Produto & Design
- <Título>: <descrição>
- <Título>: <descrição>
- <Título do card hero> | image: /assets/<arquivo>.png | cta: <Texto do CTA> | ctaUrl: <https://...>: <descrição>

## Novo PRO
- <Título>: <descrição>
- <Título>: <descrição>

## Arquitetura
- <Título>: <descrição>
  - <Subitem opcional>: <texto do subitem>
- <Título>: <descrição>

## ERP Sênior
- <Título>: <descrição>
  - <Subitem opcional>: <texto do subitem>
- <Título>: <descrição>

## Comparativo
overview: <Texto da "Visão Geral da Versão", em UMA linha só.>
historyIntro: <Intro do "Comparativo Histórico", em UMA linha.>
insightsIntro: <Intro dos "Insights Estratégicos para a Diretoria", em UMA linha.>
conclusion: <Texto da "Conclusão Estratégica", em UMA linha.>

### Histórico
- <Mês AA> | <versão> | <resumo, ex.: 42 entregas | 2.914 pontos.>
- <Mês AA> | <versão> | <resumo>

### Insights
- <Título do insight, ex.: Insight 1: Autonomia Operacional> | <descrição completa>
- <Título do insight> | <descrição completa>

## Suporte & Relatórios
- <Título>: <descrição>
- <Título>: <descrição>

## Próximos Passos
- <Título>: <descrição>
- <Título>: <descrição>

### <Título da coluna, ex.: Aguardando aprovação>
- <Item simples sem descrição>
- <Item simples sem descrição>

### <Título da coluna, ex.: Em desenvolvimento>
- <Item simples sem descrição>
- <Item simples sem descrição>
```

## Regras de sintaxe (críticas — o parser depende delas)

- O título do mês (`## Julho 2026`) deve ser o **primeiro `##`** após o `# Relatório...`. Converta o período: `2026-07` → "Julho 2026" (use o nome do mês em português).
- `metaTag`, `heroFooterLine1`, `heroFooterLine2`: pares `chave: valor`, logo após o `## <Mês> <Ano>`, antes do próximo `##`.
- Em seções de bullets padrão (`Resumo Executivo`, `Entregas Principais`, `Produto & Design`, `Melhorias & Otimizações`, `Arquitetura`, `Novo PRO`, `ERP Sênior`, `Suporte & Relatórios`, `Próximos Passos` simples): cada item é `- Título: descrição`. O **primeiro** `:` separa título e descrição.
- `## Entregas Principais` usa subcategorias `### Nome da Categoria`, com os bullets logo abaixo de cada uma.
- Subitens indentados com dois espaços em `Entregas Principais`, `Arquitetura` e `ERP Sênior` viram notas dentro do card anterior.
- `## Destaques`: bullets principais com `:` viram cards. Subitens devem ser indentados com dois espaços e **não devem usar `:`**, senão o parser cria um novo card indevidamente.
- `## Melhorias & Otimizações` e `## Arquitetura` alimentam a mesma área visual:
  - Use `## Melhorias & Otimizações` quando o mês tiver essa seção com esse nome.
  - Use `## Arquitetura` quando arquitetura for seção própria do mês.
  - Se as duas existirem, o gerador prioriza `Melhorias & Otimizações`.
- `## Novo PRO` e `## ERP Sênior` são opcionais e só devem existir se estiverem no documento-fonte.
- `## Produto & Design` aceita card hero com imagem e CTA usando:
  `- Título | image: /assets/imagem.png | cta: Texto | ctaUrl: https://...: descrição`
- `## Comparativo` é especial:
  - As 4 chaves (`overview`, `historyIntro`, `insightsIntro`, `conclusion`) ficam **cada uma em uma única linha** (não quebre o parágrafo em várias linhas).
  - `### Histórico`: bullets `- Mês AA | versão | resumo`. Separador é `|`. O resumo pode conter `|` (ex.: `42 entregas | 2.914 pontos.`).
  - `### Insights`: bullets `- Título | Descrição`. O **primeiro** `|` separa título e descrição. A descrição **não pode** conter `|`.
  - Se o doc não trouxer dados de Comparativo naquele mês, **omita a seção `## Comparativo` inteira** (ela é opcional).
- `## Próximos Passos` pode ser simples (`- Título: descrição`) ou em colunas (`### Coluna` + bullets simples). Se usar colunas, não misture com o formato simples.
- Mantenha os títulos das seções `##` **exatamente** como escritos acima (com acentos e "&"), senão o gerador não reconhece.

Depois de escrever o arquivo, valide mentalmente que cada `##` bate com a lista acima e relate o resultado.
