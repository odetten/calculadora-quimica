import { useEffect, useState, type ComponentType, type CSSProperties, type DragEvent } from 'react'
import { PeriodicTable } from '../components/periodicTable.tsx'
import { findReaction, REACTIONS, REAGENTS, type Reaction, type ReactionEffect, type Reagent } from '../tools/reactions.ts'

type Phase = 'idle' | 'mixing' | 'reacted'
type TabId = 'lab' | 'tabla'

const TABS: { id: TabId; label: string }[] = [
  { id: 'lab', label: 'Laboratorio' },
  { id: 'tabla', label: 'Tabla periódica interactiva' },
]

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

const droplets = [
  { x: -36, delay: 0 },
  { x: -18, delay: 0.25 },
  { x: 0, delay: 0.1 },
  { x: 20, delay: 0.4 },
  { x: 38, delay: 0.2 },
  { x: -8, delay: 0.55 },
  { x: 28, delay: 0.7 },
  { x: -28, delay: 0.8 },
]

const crystals = [
  { x: -42, bottom: 3.1, delay: 0.1 },
  { x: -24, bottom: 3.6, delay: 0.35 },
  { x: -6, bottom: 3.2, delay: 0.2 },
  { x: 14, bottom: 3.7, delay: 0.5 },
  { x: 32, bottom: 3.1, delay: 0.3 },
  { x: 46, bottom: 3.6, delay: 0.6 },
  { x: -34, bottom: 4.4, delay: 0.7 },
  { x: 4, bottom: 4.5, delay: 0.55 },
  { x: 24, bottom: 4.3, delay: 0.8 },
]

const flakes = [
  { x: -40, dx: -14, delay: 0 },
  { x: -20, dx: 10, delay: 0.6 },
  { x: 0, dx: -8, delay: 0.3 },
  { x: 22, dx: 14, delay: 0.9 },
  { x: 40, dx: -10, delay: 0.45 },
  { x: -8, dx: 12, delay: 1.2 },
  { x: 30, dx: -16, delay: 1.5 },
]

const co2Puffs = [
  { x: -22, dx: -26, delay: 0 },
  { x: 8, dx: 14, delay: 0.6 },
  { x: -6, dx: -8, delay: 1.2 },
  { x: 20, dx: 30, delay: 1.8 },
  { x: -14, dx: 20, delay: 2.3 },
]

function reagentById(id: string): Reagent | undefined {
  return REAGENTS.find((reagent) => reagent.id === id)
}

const FLASK_PATH = 'M62 10 L62 76 L16 188 Q6 216 34 218 L126 218 Q154 216 144 188 L98 76 L98 10 Z'

