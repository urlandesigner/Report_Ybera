import { Routes, Route } from 'react-router-dom'
import { MonthlyTechReport } from './pages/MonthlyTechReport'
import { AvaliacoesPage } from './pages/AvaliacoesPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MonthlyTechReport />} />
      <Route path="/report" element={<MonthlyTechReport />} />
      <Route path="/avaliacoes" element={<AvaliacoesPage />} />
    </Routes>
  )
}

export default App
