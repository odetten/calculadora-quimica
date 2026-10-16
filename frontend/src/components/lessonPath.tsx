import { useState } from 'react'

type LessonPathProps = {
  courseTitle: string
  lessonTitle: string
  lessonTopic: string
  done?: number
  total?: number
  onStart?: () => void
  blockedMessage?: string
  onBack: () => void
}

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

export function LessonPath({ courseTitle, lessonTitle, lessonTopic, done = 0, total = 0, onStart, blockedMessage, onBack }: LessonPathProps) {
  const [tip, setTip] = useState<'none' | 'lesson' | 'soon'>('none')
  const [shakeKey, setShakeKey] = useState(0)

  const showTip = (which: 'lesson' | 'soon') => {
    setTip(which)
    if (which === 'soon') setShakeKey((k) => k + 1)
    window.setTimeout(() => setTip('none'), 2200)
  }

  const handleLesson = () => {
    if (onStart) onStart()
    else if (!blockedMessage) showTip('lesson')
  }

  const progress = total > 0 ? Math.max(6, Math.round((done / total) * 100)) : 6

  return (
    <section className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-4xl flex-col px-6 pb-10 pt-3 sm:px-10">
      <button type="button" className="mb-2 w-fit text-sm text-slate-600 hover:text-teal-800" onClick={onBack}>
        ← Volver
      </button>

      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">Curso</p>
        <h1 className="mt-1 font-display text-4xl font-semibold text-slate-950 sm:text-5xl">{courseTitle}</h1>
        <div className="mx-auto mt-5 flex w-full max-w-xs items-center gap-3">
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-teal-100">
            <div className="h-full rounded-full bg-teal-600 transition-[width] duration-700" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs font-semibold text-slate-600">{done} / {total}</span>
        </div>
      </div>

      <div className="relative mx-auto mt-4 h-[440px] w-full max-w-[360px]">
        <div className="lp-bg-bubble lp-bg-bubble-1" aria-hidden="true" />
        <div className="lp-bg-bubble lp-bg-bubble-2" aria-hidden="true" />
        <div className="lp-bg-bubble lp-bg-bubble-3" aria-hidden="true" />

        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 360 460" preserveAspectRatio="none" aria-hidden="true">
          <path
            className="lp-dash"
            d="M90 150 C 90 240, 270 210, 270 300"
            fill="none"
            stroke="#5eead4"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="4 14"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="absolute left-[25%] top-[90px] -translate-x-1/2">
          <div className="lp-float absolute -top-[58px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl border-2 border-teal-600 bg-white px-4 py-1.5 text-sm font-bold tracking-wide text-teal-700 shadow-sm">
            {tip === 'lesson' ? 'En construcción' : (blockedMessage ?? 'EMPEZAR')}
            <span className="absolute -bottom-[7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-teal-600 bg-white" />
          </div>
          <span className="lp-pulse absolute inset-0 rounded-full bg-teal-400/50" aria-hidden="true" />
          <button
            type="button"
            aria-label={`${lessonTitle}: ${lessonTopic}`}
            onClick={handleLesson}
            className="relative flex h-24 w-24 items-center justify-center rounded-full border-b-[8px] border-teal-800 bg-teal-600 transition active:translate-y-1.5 active:border-b-2 hover:bg-teal-500"
          >
            <AtomIcon />
          </button>
        </div>
        <div className="absolute left-[calc(25%+64px)] top-[68px] w-40">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">{lessonTitle}</p>
          <p className="mt-0.5 font-display text-lg font-semibold leading-tight text-slate-900">{lessonTopic}</p>
        </div>

        <div className="absolute left-[75%] top-[300px] -translate-x-1/2">
          <div
            className={`absolute -top-[58px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl border-2 border-slate-300 bg-white px-4 py-1.5 text-sm font-bold tracking-wide text-slate-500 shadow-sm transition ${
              tip === 'soon' ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            ¡Muy pronto!
            <span className="absolute -bottom-[7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-slate-300 bg-white" />
          </div>
          <button
            key={shakeKey}
            type="button"
            aria-label="Lección 2: próximamente"
            onClick={() => showTip('soon')}
            className={`relative flex h-24 w-24 items-center justify-center rounded-full border-b-[8px] border-slate-400 bg-slate-300 transition ${
              shakeKey > 0 ? 'lp-shake' : ''
            }`}
          >
            <FlaskIcon />
            <LockBadge />
          </button>
        </div>
        <div className="absolute right-[calc(25%+64px)] top-[278px] w-40 text-right">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Lección 2</p>
          <p className="mt-0.5 font-display text-lg font-semibold leading-tight text-slate-500">Próximamente</p>
        </div>
      </div>
    </section>
  )
}
