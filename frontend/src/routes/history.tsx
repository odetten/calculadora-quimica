import { useEffect, useState } from 'react'
import { apiRequest } from '../api.ts'

type HistoryItem = { id: number; ecuacion: string; resultado: string; fecha: string }
type HistoryDetail = HistoryItem & { explicacion: string | null; aplicaciones: string | null }

export function HistoryPage({ onBack }: { onBack: () => void }) {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [historyDetails, setHistoryDetails] = useState<Record<number, HistoryDetail>>({})
  const [expandedHistoryId, setExpandedHistoryId] = useState<number | null>(null)
  const [loadingHistoryId, setLoadingHistoryId] = useState<number | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadHistory = () => apiRequest<HistoryItem[]>('/history')
      .then(setHistory)
      .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : 'No se pudo cargar el historial.'))
    const onHistoryUpdated = () => { void loadHistory() }
    void loadHistory()
    window.addEventListener('chemistry-history-updated', onHistoryUpdated)
    return () => window.removeEventListener('chemistry-history-updated', onHistoryUpdated)
  }, [])

  const deleteHistoryItem = async (id: number) => {
    try {
      await apiRequest(`/history/${id}`, { method: 'DELETE' })
      setHistory((previous) => previous.filter((item) => item.id !== id))
      setHistoryDetails((previous) => {
        const next = { ...previous }
        delete next[id]
        return next
      })
      setExpandedHistoryId((previous) => previous === id ? null : previous)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo borrar el registro.')
    }
  }

  const toggleHistoryDetails = async (id: number) => {
    if (expandedHistoryId === id) {
      setExpandedHistoryId(null)
      return
    }
    setExpandedHistoryId(id)
    if (historyDetails[id]) return

    setLoadingHistoryId(id)
    setError('')
    try {
      const detail = await apiRequest<HistoryDetail>(`/history/${id}`)
      setHistoryDetails((previous) => ({ ...previous, [id]: detail }))
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo cargar la respuesta de IA.')
    } finally {
      setLoadingHistoryId(null)
    }
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-4xl flex-col px-6 pb-10 pt-3 sm:px-10">
      <button type="button" className="mb-2 w-fit text-sm text-slate-600 hover:text-teal-800" onClick={onBack}>
        ← Volver
      </button>
      <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">Historial</p>
      <h1 className="mt-1 font-display text-4xl font-semibold text-slate-950">Ecuaciones guardadas</h1>

      {error && <p className="mt-3 text-sm text-rose-700" role="alert">{error}</p>}

      {history.length ? <ul className="mt-4 divide-y divide-slate-200">{history.map((item) => {
        const detail = historyDetails[item.id]
        const expanded = expandedHistoryId === item.id
        return (
          <li key={item.id} className="py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-600">{item.ecuacion}</p>
                <p className="font-display text-lg text-slate-900">{item.resultado}</p>
                <time className="text-xs text-slate-500">{new Date(item.fecha).toLocaleString()}</time>
              </div>
              <div className="flex items-center gap-4">
                <button type="button" className="text-sm font-semibold text-teal-800 hover:underline" onClick={() => toggleHistoryDetails(item.id)} aria-expanded={expanded} aria-controls={`history-detail-${item.id}`}>
                  {expanded ? 'Ocultar respuesta' : 'Ver respuesta de IA'}
                </button>
                <button type="button" className="text-sm text-rose-700 hover:underline" onClick={() => deleteHistoryItem(item.id)}>Eliminar</button>
              </div>
            </div>
            {expanded && <div id={`history-detail-${item.id}`} className="mt-4 border-l-2 border-teal-200 pl-4">
              {loadingHistoryId === item.id ? <p className="text-sm text-slate-600">Cargando respuesta…</p> : detail && <div className="grid gap-4 md:grid-cols-2">
                <section>
                  <h3 className="text-sm font-semibold text-slate-800">Desglose paso a paso</h3>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">{detail.explicacion || 'No se guardó una explicación para esta ecuación.'}</p>
                </section>
                <section>
                  <h3 className="text-sm font-semibold text-slate-800">Aplicaciones de los elementos</h3>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">{detail.aplicaciones || 'No se guardaron aplicaciones para esta ecuación.'}</p>
                </section>
              </div>}
            </div>}
          </li>
        )
      })}</ul> : <p className="mt-4 text-sm text-slate-600">Aún no hay ecuaciones guardadas.</p>}
    </section>
  )
}
