import { useCallback, useRef } from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import {
  SatisfactionSurveyPopup,
  DEFAULT_STORAGE_KEY,
  saveSurveyToLocalStorage,
  type SatisfactionSurveyData,
} from 'satisfaction-survey-react'
import { MonthlyTechReport } from './pages/MonthlyTechReport'
import { getLatestReport } from './data/reportRegistry'

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

const latest = getLatestReport()
const defaultReportPath = `/report/${latest.year}/${latest.month}`

function App() {
  const surveyTriggerRef = useRef<HTMLDivElement>(null)
  const onSurveySubmit = useCallback((data: SatisfactionSurveyData) => submitSurveyWithApiFirst(data), [])

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to={defaultReportPath} replace />} />
        <Route path="/report" element={<Navigate to={defaultReportPath} replace />} />
        <Route path="/report/:year/:month" element={<MonthlyTechReport />} />
      </Routes>
      {/* Sentinel no fim do fluxo: o popup observa este elemento (IntersectionObserver). */}
      <div ref={surveyTriggerRef} className="h-px w-full" aria-hidden />
      <SatisfactionSurveyPopup triggerRef={surveyTriggerRef} onSubmit={onSurveySubmit} />
    </>
  )
}

export default App
