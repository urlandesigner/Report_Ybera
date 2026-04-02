import { useCallback, useEffect, useRef, useState } from 'react'
import type { SatisfactionSurveyData } from './types'

export type { SatisfactionSurveyData } from './types'

const defaultLabels = {
  title: 'O que você achou desse informativo mensal?',
  ratingLabel: 'Sua nota (1 a 5):',
  commentLabel: 'Comentário (opcional)',
  commentPlaceholder: 'Conte-nos mais...',
  close: 'Fechar',
  submit: 'Enviar',
  thankYouTitle: 'Obrigado! Sua avaliação foi enviada.',
  thankYouSubtitle: 'O popup será fechado em instantes.',
} as const

export type SatisfactionSurveyLabels = Partial<typeof defaultLabels>

export interface SatisfactionSurveyPopupProps {
  /** Elemento cuja entrada na viewport dispara o popup */
  triggerRef: React.RefObject<HTMLElement | null>
  onSubmit?: (data: SatisfactionSurveyData) => void | Promise<void>
  onClose?: () => void
  /** Sobrescreve textos (ex.: outro idioma ou outro produto) */
  labels?: SatisfactionSurveyLabels
  /** Família de fonte do cartão (default: system-ui) */
  fontFamily?: string
  /** Fundo do círculo do ícone de sucesso */
  successIconBackground?: string
  /** Cor do ícone de sucesso */
  successIconColor?: string
  /** Opções do IntersectionObserver */
  observerOptions?: IntersectionObserverInit
}

const shell: React.CSSProperties = {
  position: 'fixed',
  bottom: 24,
  right: 24,
  zIndex: 50,
  width: 340,
  maxWidth: 'calc(100vw - 48px)',
  borderRadius: 16,
  border: '1px solid #E6E8EC',
  background: '#fff',
  padding: 20,
  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.06)',
}

export function SatisfactionSurveyPopup({
  triggerRef,
  onSubmit,
  onClose,
  labels: labelsProp,
  fontFamily = 'system-ui, sans-serif',
  successIconBackground = '#dcfce7',
  successIconColor = '#166534',
  observerOptions = { threshold: 0.2, rootMargin: '0px' },
}: SatisfactionSurveyPopupProps) {
  const labels = { ...defaultLabels, ...labelsProp }
  const [isVisible, setIsVisible] = useState(false)
  const hasTriggeredRef = useRef(false)
  const [rating, setRating] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const observerOptsRef = useRef(observerOptions)
  observerOptsRef.current = observerOptions

  useEffect(() => {
    const el = triggerRef.current
    if (!el) return

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries
      if (entry?.isIntersecting && !hasTriggeredRef.current) {
        hasTriggeredRef.current = true
        setIsVisible(true)
      }
    }, observerOptsRef.current)

    observer.observe(el)
    return () => observer.disconnect()
  }, [triggerRef])

  const handleClose = useCallback(() => {
    setIsVisible(false)
    onClose?.()
  }, [onClose])

  const handleSubmit = async () => {
    if (rating === null) return
    const data: SatisfactionSurveyData = {
      rating,
      comment: comment.trim(),
      submittedAt: new Date().toISOString(),
    }
    await onSubmit?.(data)
    setSubmitted(true)
  }

  useEffect(() => {
    if (!submitted) return
    const t = setTimeout(() => handleClose(), 2500)
    return () => clearTimeout(t)
  }, [submitted, handleClose])

  if (!isVisible) return null

  const btnBase: React.CSSProperties = {
    borderRadius: 12,
    padding: '8px 16px',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    border: 'none',
    fontFamily,
  }

  return (
    <div
      style={{ ...shell, fontFamily }}
      role="dialog"
      aria-labelledby="survey-title"
      aria-modal="true"
    >
      {submitted ? (
        <div style={{ padding: '16px 0', textAlign: 'center' }} role="status" aria-live="polite">
          <div
            style={{
              display: 'flex',
              width: 48,
              height: 48,
              margin: '0 auto 12px',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              background: successIconBackground,
              color: successIconColor,
            }}
            aria-hidden
          >
            <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#3C3C3C', margin: 0 }}>{labels.thankYouTitle}</p>
          <p style={{ fontSize: 14, color: '#64748b', margin: '8px 0 0' }}>{labels.thankYouSubtitle}</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
            <h3 id="survey-title" style={{ fontSize: 16, fontWeight: 600, color: '#3C3C3C', margin: 0, paddingRight: 24 }}>
              {labels.title}
            </h3>
            <button
              type="button"
              onClick={handleClose}
              style={{
                ...btnBase,
                padding: 4,
                background: 'transparent',
                color: '#64748b',
                flexShrink: 0,
              }}
              aria-label="Fechar"
            >
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 8px' }}>{labels.ratingLabel}</p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }} role="group" aria-label="Nota de 1 a 5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily,
                  background: rating === n ? '#0F131B' : '#F1F5F9',
                  color: rating === n ? '#fff' : '#475569',
                }}
                aria-pressed={rating === n}
                aria-label={`Nota ${n}`}
              >
                {n}
              </button>
            ))}
          </div>

          <label htmlFor="survey-comment" style={{ display: 'block', fontSize: 14, color: '#64748b', marginBottom: 8 }}>
            {labels.commentLabel}
          </label>
          <textarea
            id="survey-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={labels.commentPlaceholder}
            rows={3}
            style={{
              width: '100%',
              borderRadius: 12,
              border: '1px solid #E2E8F0',
              background: '#F8FAFC',
              padding: '10px 12px',
              fontSize: 14,
              color: '#334155',
              fontFamily,
              resize: 'none',
              boxSizing: 'border-box',
            }}
          />

          <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                ...btnBase,
                background: 'transparent',
                color: '#64748b',
              }}
            >
              {labels.close}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={rating === null}
              style={{
                ...btnBase,
                background: '#0F131B',
                color: '#fff',
                opacity: rating === null ? 0.5 : 1,
              }}
            >
              {labels.submit}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
