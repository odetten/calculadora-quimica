import { useEffect, useState } from 'react'
import { apiRequest } from '../api.ts'

export type Course = { id: number; tipo: 'problemas' | 'memorama'; titulo: string; descripcion: string; total: number; resueltos: number }
type Problem = { id: number; enunciado: string; opciones: string[] | null; correcto: boolean; solucion?: string }
type MemoryCard = { key: string; problemId: number; text: string }

function shuffled<T>(items: T[]): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[other]] = [result[other], result[index]]
  }
  return result
}

export function CoursePractice({ course, onBack }: { course: Course; onBack: () => void }) {
  const [problems, setProblems] = useState<Problem[] | null>(null)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [feedback, setFeedback] = useState<Record<number, string>>({})
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [openCards, setOpenCards] = useState<MemoryCard[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    apiRequest<{ problems: Problem[] }>(`/courses/${course.id}/problems`)
      .then((result) => {
        if (cancelled) return
        setProblems(result.problems)
        if (course.tipo === 'memorama') {
          const cards = result.problems.flatMap((problem) => [
            { key: `${problem.id}-symbol`, problemId: problem.id, text: problem.enunciado },
            { key: `${problem.id}-name`, problemId: problem.id, text: problem.solucion ?? '' },
          ])
          setMemoryCards(shuffled(cards))
        }
      })
      .catch((requestError: unknown) => {
        if (cancelled) return
        setProblems([])
        setError(requestError instanceof Error ? requestError.message : 'No se pudo abrir el curso.')
      })
    return () => { cancelled = true }
  }, [course.id, course.tipo])

  const list = problems ?? []
  const done = list.filter((problem) => problem.correcto).length

  const answerProblem = async (problem: Problem) => {
    setError('')
    try {
      const result = await apiRequest<{ correcto: boolean; intentos: number; solucion?: string }>(`/problems/${problem.id}/answer`, {
        method: 'POST',
        body: JSON.stringify({ answer: answers[problem.id] ?? '' }),
      })
      setFeedback((previous) => ({
        ...previous,
        [problem.id]: result.correcto ? 'Correcto. ¡Buen trabajo!' : `Aún no. Intento ${result.intentos}.`,
      }))
      if (result.correcto) {
        setProblems((previous) => (previous ?? []).map((item) => item.id === problem.id ? { ...item, correcto: true } : item))
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo revisar la respuesta.')
    }
  }

  const selectMemoryCard = async (card: MemoryCard) => {
    if (matched.includes(card.problemId) || openCards.some((item) => item.key === card.key) || openCards.length === 2) return
    const nextOpen = [...openCards, card]
    setOpenCards(nextOpen)
    if (nextOpen.length !== 2) return
    if (nextOpen[0].problemId === nextOpen[1].problemId) {
      const nextMatched = [...matched, card.problemId]
      setMatched(nextMatched)
      setOpenCards([])
      if (nextMatched.length === list.length) {
        try {
          await apiRequest(`/courses/${course.id}/complete`, { method: 'POST' })
          setProblems((previous) => (previous ?? []).map((item) => ({ ...item, correcto: true })))
        } catch (requestError) {
          setError(requestError instanceof Error ? requestError.message : 'No se pudo guardar el progreso.')
        }
      }
    } else {
      window.setTimeout(() => setOpenCards([]), 800)
    }
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-4xl flex-col px-6 pb-10 pt-3 sm:px-10">
      <button type="button" className="mb-2 w-fit text-sm text-slate-600 hover:text-teal-800" onClick={onBack}>
        ← Volver
      </button>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">{course.tipo === 'memorama' ? 'Memorama' : 'Práctica'}</p>
          <h1 className="mt-1 font-display text-4xl font-semibold text-slate-950">{course.titulo}</h1>
        </div>
        <p className="text-sm text-slate-600">{done} / {course.total} completados</p>
      </div>
      <p className="mt-2 text-sm text-slate-600">{course.descripcion}</p>

      {error && <p className="mt-3 text-sm text-rose-700" role="alert">{error}</p>}
      {problems === null && !error && <p className="mt-6 text-sm text-slate-600">Cargando…</p>}

      {course.tipo === 'memorama' ? (
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {memoryCards.map((card) => {
            const visible = matched.includes(card.problemId) || openCards.some((item) => item.key === card.key)
            return (
              <button
                key={card.key}
                type="button"
                className={`min-h-20 rounded-lg border px-3 py-2 text-sm font-medium transition ${visible ? 'border-teal-400 bg-teal-50 text-slate-900' : 'border-slate-300 bg-white text-slate-500 hover:border-teal-400'}`}
                onClick={() => selectMemoryCard(card)}
              >
                {visible ? card.text : '?'}
              </button>
            )
          })}
        </div>
      ) : (
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {list.map((problem, index) => (
            <article key={problem.id} className="border-t border-slate-200 py-3">
              <p className="text-sm font-medium text-slate-800">{index + 1}. {problem.enunciado}</p>
              {problem.opciones ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {problem.opciones.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`rounded-lg border px-3 py-2 text-sm ${answers[problem.id] === option ? 'border-teal-600 bg-teal-50' : 'border-slate-300 bg-white'}`}
                      onClick={() => setAnswers((previous) => ({ ...previous, [problem.id]: option }))}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  value={answers[problem.id] ?? ''}
                  onChange={(event) => setAnswers((previous) => ({ ...previous, [problem.id]: event.target.value }))}
                  placeholder="Escribe tu respuesta"
                  maxLength={300}
                />
              )}
              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  className="text-sm font-semibold text-teal-800 disabled:text-slate-400"
                  disabled={!answers[problem.id] || problem.correcto}
                  onClick={() => answerProblem(problem)}
                >
                  {problem.correcto ? 'Resuelto' : 'Comprobar'}
                </button>
                {feedback[problem.id] && <span className={`text-sm ${problem.correcto ? 'text-emerald-700' : 'text-amber-800'}`}>{feedback[problem.id]}</span>}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
