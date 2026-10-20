import { useRef, useState } from 'react'
import type { LessonSummary } from '../lessons.ts'

type LessonPathProps = {
  courseTitle: string
  lessons: LessonSummary[]
  onOpen: (lesson: number) => void
  blockedMessage?: string
  onBack: () => void
}

const ROW_HEIGHT = 190
const TOP = 100
const VIEW_WIDTH = 360
// Los nodos se alternan a la izquierda y a la derecha
const xPercent = (index: number) => (index % 2 === 0 ? 28 : 72)

function AtomIcon() {
  const orbit = 'M-26,0 a26,10 0 1,0 52,0 a26,10 0 1,0 -52,0'
  return (
    <svg viewBox="-40 -40 80 80" className="h-14 w-14" aria-hidden="true">
      {[0, 60, 120].map((angle) => (
        <g key={angle} transform={`rotate(${angle})`}>
          <ellipse rx="26" ry="10" fill="none" stroke="white" strokeOpacity="0.85" strokeWidth="2" />
          <circle r="3.2" fill="#fde68a">
            <animateMotion dur={`${2.4 + angle / 120}s`} repeatCount="indefinite" path={orbit} />
          </circle>
        </g>
      ))}
      <circle className="lp-nucleus" r="6" fill="white" />
    </svg>
  )
}

function FlaskIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden="true">
      <path d="M26 6h12M28 6v16L12 52a5 5 0 0 0 4.4 7.4h31.2A5 5 0 0 0 52 52L36 22V6" fill="none" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 40h26l7 12a5 5 0 0 1-4.4 7.4H16.4A5 5 0 0 1 12 52z" fill="#cbd5e1" />
      <circle className="lp-bubble lp-bubble-1" cx="28" cy="48" r="2.6" fill="white" />
      <circle className="lp-bubble lp-bubble-2" cx="37" cy="50" r="2" fill="white" />
      <circle className="lp-bubble lp-bubble-3" cx="32" cy="52" r="1.6" fill="white" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-12 w-12" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  )
}

function LockBadge() {
  return (
    <span className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-500 shadow">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </svg>
    </span>
  )
}

function Bubble({ text, tone }: { text: string; tone: 'teal' | 'slate' }) {
  const colors = tone === 'teal' ? 'border-teal-600 text-teal-700' : 'border-slate-300 text-ink/60'
  return (
    <div className={`lp-float absolute -top-[58px] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-xl border-2 bg-white px-4 py-1.5 text-sm font-bold tracking-wide shadow-sm ${colors}`}>
      {text}
      <span className={`absolute -bottom-[7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 bg-white ${colors}`} />
    </div>
  )
}

