import { useCallback, useEffect, useRef, useState } from 'react'
import {
  SatisfactionSurveyPopup,
  DEFAULT_STORAGE_KEY,
  saveSurveyToLocalStorage,
  type SatisfactionSurveyData,
} from 'satisfaction-survey-react'

const SURVEY_SCROLL_ARM_PX = 80

async function submitSurveyWithApiFirst(data: SatisfactionSurveyData): Promise<void> {
  const payload = {
    rating: data.rating,
    comment: data.comment,
    submittedAt: data.submittedAt,
  }

  try {
    const res = await fetch('/api/survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
  } catch (e) {
    console.warn('[survey] API request failed; response will rely on localStorage', e)
  } finally {
    saveSurveyToLocalStorage(data, DEFAULT_STORAGE_KEY)
  }
}

function useSurveyScrollArmed() {
  const [isArmed, setIsArmed] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.scrollY >= SURVEY_SCROLL_ARM_PX
  })

  useEffect(() => {
    if (isArmed) return

    const armAfterScroll = () => {
      if (window.scrollY >= SURVEY_SCROLL_ARM_PX) {
        setIsArmed(true)
      }
    }

    armAfterScroll()
    window.addEventListener('scroll', armAfterScroll, { passive: true })
    return () => window.removeEventListener('scroll', armAfterScroll)
  }, [isArmed])

  return isArmed
}

export default function SurveyExperience() {
  const surveyTriggerRef = useRef<HTMLDivElement>(null)
  const onSurveySubmit = useCallback((data: SatisfactionSurveyData) => submitSurveyWithApiFirst(data), [])
  const isSurveyArmed = useSurveyScrollArmed()

  return (
    <>
      <div ref={surveyTriggerRef} className="h-px w-full" aria-hidden />
      {isSurveyArmed ? (
        <SatisfactionSurveyPopup
          triggerRef={surveyTriggerRef}
          onSubmit={onSurveySubmit}
          observerOptions={{ threshold: 0, rootMargin: '0px 0px 360px 0px' }}
        />
      ) : null}
    </>
  )
}