function Flask({ contents, phase, reaction }: { contents: string[]; phase: Phase; reaction?: Reaction }) {
  const mixed = phase !== 'idle'
  const reacted = phase === 'reacted'
  const exploded = reacted && reaction?.effect === 'explosion'
  const layerHeight = reacted ? 18 : 30

  return (
    <div className={`relative h-56 w-40 ${phase === 'mixing' ? 'lab-wobble' : ''} ${exploded ? 'lab-burst' : ''}`}>
      <div className="absolute inset-0 bg-white/40" style={{ clipPath: `path('${FLASK_PATH}')` }}>
        <div className="absolute inset-x-0 bottom-0 flex flex-col-reverse">
          {contents.map((id) => (
            <div
              key={id}
              className="w-full transition-[height,background-color] duration-[1200ms] ease-out"
              style={{
                height: `${(layerHeight / 100) * 14}rem`,
                backgroundColor: mixed && reaction ? reaction.resultColor : reagentById(id)?.color,
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
                className="lab-foam size-5 rounded-full bg-amber-100/90"
                style={{ animationDelay: `${i * 0.12}s`, marginTop: i % 2 ? 6 : 0 }}
              />
            ))}
          </div>
        )}
      </div>

      <svg viewBox="0 0 160 224" className="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
        <path d={FLASK_PATH} fill="none" stroke="#94a3b8" strokeWidth="4" strokeLinejoin="round" />
        <rect x="55" y="4" width="50" height="9" rx="4.5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
        <g stroke="#64748b" strokeWidth="2" strokeLinecap="round">
          <line x1="50" y1="110" x2="66" y2="110" />
          <line x1="37" y1="140" x2="48" y2="140" />
          <line x1="25" y1="170" x2="41" y2="170" />
        </g>
        <path d="M70 22 L70 72" stroke="white" strokeOpacity="0.85" strokeWidth="4" strokeLinecap="round" />
        <path d="M54 98 L28 162" stroke="white" strokeOpacity="0.6" strokeWidth="5" strokeLinecap="round" />
      </svg>
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

function WaterEffect() {
  return (
    <>
      <div className="lab-flash pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,#ffffff_0%,#bae6fd_35%,transparent_70%)]" />
      {droplets.map((drop, i) => (
        <span
          key={i}
          className="lab-drop pointer-events-none absolute left-1/2 top-[42%] h-3 w-2 rounded-full bg-sky-400"
          style={{ marginLeft: drop.x, animationDelay: `${drop.delay}s`, '--fall': '6.5rem' } as CSSProperties}
        />
      ))}
    </>
  )
}

function SaltEffect() {
  return (
    <>
      <div className="lab-flash pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,#fefce8_0%,#fde047_35%,transparent_70%)]" />
      {sparks.slice(0, 10).map((spark, i) => (
        <span
          key={i}
          className="lab-spark pointer-events-none absolute left-1/2 top-[58%] size-2 rounded-full bg-yellow-300"
          style={{ '--dx': `${spark.dx * 0.7}px`, '--dy': `${spark.dy * 0.7}px`, animationDelay: `${spark.delay}s` } as CSSProperties}
        />
      ))}
      {crystals.map((crystal, i) => (
        <span
          key={i}
          className="lab-crystal pointer-events-none absolute left-1/2 size-3 border border-slate-300 bg-white"
          style={{ marginLeft: crystal.x, bottom: `${crystal.bottom}rem`, animationDelay: `${crystal.delay}s` }}
        />
      ))}
    </>
  )
}

function RustEffect() {
  return (
    <>
      {flakes.map((flake, i) => (
        <span
          key={i}
          className="lab-flake pointer-events-none absolute left-1/2 top-[38%] size-2 bg-orange-800"
          style={{ marginLeft: flake.x, animationDelay: `${flake.delay}s`, '--dx': `${flake.dx}px` } as CSSProperties}
        />
      ))}
    </>
  )
}

function Flame({ className, style }: { className: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 40 64" className={`lab-flame pointer-events-none absolute ${className}`} style={style} aria-hidden="true">
      <path
        d="M20 0 C20 14 34 22 34 42 C34 54 28 62 20 62 C12 62 6 54 6 42 C6 34 10 28 14 20 C14 29 17 32 19 30 C22 22 18 10 20 0 Z"
        fill="#f97316"
      />
      <path
        d="M20 26 C20 35 28 39 28 48 C28 55 24 60 20 60 C16 60 12 55 12 48 C12 41 18 37 20 26 Z"
        fill="#fbbf24"
      />
      <path d="M20 42 C20 47 24 49 24 53 C24 57 22 59 20 59 C18 59 16 57 16 53 C16 49 20 47 20 42 Z" fill="#fef9c3" />
    </svg>
  )
}

function Co2Effect() {
  return (
    <>
      <Flame className="bottom-[7.2rem] left-1/2 -ml-5 h-16 w-10" />
      <Flame className="bottom-[7.2rem] left-1/2 ml-3 h-9 w-6" style={{ animationDelay: '0.12s' }} />
      <Flame className="bottom-[7.2rem] left-1/2 -ml-[2.1rem] h-8 w-5" style={{ animationDelay: '0.22s' }} />

      {co2Puffs.map((puff, i) => (
        <span
          key={i}
          className="lab-puff pointer-events-none absolute bottom-[9rem] left-1/2 size-10 rounded-full bg-slate-400/50 blur-md"
          style={{ marginLeft: puff.x - 20, animationDelay: `${puff.delay}s`, '--dx': `${puff.dx}px` } as CSSProperties}
        />
      ))}
    </>
  )
}

function SparkleEffect() {
  const sparkles = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * Math.PI * 2
    const distance = 80 + (i % 3) * 20
    return {
      dx: Math.round(Math.cos(angle) * distance),
      dy: Math.round(Math.sin(angle) * distance),
      delay: (i * 0.08) % 0.8,
      size: 2 + (i % 3),
    }
  })

  return (
    <>
      <div className="lab-flash pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,#ffffff_0%,#fef9c3_25%,transparent_60%)]" />
      {sparkles.map((spark, i) => (
        <span
          key={i}
          className="lab-spark pointer-events-none absolute left-1/2 top-[58%] rounded-full bg-yellow-200"
          style={{
            width: `${spark.size}px`,
            height: `${spark.size}px`,
            '--dx': `${spark.dx}px`,
            '--dy': `${spark.dy}px`,
            animationDelay: `${spark.delay}s`,
          } as CSSProperties}
        />
      ))}
    </>
  )
}

