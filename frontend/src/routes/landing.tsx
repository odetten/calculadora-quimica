import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Atom, ChevronLeft, ChevronRight, FlaskConical, History, LandPlot, Sigma } from 'lucide-react'
import { CATEGORY_INFO, PERIODIC_ELEMENTS } from '../tools/periodicTable.ts'
import { REACTIONS } from '../tools/reactions.ts'

type Feature = {
  icon: ReactNode
  label: string
  title: string
  text: string
  bg: string
  ink: string
  pill: string
  a: string
  b: string
  variant: number
}

const features: Feature[] = [
  {
    icon: <LandPlot size={56} aria-hidden="true" />,
    label: 'Cursos',
    title: 'Cursos paso a paso',
    text: 'Aprende Química 1 y Química 2 con un camino de lecciones y práctica que avanza a tu ritmo.',
    bg: '#cdeee8',
    ink: '#0f766e',
    pill: '#0f766e',
    a: '#9fdcd0',
    b: '#e6f7f4',
    variant: 0,
  },
  {
    icon: <Sigma size={56} aria-hidden="true" />,
    label: 'Balanceador',
    title: 'Balanceador de ecuaciones',
    text: 'Escribe una reacción y obtén la ecuación balanceada al instante, sin hacer tanteos a mano.',
    bg: '#d6ecf5',
    ink: '#1e6a8a',
    pill: '#1e6a8a',
    a: '#a9d4e6',
    b: '#eaf6fb',
    variant: 1,
  },
  {
    icon: <FlaskConical size={56} aria-hidden="true" />,
    label: 'Laboratorio',
    title: 'Laboratorio virtual',
    text: 'Mezcla sustancias en el vaso y mira qué pasa: agua, sal, óxido, explosiones... sin riesgos ni material.',
    bg: '#e6dcf3',
    ink: '#6b4a9a',
    pill: '#6b4a9a',
    a: '#cdbbe6',
    b: '#f3edfa',
    variant: 2,
  },
  {
    icon: <Atom size={56} aria-hidden="true" />,
    label: 'Tabla periódica',
    title: 'Tabla periódica interactiva',
    text: 'Toca cualquier elemento y conoce su masa, protones, neutrones, familia y con qué puede reaccionar.',
    bg: '#fbe8cf',
    ink: '#a35a14',
    pill: '#a35a14',
    a: '#f3cf9f',
    b: '#fdf3e4',
    variant: 3,
  },
  {
    icon: <History size={56} aria-hidden="true" />,
    label: 'Historial',
    title: 'Tu historial a la mano',
    text: 'Inicia sesión para guardar tus ecuaciones balanceadas y volver a ellas cuando las necesites.',
    bg: '#dfeccf',
    ink: '#4d7a1f',
    pill: '#4d7a1f',
    a: '#c2dba3',
    b: '#eef5e3',
    variant: 4,
  },
]

const stats = [
  { value: PERIODIC_ELEMENTS.length, label: 'elementos para explorar en la tabla periódica' },
  { value: REACTIONS.length, label: 'reacciones que puedes provocar en el laboratorio' },
  { value: 2, label: 'cursos de química con lecciones y práctica' },
]

const floaters = [
  { text: 'H₂O', left: '4%', top: '12%', delay: 0, size: 'text-2xl' },
  { text: 'NaCl', left: '40%', top: '8%', delay: 1.2, size: 'text-xl' },
  { text: 'CO₂', left: '8%', top: '74%', delay: 0.6, size: 'text-3xl' },
  { text: 'O₂', left: '46%', top: '80%', delay: 1.8, size: 'text-2xl' },
  { text: 'Fe', left: '88%', top: '10%', delay: 0.9, size: 'text-2xl' },
  { text: 'H₂', left: '92%', top: '70%', delay: 2.1, size: 'text-xl' },
]

const bubbles = [
  { left: '12%', size: '1.2rem', delay: 0, duration: 9 },
  { left: '28%', size: '2rem', delay: 2.5, duration: 12 },
  { left: '52%', size: '1rem', delay: 1, duration: 8 },
  { left: '68%', size: '2.4rem', delay: 4, duration: 13 },
  { left: '80%', size: '1.4rem', delay: 1.8, duration: 10 },
  { left: '94%', size: '1rem', delay: 3.4, duration: 9 },
]

const headline = ['La', 'química', 'nunca', 'fue', 'tan', 'divertida']

const tickerElements = PERIODIC_ELEMENTS.slice(0, 54)

