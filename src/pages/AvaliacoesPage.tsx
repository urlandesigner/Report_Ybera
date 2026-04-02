import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DEFAULT_STORAGE_KEY, getSurveyResponses, type SatisfactionSurveyData } from 'satisfaction-survey-react'
import { ReportPageLayout } from '../components/report'
import { REPORT_SECTION_INNER_CLASS } from '../constants/reportLayout'
import { ArrowLeft, Download, FileJson } from 'lucide-react'

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function AvaliacoesPage() {
  const [responses, setResponses] = useState<SatisfactionSurveyData[]>(() =>
    getSurveyResponses(DEFAULT_STORAGE_KEY)
  )

  const refresh = () => setResponses(getSurveyResponses(DEFAULT_STORAGE_KEY))

  const csvContent = useMemo(() => {
    const header = 'Data;Nota (1-5);Comentário'
    const rows = responses.map((r) => {
      const comment = (r.comment || '').replace(/;/g, ',').replace(/\n/g, ' ')
      return `${formatDate(r.submittedAt)};${r.rating};"${comment}"`
    })
    return [header, ...rows].join('\n')
  }, [responses])

  const exportCsv = () => {
    const filename = `avaliacoes-informativo-${new Date().toISOString().slice(0, 10)}.csv`
    downloadFile('\uFEFF' + csvContent, filename, 'text/csv;charset=utf-8')
  }

  const exportJson = () => {
    const filename = `avaliacoes-informativo-${new Date().toISOString().slice(0, 10)}.json`
    downloadFile(JSON.stringify(responses, null, 2), filename, 'application/json')
  }

  return (
    <ReportPageLayout>
      <div className={REPORT_SECTION_INNER_CLASS} style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#64748b] hover:text-[#0F131B] mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao informativo
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F131B] mb-2">
          Avaliações do informativo mensal
        </h1>
        <p className="text-[#64748b] text-sm sm:text-base mb-6">
          Respostas salvas neste navegador. Use os botões abaixo para exportar.
        </p>

        {responses.length === 0 ? (
          <div className="rounded-2xl border border-[#E6E8EC] bg-white p-8 text-center">
            <p className="text-[#64748b]">Nenhuma avaliação registrada ainda.</p>
            <p className="text-sm text-[#94A3B8] mt-2">
              As avaliações aparecem aqui quando alguém responde à pesquisa ao rolar até a seção &quot;Próximos passos&quot; do informativo.
            </p>
            <button
              type="button"
              onClick={refresh}
              className="mt-4 rounded-xl bg-[#0F131B] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Atualizar
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-sm text-[#64748b]">
                {responses.length} {responses.length === 1 ? 'avaliação' : 'avaliações'}
              </span>
              <button
                type="button"
                onClick={exportCsv}
                className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-medium text-[#334155] hover:bg-[#F8FAFC]"
              >
                <Download className="w-4 h-4" />
                Exportar CSV
              </button>
              <button
                type="button"
                onClick={exportJson}
                className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-medium text-[#334155] hover:bg-[#F8FAFC]"
              >
                <FileJson className="w-4 h-4" />
                Exportar JSON
              </button>
              <button
                type="button"
                onClick={refresh}
                className="text-sm text-[#64748b] hover:text-[#0F131B] underline"
              >
                Atualizar lista
              </button>
            </div>

            <div className="rounded-2xl border border-[#E6E8EC] bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#E6E8EC] bg-[#F8FAFC]">
                      <th className="px-4 py-3 font-semibold text-[#334155]">Data</th>
                      <th className="px-4 py-3 font-semibold text-[#334155]">Nota</th>
                      <th className="px-4 py-3 font-semibold text-[#334155]">Comentário</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...responses].reverse().map((r, i) => (
                      <tr key={i} className="border-b border-[#F1F5F9] last:border-0">
                        <td className="px-4 py-3 text-[#64748b] whitespace-nowrap">
                          {formatDate(r.submittedAt)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex w-8 h-8 items-center justify-center rounded-lg bg-[#0F131B] text-white font-semibold text-sm">
                            {r.rating}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#334155] max-w-md">
                          {r.comment || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </ReportPageLayout>
  )
}