function EffervescenceEffect() {
  const bubbles = Array.from({ length: 20 }, (_, i) => ({
    left: `${10 + (i % 8) * 12}%`,
    delay: (i * 0.15) % 1.2,
    size: 4 + (i % 3) * 2,
  }))

  return (
    <div className="lab-flash pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,#e0f2fe_0%,#bfdbfe_30%,transparent_65%)]">
      {bubbles.map((bubble, i) => (
        <span
          key={i}
          className="lab-bubble pointer-events-none absolute bottom-4 rounded-full border-2 border-cyan-300/60 bg-cyan-100/40"
          style={{
            left: bubble.left,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            animationDelay: `${bubble.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

function PrecipitationEffect() {
  const particles = Array.from({ length: 16 }, (_, i) => ({
    left: `${15 + (i % 7) * 14}%`,
    delay: (i * 0.12) % 0.9,
  }))

  return (
    <>
      <div className="lab-flash pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,#f5f5f5_0%,#e5e5e5_35%,transparent_65%)]" />
      {particles.map((particle, i) => (
        <span
          key={i}
          className="lab-crystal pointer-events-none absolute left-1/2 top-[30%] size-2 rounded-full bg-white border border-gray-300"
          style={{
            marginLeft: `calc(${particle.left} - 50%)`,
            animation: `lab-drop 1.5s ease-in forwards`,
            animationDelay: `${particle.delay}s`,
          } as CSSProperties}
        />
      ))}
    </>
  )
}

function ColorChangeEffect() {
  return (
    <>
      <div className="lab-flash pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,#e0e7ff_0%,#c7d2e0_35%,transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-purple-300/0 via-purple-200/30 to-transparent transition-all duration-[2000ms]" />
    </>
  )
}

function DarkeningEffect() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 opacity-0 bg-black/20 animate-pulse" style={{ animationDuration: '2s' }} />
      {Array.from({ length: 12 }, (_, i) => (
        <span
          key={i}
          className="lab-flake pointer-events-none absolute left-1/2 top-[40%] size-1.5 bg-gray-900 rounded-full"
          style={{
            marginLeft: `${-50 + (i % 6) * 20}px`,
            marginTop: `${(i % 3) * 10}px`,
            animation: `lab-flake 1.5s ease-out forwards`,
            animationDelay: `${(i * 0.15) % 1.2}s`,
          } as CSSProperties}
        />
      ))}
    </>
  )
}

function WhiteSmokeEffect() {
  const puffs = Array.from({ length: 12 }, (_, i) => ({
    x: -40 + (i % 8) * 15,
    delay: (i * 0.2) % 1.5,
  }))

  return (
    <>
      <div className="lab-flash pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,#ffffff_0%,#f0f0f0_40%,transparent_70%)]" />
      {puffs.map((puff, i) => (
        <span
          key={i}
          className="pointer-events-none absolute left-1/2 top-[35%] size-16 rounded-full bg-gradient-to-t from-gray-200/0 to-white/40 blur-xl"
          style={{
            marginLeft: puff.x,
            animation: `lab-puff 2s ease-out forwards`,
            animationDelay: `${puff.delay}s`,
          } as CSSProperties}
        />
      ))}
    </>
  )
}

const EFFECT_VIEWS: Record<ReactionEffect, ComponentType> = {
  explosion: Explosion,
  water: WaterEffect,
  salt: SaltEffect,
  rust: RustEffect,
  co2: Co2Effect,
  sparkle: SparkleEffect,
  effervescence: EffervescenceEffect,
  precipitation: PrecipitationEffect,
  colorchange: ColorChangeEffect,
  darkening: DarkeningEffect,
  whitesmoke: WhiteSmokeEffect,
}

function ReagentButton({
  reagent,
  used,
  canAdd,
  onAdd,
}: {
  reagent: Reagent
  used: boolean
  canAdd: boolean
  onAdd: () => void
}) {
  return (
    <button
      type="button"
      draggable={canAdd && !used}
      disabled={!canAdd || used}
      onDragStart={(event) => event.dataTransfer.setData('text/plain', reagent.id)}
      onClick={onAdd}
      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-left shadow-sm transition enabled:cursor-grab enabled:hover:-translate-y-0.5 enabled:hover:border-teal-300 enabled:hover:shadow-md disabled:opacity-45"
    >
      <span className="size-5 shrink-0 rounded-full border border-black/10" style={{ backgroundColor: reagent.color }} aria-hidden="true" />
      <span className="min-w-0">
        <span className="block font-display text-sm font-semibold leading-tight text-slate-900">{reagent.formula}</span>
        <span className="block truncate text-[0.7rem] leading-tight text-slate-600" title={`${reagent.name} · ${reagent.state}`}>
          {reagent.name}
        </span>
      </span>
    </button>
  )
}

export function ExperimentPage({ onBack }: { onBack: () => void }) {
  const [contents, setContents] = useState<string[]>([])
  const [phase, setPhase] = useState<Phase>('idle')
  const [showWhy, setShowWhy] = useState(false)
  const [notice, setNotice] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [tab, setTab] = useState<TabId>('lab')

  const reaction = contents.length === 2 ? findReaction(contents[0], contents[1]) : undefined
  const mixingMs = reaction?.mixingMs ?? 1500

  useEffect(() => {
    if (phase !== 'mixing') return
    const timer = window.setTimeout(() => setPhase('reacted'), mixingMs)
    return () => window.clearTimeout(timer)
  }, [phase, mixingMs])

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
      else setNotice('Todavía no tenemos esa combinación en el laboratorio. Reinicia y prueba con otra.')
    }
  }

  const reset = () => {
    setContents([])
    setPhase('idle')
    setShowWhy(false)
    setNotice('')
  }

  const tryIdea = (a: string, b: string) => {
    setContents([a, b])
    setPhase('mixing')
    setShowWhy(false)
    setNotice('')
    setTab('lab')
  }

  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    setDragOver(false)
    addReagent(event.dataTransfer.getData('text/plain'))
  }

  const canAdd = phase === 'idle' && contents.length < 2

  const addFromTable = (id: string) => {
    addReagent(id)
    // Con el segundo reactivo la reacción empieza: se lleva al usuario al vaso para verla
    if (contents.length === 1 && !contents.includes(id)) setTab('lab')
  }

  let status = 'Arrastra una sustancia al vaso, o tócala para añadirla.'
  if (notice) status = notice
  else if (phase === 'mixing') status = 'Mezclando…'
  else if (phase === 'reacted' && reaction) status = `${reaction.resultLine} Toca "¿Qué pasó?" para entenderlo.`
  else if (contents.length === 1) status = 'Ahora añade la otra sustancia.'

  const EffectView = reaction ? EFFECT_VIEWS[reaction.effect] : undefined
  const elements = REAGENTS.filter((reagent) => reagent.element)
  const compounds = REAGENTS.filter((reagent) => !reagent.element)

  return (
    <section className="mx-auto w-full max-w-5xl px-6 pb-12 pt-3 sm:px-10">
      <button type="button" className="mb-2 w-fit text-sm text-slate-600 hover:text-teal-800" onClick={onBack}>
        ← Volver
      </button>

      <div className="text-center">
        <h1 className="font-display text-4xl font-semibold text-slate-950 sm:text-5xl">Laboratorio</h1>
        <p className="mt-2 text-slate-600">
          {tab === 'lab' ? 'Combina sustancias y observa qué pasa.' : 'Explora los elementos antes de experimentar.'}
        </p>
      </div>

      <div role="tablist" aria-label="Secciones del laboratorio" className="mt-6 flex justify-center gap-2">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            id={`tab-${id}`}
            type="button"
            role="tab"
            aria-selected={tab === id}
            aria-controls={`panel-${id}`}
            onClick={() => setTab(id)}
            className={`rounded-full border px-5 py-2 transition-colors ${
              tab === id
                ? 'border-teal-700 bg-teal-700 text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50'
            }`}
          >
            <span className="text-sm font-semibold">
              {label}
              {id === 'lab' && contents.length > 0 ? ` (${contents.length})` : ''}
            </span>
          </button>
        ))}
      </div>

      {tab === 'tabla' && (
        <div id="panel-tabla" role="tabpanel" aria-labelledby="tab-tabla" className="mt-8">
          <PeriodicTable contents={contents} canAdd={canAdd} onAddReagent={addFromTable} />
        </div>
      )}

      <div
        id="panel-lab"
        role="tabpanel"
        aria-labelledby="tab-lab"
        hidden={tab !== 'lab'}
        className="mt-8 grid gap-6 md:grid-cols-[16rem_1fr]"
      >
        <div className="flex flex-col gap-2" aria-label="Reactivos">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-teal-700">Elementos</h2>
          <div className="grid grid-cols-2 gap-1.5">
            {elements.map((reagent) => (
              <ReagentButton
                key={reagent.id}
                reagent={reagent}
                used={contents.includes(reagent.id)}
                canAdd={canAdd}
                onAdd={() => addReagent(reagent.id)}
              />
            ))}
          </div>
          <h2 className="mt-2 text-xs font-semibold uppercase tracking-wider text-teal-700">Compuestos</h2>
          <div className="grid grid-cols-2 gap-1.5">
            {compounds.map((reagent) => (
              <ReagentButton
                key={reagent.id}
                reagent={reagent}
                used={contents.includes(reagent.id)}
                canAdd={canAdd}
                onAdd={() => addReagent(reagent.id)}
              />
            ))}
          </div>

          <h2 className="mt-2 text-xs font-semibold uppercase tracking-wider text-teal-700">Ideas para combinar</h2>
          <ul className="flex flex-wrap gap-1.5">
            {REACTIONS.map(({ ids }) => {
              const [a, b] = ids.map(reagentById)
              if (!a || !b) return null
              return (
                <li key={ids.join('+')}>
                  <button
                    type="button"
                    onClick={() => tryIdea(ids[0], ids[1])}
                    className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-teal-900 transition-colors hover:border-teal-400 hover:bg-teal-100"
                  >
                    <span className="text-xs font-semibold">
                      {a.formula} + {b.formula}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
          <p className="text-xs text-slate-500">Toca una idea y se prepara la mezcla en el vaso.</p>
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
            } ${phase === 'reacted' && reaction?.effect === 'explosion' ? 'lab-stage-shake' : ''}`}
          >
            <div className="absolute inset-x-0 bottom-9 h-1.5 bg-slate-200" aria-hidden="true" />
            <Flask contents={contents} phase={phase} reaction={reaction} />
            {phase === 'reacted' && EffectView && <EffectView />}
          </div>

          <p role="status" className="min-h-6 text-center text-sm text-slate-700">
            {status}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {phase === 'reacted' && (
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

      {tab === 'lab' && phase === 'reacted' && showWhy && reaction && (
        <article id="why-panel" className="lab-pop mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-2xl font-semibold text-slate-900">{reaction.title}</h2>
          <p className="mt-3 rounded-xl bg-teal-50 px-4 py-3 font-mono text-sm text-teal-900">{reaction.equation}</p>
          {reaction.otherEquations && (
            <div className="mt-2 text-sm text-slate-600">
              <p>También pueden formarse otros productos:</p>
              <ul className="mt-1 space-y-1">
                {reaction.otherEquations.map((equation) => (
                  <li key={equation} className="rounded-lg bg-slate-50 px-3 py-1.5 font-mono text-slate-800">
                    {equation}
                  </li>
                ))}
              </ul>
            </div>
          )}

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
            <strong>{reaction.noteLabel}: </strong>
            {reaction.note}
          </p>
        </article>
      )}
    </section>
  )
}
