import { useEffect, useState, type FormEvent } from 'react'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')
const TOKEN_KEY = 'quimica-token'

type User = { id: number; nombre: string; email: string; nivel: string }
type Course = { id: number; tipo: 'problemas' | 'memorama'; titulo: string; descripcion: string; total: number; resueltos: number }
type Problem = { id: number; enunciado: string; opciones: string[] | null; correcto: boolean; solucion?: string }
type HistoryItem = { id: number; ecuacion: string; resultado: string; fecha: string }
type HistoryDetail = HistoryItem & { explicacion: string | null; aplicaciones: string | null }
type MemoryCard = { key: string; problemId: number; text: string }

async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const response = await fetch(`${API_URL}${path}`, { ...init, headers })
  if (response.status === 204) return undefined as T
  const payload = await response.json().catch(() => null) as { detail?: unknown } | null
  if (!response.ok) {
    throw new Error(typeof payload?.detail === 'string' ? payload.detail : `Error del servidor (${response.status}).`)
  }
  return payload as T
}

function shuffled<T>(items: T[]): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[other]] = [result[other], result[index]]
  }
  return result
}

export function LearningHub() {
  const [user, setUser] = useState<User | null>(null)
  const [authChecked, setAuthChecked] = useState(() => !localStorage.getItem(TOKEN_KEY))
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [view, setView] = useState<'courses' | 'history'>('courses')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [level, setLevel] = useState('prepa')
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [problems, setProblems] = useState<Problem[]>([])
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [historyDetails, setHistoryDetails] = useState<Record<number, HistoryDetail>>({})
  const [expandedHistoryId, setExpandedHistoryId] = useState<number | null>(null)
  const [loadingHistoryId, setLoadingHistoryId] = useState<number | null>(null)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [feedback, setFeedback] = useState<Record<number, string>>({})
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [openCards, setOpenCards] = useState<MemoryCard[]>([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) return
    apiRequest<User>('/auth/me')
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setAuthChecked(true))
  }, [])

  useEffect(() => {
    if (!user) return
    apiRequest<Course[]>('/courses')
      .then(setCourses)
      .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : 'No se pudieron cargar los cursos.'))
  }, [user])

  useEffect(() => {
    if (!user || view !== 'history') return
    const loadHistory = () => apiRequest<HistoryItem[]>('/history')
      .then(setHistory)
      .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : 'No se pudo cargar el historial.'))
    const onHistoryUpdated = () => { void loadHistory() }
    void loadHistory()
    window.addEventListener('chemistry-history-updated', onHistoryUpdated)
    return () => window.removeEventListener('chemistry-history-updated', onHistoryUpdated)
  }, [user, view])

  const openCourse = async (course: Course) => {
    setError('')
    setSelectedCourse(course)
    setProblems([])
    setFeedback({})
    setMatched([])
    setOpenCards([])
    try {
      const result = await apiRequest<{ problems: Problem[] }>(`/courses/${course.id}/problems`)
      setProblems(result.problems)
      if (course.tipo === 'memorama') {
        const cards = result.problems.flatMap((problem) => [
          { key: `${problem.id}-symbol`, problemId: problem.id, text: problem.enunciado },
          { key: `${problem.id}-name`, problemId: problem.id, text: problem.solucion ?? '' },
        ])
        setMemoryCards(shuffled(cards))
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo abrir el curso.')
    }
  }

  const submitAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const path = mode === 'login' ? '/auth/login' : '/auth/register'
      const payload = mode === 'login' ? { email, password } : { nombre: name, email, password, nivel: level }
      const result = await apiRequest<{ token: string; user: User }>(path, { method: 'POST', body: JSON.stringify(payload) })
      localStorage.setItem(TOKEN_KEY, result.token)
      setUser(result.user)
      setPassword('')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo iniciar sesión.')
    } finally {
      setBusy(false)
    }
  }

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
        setProblems((previous) => previous.map((item) => item.id === problem.id ? { ...item, correcto: true } : item))
        setCourses((previous) => previous.map((course) => course.id === selectedCourse?.id
          ? { ...course, resueltos: Math.min(course.total, course.resueltos + (problem.correcto ? 0 : 1)) }
          : course))
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
      if (nextMatched.length === problems.length && selectedCourse) {
        try {
          await apiRequest(`/courses/${selectedCourse.id}/complete`, { method: 'POST' })
          setCourses((previous) => previous.map((course) => course.id === selectedCourse.id ? { ...course, resueltos: course.total } : course))
        } catch (requestError) {
          setError(requestError instanceof Error ? requestError.message : 'No se pudo guardar el progreso.')
        }
      }
    } else {
      window.setTimeout(() => setOpenCards([]), 800)
    }
  }

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

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
    setCourses([])
    setHistory([])
    setSelectedCourse(null)
    setView('courses')
  }

  return (
    <section id="servicios" className="mx-auto w-full max-w-[1440px] scroll-mt-20 px-6 pt-5 sm:px-10" aria-label="Cuenta y aprendizaje">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Química · Aprendizaje</p>
          {user && <p className="mt-1 text-sm text-slate-600">{user.nombre} · nivel {user.nivel}</p>}
        </div>
        {user && (
          <div className="flex items-center gap-2">
            <button type="button" className="keyboard-toggle px-3 py-2 text-sm" onClick={() => { setView('courses'); setSelectedCourse(null); setError('') }}>Cursos</button>
            <button type="button" className="keyboard-toggle px-3 py-2 text-sm" onClick={() => { setView('history'); setSelectedCourse(null); setError('') }}>Historial</button>
            <button type="button" className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-white" onClick={logout}>Cerrar sesión</button>
          </div>
        )}
      </div>

      {error && <p className="mt-3 text-sm text-rose-700" role="alert">{error}</p>}

      {!authChecked ? <p className="py-5 text-sm text-slate-600">Verificando sesión…</p> : !user ? (
        <div className="grid gap-6 border-b border-slate-200 py-5 md:grid-cols-[minmax(0,1fr)_minmax(280px,420px)]">
          <div className="self-center">
            <h2 className="font-display text-2xl font-semibold text-slate-900">Guarda tu avance</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">Inicia sesión para practicar cursos por nivel y conservar tus ecuaciones. El balanceador sigue disponible sin cuenta.</p>
          </div>
          <form className="grid gap-3" onSubmit={submitAuth}>
            <div className="flex gap-4 text-sm">
              <button type="button" className={mode === 'login' ? 'font-semibold text-teal-800' : 'text-slate-500'} onClick={() => { setMode('login'); setError('') }}>Iniciar sesión</button>
              <button type="button" className={mode === 'register' ? 'font-semibold text-teal-800' : 'text-slate-500'} onClick={() => { setMode('register'); setError('') }}>Crear cuenta</button>
            </div>
            {mode === 'register' && <input className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={name} onChange={(event) => setName(event.target.value)} placeholder="Nombre" minLength={2} maxLength={80} required />}
            <input className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Correo electrónico" maxLength={120} required />
            <input className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Contraseña (mínimo 8 caracteres)" minLength={mode === 'register' ? 8 : 1} maxLength={72} required />
            {mode === 'register' && <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={level} onChange={(event) => setLevel(event.target.value)}><option value="basico">Básico</option><option value="prepa">Prepa</option><option value="universidad">Universidad</option></select>}
            <button type="submit" className="button-primary w-fit disabled:opacity-60" disabled={busy}>{busy ? 'Conectando…' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}</button>
          </form>
        </div>
      ) : view === 'history' ? (
        <div className="border-b border-slate-200 py-5">
          <h2 className="font-display text-xl font-semibold text-slate-900">Ecuaciones guardadas</h2>
          {history.length ? <ul className="mt-3 divide-y divide-slate-200">{history.map((item) => {
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
          })}</ul> : <p className="mt-3 text-sm text-slate-600">Aún no hay ecuaciones guardadas.</p>}
        </div>
      ) : selectedCourse ? (
        <div className="border-b border-slate-200 py-5">
          <button type="button" className="keyboard-toggle text-sm" onClick={() => setSelectedCourse(null)}>← Todos los cursos</button>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-2"><div><p className="text-xs uppercase tracking-wider text-teal-700">{selectedCourse.tipo === 'memorama' ? 'Memorama' : 'Práctica'}</p><h2 className="font-display text-2xl font-semibold text-slate-900">{selectedCourse.titulo}</h2></div><p className="text-sm text-slate-600">{selectedCourse.resueltos} / {selectedCourse.total} completados</p></div>
          {selectedCourse.tipo === 'memorama' ? <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">{memoryCards.map((card) => { const visible = matched.includes(card.problemId) || openCards.some((item) => item.key === card.key); return <button key={card.key} type="button" className={`min-h-20 rounded-lg border px-3 py-2 text-sm font-medium transition ${visible ? 'border-teal-400 bg-teal-50 text-slate-900' : 'border-slate-300 bg-white text-slate-500 hover:border-teal-400'}`} onClick={() => selectMemoryCard(card)}>{visible ? card.text : '?'}</button> })}</div> : <div className="mt-4 grid gap-3 md:grid-cols-2">{problems.map((problem, index) => <article key={problem.id} className="border-t border-slate-200 py-3"><p className="text-sm font-medium text-slate-800">{index + 1}. {problem.enunciado}</p>{problem.opciones ? <div className="mt-2 flex flex-wrap gap-2">{problem.opciones.map((option) => <button key={option} type="button" className={`rounded-lg border px-3 py-2 text-sm ${answers[problem.id] === option ? 'border-teal-600 bg-teal-50' : 'border-slate-300 bg-white'}`} onClick={() => setAnswers((previous) => ({ ...previous, [problem.id]: option }))}>{option}</button>)}</div> : <input className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={answers[problem.id] ?? ''} onChange={(event) => setAnswers((previous) => ({ ...previous, [problem.id]: event.target.value }))} placeholder="Escribe tu respuesta" maxLength={300} />}
              <div className="mt-2 flex items-center gap-3"><button type="button" className="text-sm font-semibold text-teal-800 disabled:text-slate-400" disabled={!answers[problem.id] || problem.correcto} onClick={() => answerProblem(problem)}>{problem.correcto ? 'Resuelto' : 'Comprobar'}</button>{feedback[problem.id] && <span className={`text-sm ${problem.correcto ? 'text-emerald-700' : 'text-amber-800'}`}>{feedback[problem.id]}</span>}</div>
            </article>)}</div>}
        </div>
      ) : (
        <div className="border-b border-slate-200 py-5">
          <h2 className="font-display text-xl font-semibold text-slate-900">Cursos de {user.nivel}</h2>
          <div className="mt-3 grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">{courses.map((course) => <button key={course.id} type="button" className="border-t border-slate-200 py-4 text-left transition hover:bg-white/60" onClick={() => openCourse(course)}><span className="text-xs font-semibold uppercase tracking-wider text-teal-700">{course.tipo === 'memorama' ? 'Memorama' : 'Ejercicios'}</span><span className="mt-1 block font-semibold text-slate-900">{course.titulo}</span><span className="mt-1 block text-sm leading-5 text-slate-600">{course.descripcion}</span><span className="mt-2 block text-xs text-slate-500">{course.resueltos} de {course.total} resueltos</span></button>)}</div>
          {courses.length === 0 && <p className="mt-3 text-sm text-slate-600">No hay cursos para este nivel.</p>}
        </div>
      )}
    </section>
  )
}