function Decor({ variant, a, b }: { variant: number; a: string; b: string }) {
  return (
    <svg viewBox="0 0 100 125" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden="true">
      {variant === 0 && (
        <>
          <path d="M100 125 L100 68 L48 125 Z" fill={b} />
          <path d="M0 125 L0 84 A41 41 0 0 1 41 125 Z" fill={a} />
        </>
      )}
      {variant === 1 && (
        <>
          <path d="M28 125 L100 53 L100 125 Z" fill={a} />
          <circle cx="2" cy="118" r="24" fill={b} />
        </>
      )}
      {variant === 2 && (
        <>
          <path d="M8 125 A42 42 0 0 1 92 125 Z" fill={a} />
          <circle cx="2" cy="122" r="22" fill={b} />
          <circle cx="98" cy="122" r="22" fill={b} />
        </>
      )}
      {variant === 3 && (
        <>
          <rect x="0" y="92" width="38" height="33" fill={b} />
          <circle cx="82" cy="106" r="26" fill={a} />
        </>
      )}
      {variant === 4 && (
        <>
          <path d="M0 125 L0 58 L58 125 Z" fill={a} />
          <circle cx="88" cy="102" r="19" fill={b} />
        </>
      )}
    </svg>
  )
}

function FeatureCarousel() {
  const scroller = useRef<HTMLUListElement>(null)
  const [edge, setEdge] = useState({ start: true, end: false })

  useEffect(() => {
    const update = () => {
      const element = scroller.current
      if (!element) return
      setEdge({
        start: element.scrollLeft <= 4,
        end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 4,
      })
    }
    const frame = requestAnimationFrame(update)
    const element = scroller.current
    element?.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(frame)
      element?.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const scrollByCard = (direction: 1 | -1) => {
    scroller.current?.scrollBy({ left: direction * 296, behavior: 'smooth' })
  }

  const arrowClass =
    'flex size-11 items-center justify-center rounded-full bg-[#1E1C2E] text-white transition enabled:hover:scale-110 enabled:hover:bg-teal-700 disabled:opacity-30'

  return (
    <>
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="font-display text-3xl font-extrabold text-[#1E1C2E] sm:text-5xl">Todo para entender la química</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            My Chem junta lecciones, calculadoras y experimentos en un solo lugar para que estudiar sea más claro, más rápido y mucho más entretenido.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" aria-label="Anterior" disabled={edge.start} onClick={() => scrollByCard(-1)} className={arrowClass}>
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
          <button type="button" aria-label="Siguiente" disabled={edge.end} onClick={() => scrollByCard(1)} className={arrowClass}>
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        </div>
      </div>

      <ul
        ref={scroller}
        tabIndex={0}
        aria-label="Funciones de My Chem"
        className="ld-scroller -mx-2 mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-2 pb-4 pt-3"
      >
        {features.map((feature) => (
          <li key={feature.title} className="group w-[17rem] shrink-0 snap-start list-none">
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-3xl transition duration-300 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-black/15"
              style={{ backgroundColor: feature.bg }}
            >
              <Decor variant={feature.variant} a={feature.a} b={feature.b} />
              <span
                className="absolute left-1/2 top-[11%] -translate-x-1/2 whitespace-nowrap rounded-2xl px-6 py-3 text-white"
                style={{ backgroundColor: feature.pill }}
              >
                <span className="font-display text-lg font-bold">{feature.label}</span>
              </span>
              <span
                className="ld-float absolute left-1/2 top-[56%] flex size-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                style={{ color: feature.ink }}
              >
                {feature.icon}
              </span>
            </div>
            <h3 className="mt-4 font-display text-xl font-bold text-[#1E1C2E]">{feature.title}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">{feature.text}</p>
          </li>
        ))}
      </ul>
    </>
  )
}

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return [ref, seen] as const
}

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const [ref, seen] = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className={`ld-reveal ${seen ? 'ld-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

function CountUp({ to }: { to: number }) {
  const [ref, seen] = useInView<HTMLSpanElement>()
  const [value, setValue] = useState(0)
  const [reduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    if (!seen || reduceMotion) return
    const duration = 1400
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      setValue(Math.round(to * (1 - Math.pow(1 - progress, 3))))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [seen, reduceMotion, to])

  return <span ref={ref}>{reduceMotion ? to : value}</span>
}

function StartButton({ onStart, children }: { onStart: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onStart}
      className="ld-cta group relative rounded-full bg-teal-700 px-8 py-3.5 text-white shadow-lg shadow-teal-900/25 transition hover:scale-105 hover:bg-teal-800 active:scale-95"
    >
      <span className="text-base font-bold">{children}</span>
      <span className="ml-2 inline-block transition-transform group-hover:translate-x-1" aria-hidden="true">
        →
      </span>
    </button>
  )
}

export function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <>
      <section
        aria-label="Presentación"
        className="ld-hero relative isolate overflow-hidden text-[#1E1C2E]"
      >
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          {bubbles.map((bubble) => (
            <span
              key={bubble.left}
              className="ld-bubble absolute bottom-0 rounded-full border-2 border-[#07c7b0]/60 bg-[#07c7b0]/15"
              style={{
                left: bubble.left,
                width: bubble.size,
                height: bubble.size,
                animationDelay: `${bubble.delay}s`,
                animationDuration: `${bubble.duration}s`,
              }}
            />
          ))}
          {floaters.map((floater) => (
            <span
              key={floater.text}
              className={`ld-float absolute font-display font-bold text-teal-700/20 ${floater.size}`}
              style={{ left: floater.left, top: floater.top, animationDelay: `${floater.delay}s` }}
            >
              {floater.text}
            </span>
          ))}
        </div>

        <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-10 px-6 pb-28 pt-12 sm:px-10 md:grid-cols-2">
          <div>
            <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              {headline.map((word, index) => (
                <span key={word} className="inline-block overflow-hidden pb-1 align-bottom">
                  <span
                    className={`ld-word inline-block ${word === 'divertida' ? 'ld-shimmer' : ''}`}
                    style={{ animationDelay: `${0.2 + index * 0.12}s` }}
                  >
                    {word}
                    {index < headline.length - 1 ? ' ' : ''}
                  </span>
                </span>
              ))}
            </h1>
            <div className="ld-rise mt-9" style={{ animationDelay: '1.1s' }}>
              <StartButton onStart={onStart}>Empezar ahora</StartButton>
            </div>
          </div>

          {/* Espacio reservado para el vector gráfico */}
          <div id="landing-vector" aria-hidden="true" className="hidden aspect-square w-full md:block" />
        </div>

        <svg
          className="absolute inset-x-0 bottom-0 h-16 w-full text-[#07c7b0]"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            className="ld-wave"
            fill="currentColor"
            d="M0 40 C180 80 360 0 540 30 C720 60 900 80 1080 40 C1260 0 1350 20 1440 36 L1440 80 L0 80 Z"
          />
        </svg>
      </section>

      <div className="overflow-hidden bg-white pb-2" aria-hidden="true">
        <div className="ld-ticker flex w-max gap-2 py-3">
          {[...tickerElements, ...tickerElements].map((element, index) => (
            <span
              key={`${element.symbol}-${index}`}
              className={`flex size-14 shrink-0 flex-col items-center justify-center rounded-xl border ${CATEGORY_INFO[element.category].cell}`}
            >
              <span className="text-[0.6rem] leading-none">{element.number}</span>
              <span className="font-display text-xl font-bold leading-none">{element.symbol}</span>
            </span>
          ))}
        </div>
      </div>

      <section aria-label="My Chem en números" className="bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-14 sm:grid-cols-3 sm:px-10">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 120} className="flex flex-col items-center text-center">
              <p className="font-display text-6xl font-extrabold text-teal-700">
                <CountUp to={stat.value} />
              </p>
              <p className="mx-auto mt-2 max-w-[16rem] text-sm leading-6 text-slate-600">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section aria-label="Por qué My Chem" className="bg-[#f1f7f5]">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10">
          <Reveal>
            <FeatureCarousel />
          </Reveal>
        </div>
      </section>

      <section aria-label="Empieza ahora" className="ld-hero relative isolate overflow-hidden text-center text-[#1E1C2E]">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          {bubbles.map((bubble) => (
            <span
              key={bubble.left}
              className="ld-bubble absolute bottom-0 rounded-full border-2 border-[#07c7b0]/60 bg-[#07c7b0]/15"
              style={{
                left: bubble.left,
                width: bubble.size,
                height: bubble.size,
                animationDelay: `${bubble.delay}s`,
                animationDuration: `${bubble.duration}s`,
              } as CSSProperties}
            />
          ))}
        </div>
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-6 pb-32 pt-20 sm:px-10">
          <Reveal>
            <h2 className="font-display text-4xl font-extrabold sm:text-5xl">¿Listo para experimentar?</h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600">
              Entra, elige un curso o mezcla tus primeras sustancias en el laboratorio. Es gratis y no necesitas instalar nada.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <StartButton onStart={onStart}>Entrar a My Chem</StartButton>
          </Reveal>
        </div>
        <svg className="absolute inset-x-0 bottom-0 h-16 w-full text-[#07c7b0]" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
          <path
            className="ld-wave"
            fill="currentColor"
            d="M0 40 C180 80 360 0 540 30 C720 60 900 80 1080 40 C1260 0 1350 20 1440 36 L1440 80 L0 80 Z"
          />
        </svg>
      </section>
    </>
  )
}
