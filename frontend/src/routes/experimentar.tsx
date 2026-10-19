import { useEffect, useState, type CSSProperties, type DragEvent } from 'react'
import { findReaction, MIXED_COLOR, REAGENTS, type Reagent } from '../tools/reactions.ts'

type Phase = 'idle' | 'mixing' | 'exploded'

const SPARK_COUNT = 16
const sparks = Array.from({ length: SPARK_COUNT }, (_, i) => {
  const angle = (i / SPARK_COUNT) * Math.PI * 2 + ((i * 7) % 5) * 0.08
  const distance = 110 + ((i * 37) % 9) * 14
  return {
    dx: Math.round(Math.cos(angle) * distance),
    dy: Math.round(Math.sin(angle) * distance),
    delay: ((i * 13) % 6) * 0.02,
    hot: i % 3 === 0,
  }
})

const smokePuffs = [
  { x: -46, delay: 0.1 },
  { x: -14, delay: 0.35 },
  { x: 18, delay: 0.2 },
  { x: 48, delay: 0.5 },
  { x: 0, delay: 0.7 },
]

const bubbles = [
  { left: '18%', delay: 0 },
  { left: '34%', delay: 0.15 },
  { left: '50%', delay: 0.05 },
  { left: '66%', delay: 0.25 },
  { left: '80%', delay: 0.1 },
]

function reagentById(id: string): Reagent | undefined {
  return REAGENTS.find((reagent) => reagent.id === id)
}

function Beaker({ contents, phase }: { contents: string[]; phase: Phase }) {
  const mixed = phase !== 'idle'
  const exploded = phase === 'exploded'
  const layerHeight = exploded ? 18 : 30

  return (
    <div className={`relative h-56 w-40 ${phase === 'mixing' ? 'lab-wobble' : ''} ${exploded ? 'lab-burst' : ''}`}>
      <div className="absolute inset-0 overflow-hidden rounded-b-[2.25rem] border-4 border-t-0 border-slate-300 bg-white/50">
        <div className="absolute inset-x-0 bottom-0 flex flex-col-reverse">
          {contents.map((id) => (
            <div
              key={id}
              className="w-full transition-[height,background-color] duration-[1200ms] ease-out"
              style={{
                height: `${(layerHeight / 100) * 14}rem`,
                backgroundColor: mixed ? MIXED_COLOR : reagentById(id)?.color,
                opacity: 0.9,
              }}
            />
          ))}
        </div>

        {phase === 'mixing' &&
          bubbles.map((bubble) => (
            <span
              key={bubble.left}
              className="lab-bubble absolute bottom-6 size-3 rounded-full border-2 border-white/80 bg-white/40"
              style={{ left: bubble.left, animationDelay: `${bubble.delay}s` }}
            />
          ))}

        {exploded && (
          <div className="absolute inset-x-0 bottom-[34%] flex justify-center gap-0.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="lab-foam size-6 rounded-full bg-amber-100/90"
                style={{ animationDelay: `${i * 0.12}s`, marginTop: i % 2 ? 6 : 0 }}
              />
            ))}
          </div>
        )}
      </div>
      <div className="absolute -top-0.5 -left-1.5 h-1.5 w-[calc(100%+0.75rem)] rounded-full bg-slate-300" />
    </div>
  )
}

function Explosion() {
  return (
    <>
      <div className="lab-flash pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,#fff7ed_0%,#fdba74_35%,transparent_70%)]" />
      <div className="lab-shock pointer-events-none absolute left-1/2 top-[58%] size-40 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-orange-300" />
      {sparks.map((spark, i) => (
        <span
          key={i}
          className={`lab-spark pointer-events-none absolute left-1/2 top-[58%] size-2.5 rounded-full ${spark.hot ? 'bg-amber-300' : 'bg-orange-500'}`}
          style={{ '--dx': `${spark.dx}px`, '--dy': `${spark.dy}px`, animationDelay: `${spark.delay}s` } as CSSProperties}
        />
      ))}
      {smokePuffs.map((puff, i) => (
        <span
          key={i}
          className="lab-smoke pointer-events-none absolute left-1/2 top-[48%] size-20 rounded-full bg-slate-400/60 blur-md"
          style={{ marginLeft: puff.x - 40, animationDelay: `${puff.delay}s` }}
        />
      ))}
    </>
  )
}

