import { Suspense, lazy } from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import { MonthlyTechReport } from './pages/MonthlyTechReport'
import { getLatestReport } from './data/reportRegistry'
import { SURVEY_ENABLED } from './features/survey/config'

const latest = getLatestReport()
const defaultReportPath = `/report/${latest.year}/${latest.month}`

const SurveyExperience = lazy(() => import('./features/survey/SurveyExperience'))

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to={defaultReportPath} replace />} />
        <Route path="/report" element={<Navigate to={defaultReportPath} replace />} />
        <Route path="/report/:year/:month" element={<MonthlyTechReport />} />
      </Routes>
      {SURVEY_ENABLED ? (
        <Suspense fallback={null}>
          <SurveyExperience />
        </Suspense>
      ) : null}
    </>
  )
}

export default App