export function LessonPath({ courseTitle, lessons, onOpen, blockedMessage, onBack }: LessonPathProps) {
  const [lockedTip, setLockedTip] = useState<{ lesson: number; key: number } | null>(null)
  const tipCount = useRef(0)

  const showLocked = (lesson: number) => {
    tipCount.current += 1
    const key = tipCount.current
    setLockedTip({ lesson, key })
    window.setTimeout(() => setLockedTip((current) => (current?.key === key ? null : current)), 2200)
  }

  const approved = lessons.filter((lesson) => lesson.estado === 'aprobada').length
  const total = lessons.length
  const progress = total > 0 ? Math.max(6, Math.round((approved / total) * 100)) : 6
  const current = lessons.find((lesson) => lesson.estado === 'disponible')?.numero

  // Sin lecciones (cargando o sin sesión) se muestra un nodo de ejemplo con el aviso
  const nodes = lessons.length > 0 ? lessons : null
  const count = nodes?.length ?? 1
  const height = TOP + (count - 1) * ROW_HEIGHT + 120
  const point = (index: number) => ({ x: (xPercent(index) / 100) * VIEW_WIDTH, y: TOP + index * ROW_HEIGHT })

  return (
    <section className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-4xl flex-col px-6 pb-10 pt-3 sm:px-10">
      <button type="button" className="mb-2 w-fit text-sm text-ink/75 hover:text-teal-800" onClick={onBack}>
        ← Volver
      </button>

      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">Curso</p>
        <h1 className="mt-1 font-display text-4xl font-semibold text-ink sm:text-5xl">{courseTitle}</h1>
        <div className="mx-auto mt-5 flex w-full max-w-xs items-center gap-3">
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-teal-100">
            <div className="h-full rounded-full bg-teal-600 transition-[width] duration-700" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs font-semibold text-ink/75">{approved} / {total}</span>
        </div>
        {nodes && approved === total && (
          <p className="mt-3 text-sm font-semibold text-emerald-700">¡Completaste todas las lecciones del curso!</p>
        )}
      </div>

      <div className="relative mx-auto mt-8 w-full max-w-[360px]" style={{ height }}>
        <div className="lp-bg-bubble lp-bg-bubble-1" aria-hidden="true" />
        <div className="lp-bg-bubble lp-bg-bubble-2" aria-hidden="true" />
        <div className="lp-bg-bubble lp-bg-bubble-3" aria-hidden="true" />

        <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${VIEW_WIDTH} ${height}`} preserveAspectRatio="none" aria-hidden="true">
          {Array.from({ length: count - 1 }, (_, index) => {
            const from = point(index)
            const to = point(index + 1)
            const middle = (from.y + to.y) / 2
            const done = nodes?.[index].estado === 'aprobada'
            return (
              <path
                key={index}
                className={done ? undefined : 'lp-dash'}
                d={`M${from.x} ${from.y} C ${from.x} ${middle}, ${to.x} ${middle}, ${to.x} ${to.y}`}
                fill="none"
                stroke={done ? '#14b8a6' : '#cbd5e1'}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={done ? undefined : '4 14'}
                vectorEffect="non-scaling-stroke"
              />
            )
          })}
        </svg>

        {(nodes ?? [null]).map((lesson, index) => {
          const left = index % 2 === 0
          const state = lesson?.estado ?? 'disponible'
          const number = lesson?.numero ?? 1
          const isCurrent = lesson ? number === current : true
          const tipShown = lockedTip?.lesson === number

          let bubble: { text: string; tone: 'teal' | 'slate' } | null = null
          if (!lesson) bubble = { text: blockedMessage ?? 'Cargando…', tone: 'teal' }
          else if (tipShown) bubble = { text: `Aprueba la lección ${number - 1}`, tone: 'slate' }
          else if (isCurrent) bubble = { text: lesson.mejor_puntaje === null ? 'EMPEZAR' : 'CONTINUAR', tone: 'teal' }

          const buttonClass = {
            aprobada: 'border-emerald-700 bg-emerald-500 hover:bg-emerald-400',
            disponible: 'border-teal-800 bg-teal-600 hover:bg-teal-500',
            bloqueada: 'border-slate-400 bg-slate-300',
          }[state]

          return (
            <div key={number}>
              <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${xPercent(index)}%`, top: point(index).y }}>
                {bubble && <Bubble text={bubble.text} tone={bubble.tone} />}
                {state === 'disponible' && lesson && <span className="lp-pulse absolute inset-0 rounded-full bg-teal-400/50" aria-hidden="true" />}
                <button
                  key={tipShown ? lockedTip?.key : 'idle'}
                  type="button"
                  aria-label={lesson ? `Lección ${number}: ${lesson.titulo} (${state})` : 'Lección 1'}
                  onClick={() => {
                    if (!lesson) return
                    if (state === 'bloqueada') showLocked(number)
                    else onOpen(number)
                  }}
                  className={`relative flex h-24 w-24 items-center justify-center rounded-full border-b-[8px] transition ${buttonClass} ${
                    state !== 'bloqueada' ? 'active:translate-y-1.5 active:border-b-2' : ''
                  } ${tipShown ? 'lp-shake' : ''}`}
                >
                  {state === 'aprobada' ? <CheckIcon /> : state === 'bloqueada' ? <FlaskIcon /> : <AtomIcon />}
                  {state === 'bloqueada' && <LockBadge />}
                </button>
              </div>

              <div
                className={`absolute -translate-y-1/2 ${left ? 'text-left' : 'text-right'}`}
                style={left
                  ? { left: `calc(${xPercent(index)}% + 60px)`, right: 0, top: point(index).y }
                  : { right: `calc(${100 - xPercent(index)}% + 60px)`, left: 0, top: point(index).y }}
              >
                <p className={`text-xs font-semibold uppercase tracking-wider ${state === 'bloqueada' ? 'text-ink/60' : 'text-teal-700'}`}>
                  Lección {number}
                </p>
                <p className={`mt-0.5 font-display text-lg font-semibold leading-tight ${state === 'bloqueada' ? 'text-ink/60' : 'text-ink'}`}>
                  {lesson?.titulo ?? 'Primera lección'}
                </p>
                {lesson?.estado === 'aprobada' && lesson.mejor_puntaje !== null && (
                  <p className="mt-1 text-xs font-semibold text-emerald-700">Aprobada · {lesson.mejor_puntaje} %</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