export function ExperimentPage({ onBack }: { onBack: () => void }) {
  const [contents, setContents] = useState<string[]>([])
  const [phase, setPhase] = useState<Phase>('idle')
  const [showWhy, setShowWhy] = useState(false)
  const [notice, setNotice] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const reaction = contents.length === 2 ? findReaction(contents[0], contents[1]) : undefined

  useEffect(() => {
    if (phase !== 'mixing') return
    const timer = window.setTimeout(() => setPhase('exploded'), 1500)
    return () => window.clearTimeout(timer)
  }, [phase])

  const addReagent = (id: string) => {
    const reagent = reagentById(id)
    if (!reagent || phase !== 'idle' || contents.length >= 2) return
    if (contents.includes(id)) {
      setNotice(`${reagent.formula} ya está en el vaso. Prueba con otro reactivo.`)
      return
    }
    const next = [...contents, id]
    setContents(next)
    setNotice('')
    if (next.length === 2) {
      if (findReaction(next[0], next[1])) setPhase('mixing')
      else setNotice('Estos dos no reaccionan de forma visible.')
    }
  }

  const reset = () => {
    setContents([])
    setPhase('idle')
    setShowWhy(false)
    setNotice('')
  }

  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    setDragOver(false)
    addReagent(event.dataTransfer.getData('text/plain'))
  }

  const canAdd = phase === 'idle' && contents.length < 2

  let status = 'Arrastra un reactivo al vaso, o tócalo para añadirlo.'
  if (notice) status = notice
  else if (phase === 'mixing') status = 'Mezclando…'
  else if (phase === 'exploded') status = '¡Boom! Toca "¿Qué pasó?" para entenderlo.'
  else if (contents.length === 1) status = 'Ahora añade el otro reactivo.'

  return (
    <section className="mx-auto w-full max-w-5xl px-6 pb-12 pt-3 sm:px-10">
      <button type="button" className="mb-2 w-fit text-sm text-slate-600 hover:text-teal-800" onClick={onBack}>
        ← Volver
      </button>

      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">Laboratorio</p>
        <h1 className="mt-1 font-display text-4xl font-semibold text-slate-950 sm:text-5xl">Experimentar</h1>
        <p className="mt-2 text-slate-600">Combina reactivos y observa qué pasa.</p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-[16rem_1fr]">
        <div className="flex flex-col gap-3" aria-label="Reactivos">
          {REAGENTS.map((reagent) => {
            const used = contents.includes(reagent.id)
            return (
              <button
                key={reagent.id}
                type="button"
                draggable={canAdd && !used}
                disabled={!canAdd || used}
                onDragStart={(event) => event.dataTransfer.setData('text/plain', reagent.id)}
                onClick={() => addReagent(reagent.id)}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm transition enabled:cursor-grab enabled:hover:-translate-y-0.5 enabled:hover:border-teal-300 enabled:hover:shadow-md disabled:opacity-45"
              >
                <span className="size-10 shrink-0 rounded-full border border-black/10" style={{ backgroundColor: reagent.color }} aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block font-display text-xl font-semibold text-slate-900">{reagent.formula}</span>
                  <span className="block text-sm text-slate-700">{reagent.name}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">{reagent.state}</span>
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex flex-col gap-3">
          <div
            onDragOver={(event) => {
              if (!canAdd) return
              event.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={`relative flex h-[26rem] items-end justify-center overflow-hidden rounded-3xl border-2 bg-gradient-to-b from-white to-teal-50 pb-10 transition-colors ${
              dragOver ? 'border-teal-500 bg-teal-50' : 'border-slate-200'
            } ${phase === 'exploded' ? 'lab-stage-shake' : ''}`}
          >
            <div className="absolute inset-x-0 bottom-9 h-1.5 bg-slate-200" aria-hidden="true" />
            <Beaker contents={contents} phase={phase} />
            {phase === 'exploded' && <Explosion />}
          </div>

          <p role="status" className="min-h-6 text-center text-sm text-slate-700">
            {status}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {phase === 'exploded' && (
              <button
                type="button"
                onClick={() => setShowWhy((open) => !open)}
                aria-expanded={showWhy}
                aria-controls="why-panel"
                className="lab-pop rounded-full bg-teal-700 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-800"
              >
                {showWhy ? 'Ocultar explicación' : '¿Qué pasó?'}
              </button>
            )}
            {contents.length > 0 && (
              <button
                type="button"
                onClick={reset}
                className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
              >
                Reiniciar
              </button>
            )}
          </div>
        </div>
      </div>

      {phase === 'exploded' && showWhy && reaction && (
        <article id="why-panel" className="lab-pop mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-2xl font-semibold text-slate-900">{reaction.title}</h2>
          <p className="mt-3 rounded-xl bg-teal-50 px-4 py-3 font-mono text-sm text-teal-900">{reaction.equation}</p>

          <h3 className="mt-5 text-sm font-semibold uppercase tracking-wider text-teal-700">Lo que viste</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-slate-700">
            {reaction.whatYouSaw.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>

          <h3 className="mt-5 text-sm font-semibold uppercase tracking-wider text-teal-700">Por qué pasa</h3>
          <div className="mt-2 space-y-2 text-slate-700">
            {reaction.why.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <strong>Seguridad: </strong>
            {reaction.safety}
          </p>
        </article>
      )}
    </section>
  )
}
