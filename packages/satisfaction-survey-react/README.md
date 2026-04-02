# satisfaction-survey-react

Popup de avaliação (nota 1–5 + comentário opcional) disparado quando um elemento de referência entra na viewport (`IntersectionObserver`). Estilos **inline** — não depende de Tailwind.

## Instalação

**Neste monorepo** já está ligado via `npm` workspaces.

**Noutro projeto** (após publicar no npm ou instalar por caminho):

```bash
npm install satisfaction-survey-react
# ou
npm install ../caminho/para/packages/satisfaction-survey-react
```

Peer dependencies: `react` e `react-dom` ≥ 18.

## Uso mínimo

```tsx
import { useRef } from 'react'
import {
  SatisfactionSurveyPopup,
  createSurveySubmitHandler,
  DEFAULT_STORAGE_KEY,
} from 'satisfaction-survey-react'

const sectionRef = useRef<HTMLElement>(null)

const onSubmit = createSurveySubmitHandler({
  storageKey: DEFAULT_STORAGE_KEY, // ou uma chave só teu projeto
  apiUrl: import.meta.env.VITE_SURVEY_API_URL, // opcional
})

return (
  <>
    <section ref={sectionRef}>…</section>
    <SatisfactionSurveyPopup triggerRef={sectionRef} onSubmit={onSubmit} />
  </>
)
```

### Textos (i18n / outro produto)

```tsx
<SatisfactionSurveyPopup
  triggerRef={sectionRef}
  onSubmit={onSubmit}
  labels={{
    title: 'How was this page?',
    thankYouTitle: 'Thanks!',
  }}
/>
```

### Ler respostas do `localStorage`

```ts
import { getSurveyResponses, DEFAULT_STORAGE_KEY } from 'satisfaction-survey-react'

const list = getSurveyResponses(DEFAULT_STORAGE_KEY)
```

## API

| Export | Descrição |
|--------|-----------|
| `SatisfactionSurveyPopup` | Componente do diálogo |
| `createSurveySubmitHandler` | Devolve função para `onSubmit` (localStorage + API opcional) |
| `registerSurveyResponse` | Grava e opcionalmente POST (chama manualmente) |
| `saveSurveyToLocalStorage` / `getSurveyResponses` | Apenas storage |
| `sendSurveyToApi` | POST JSON para uma URL |
| `DEFAULT_STORAGE_KEY` | Chave default; define a tua para não colidir entre produtos |

## Licença

MIT
