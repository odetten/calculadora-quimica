import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Check, ChevronDown, Minus, Plus } from 'lucide-react'
import { CATEGORY_INFO, PERIODIC_ELEMENTS, type ElementCategory, type PeriodicElement } from './periodicTable.ts'

type OrbitalType = 's' | 'p' | 'd' | 'f'
type Subshell = { orbital: string; shell: number; type: OrbitalType; electrons: number; capacity: number }

const orbitalOrder = ['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p', '6s', '4f', '5d', '6p', '7s', '5f', '6d', '7p']
const orbitalCapacity: Record<OrbitalType, number> = { s: 2, p: 6, d: 10, f: 14 }

// El color acompaña al nombre del subnivel; nunca es la única pista
const orbitalFill: Record<OrbitalType, string> = {
  s: 'bg-teal-500',
  p: 'bg-indigo-500',
  d: 'bg-amber-500',
  f: 'bg-rose-500',
}

// En elements.ts los nombres están en minúscula; aquí se muestran como título
const ELEMENTS: PeriodicElement[] = PERIODIC_ELEMENTS.map((element) => ({
  ...element,
  name: element.name.charAt(0).toLocaleUpperCase('es') + element.name.slice(1),
}))

const shellLetters = ['K', 'L', 'M', 'N', 'O', 'P', 'Q']
const nobleGasNumbers = [86, 54, 36, 18, 10, 2]

function buildSubshells(atomicNumber: number): Subshell[] {
  if (!Number.isInteger(atomicNumber) || atomicNumber < 1 || atomicNumber > 118) {
    throw new Error('El número atómico debe estar entre 1 y 118.')
  }

  const subshells: Subshell[] = []
  let remaining = atomicNumber

  for (const orbital of orbitalOrder) {
    if (remaining <= 0) break
    const type = orbital[orbital.length - 1] as OrbitalType
    const capacity = orbitalCapacity[type]
    const electrons = Math.min(remaining, capacity)
    subshells.push({ orbital, shell: parseInt(orbital, 10), type, electrons, capacity })
    remaining -= electrons
  }

  return subshells
}

function toConfigString(subshells: Subshell[]): string {
  return subshells.map(({ orbital, electrons }) => `${orbital}${electrons}`).join(' ')
}

function electronsPerShell(subshells: Subshell[]): number[] {
  const shells: number[] = []
  for (const { shell, electrons } of subshells) {
    shells[shell - 1] = (shells[shell - 1] ?? 0) + electrons
  }
  return shells
}

// Con el orden de llenado, la configuración del gas noble anterior es el inicio exacto de la del elemento
function abbreviatedConfig(atomicNumber: number, subshells: Subshell[]) {
  const coreNumber = nobleGasNumbers.find((number) => number < atomicNumber)
  if (!coreNumber) return null
  return {
    core: ELEMENTS[coreNumber - 1],
    subshells: subshells.slice(buildSubshells(coreNumber).length),
  }
}

function cleanExplanation(text: string): string {
  return text
    .replace(/\*\*/g, '')
    .replace(/^#+\s*/gm, '')
    .trim()
}

function countLabel(count: number): string {
  return `${count} ${count === 1 ? 'elemento' : 'elementos'}`
}

function formatMass(mass: number): string {
  return mass.toLocaleString('es-MX', { maximumFractionDigits: 3 })
}

async function askModel(path: string, prompt: string): Promise<string> {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  let response: Response
  try {
    response = await fetch(`${apiUrl.replace(/\/$/, '')}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })
  } catch {
    // Sin esto se mostraría el "Failed to fetch" del navegador
    throw new Error('No se pudo conectar con el asistente de química. La configuración de arriba sigue siendo correcta.')
  }

  let data: unknown
  try {
    data = await response.json()
  } catch {
    throw new Error('El servidor de química devolvió una respuesta no válida.')
  }

  if (typeof data !== 'object' || data === null) {
    throw new Error('El servidor de química devolvió una respuesta no válida.')
  }

  const payload = data as { answer?: unknown; detail?: unknown }
  if (!response.ok) {
    throw new Error(
      typeof payload.detail === 'string'
        ? payload.detail
        : `No se pudo generar la respuesta (HTTP ${response.status}).`,
    )
  }
  if (typeof payload.answer !== 'string' || !payload.answer.trim()) {
    throw new Error('El modelo no devolvió una respuesta.')
  }

  return payload.answer
}

// Los superíndices se leen mal en lectores de pantalla, así que va una versión hablada aparte
function ConfigText({ subshells, core }: { subshells: Subshell[]; core?: PeriodicElement }) {
  const spoken = [
    core && `núcleo de ${core.name}`,
    ...subshells.map(({ orbital, electrons }) => `${orbital} ${electrons}`),
  ].filter(Boolean).join(', ')

  return (
    <>
      <span aria-hidden="true">
        {core && <span className="whitespace-nowrap">[{core.symbol}]</span>}
        {subshells.map(({ orbital, electrons }, index) => (
          <span key={orbital}>
            {(index > 0 || core) && ' '}
            <span className="whitespace-nowrap">
              {orbital}
              <sup>{electrons}</sup>
            </span>
          </span>
        ))}
      </span>
      <span className="sr-only">{spoken}</span>
    </>
  )
}

function AtomModel({ shells, symbol }: { shells: number[]; symbol: string }) {
  const rings = shells.length > 0 ? shells : [0, 0, 0]
  const step = Math.min(28, 84 / rings.length)

  return (
    <svg viewBox="0 0 240 240" className="mx-auto block w-full max-w-64" aria-hidden="true">
      {rings.map((count, index) => {
        const radius = 22 + (index + 1) * step
        return (
          <g key={index}>
            <circle
              cx="120"
              cy="120"
              r={radius}
              fill="none"
              stroke="rgb(255 255 255 / 0.18)"
              strokeDasharray={shells.length > 0 ? undefined : '3 6'}
            />
            {count > 0 && (
              <g
                className={`ec-orbit ${index % 2 === 1 ? 'ec-orbit-reverse' : ''}`}
                style={{ animationDuration: `${18 + index * 7}s` }}
              >
                {Array.from({ length: count }, (_, electron) => {
                  const angle = (electron / count) * Math.PI * 2 + index * 0.6
                  return (
                    <circle
                      key={electron}
                      cx={120 + radius * Math.cos(angle)}
                      cy={120 + radius * Math.sin(angle)}
                      r={count > 12 ? 2.6 : 3.6}
                      fill="#5eead4"
                    />
                  )
                })}
              </g>
            )}
          </g>
        )
      })}
      <circle cx="120" cy="120" r="24" fill="#0f766e" stroke="#5eead4" strokeOpacity="0.6" strokeWidth="2" />
      <text x="120" y="121" textAnchor="middle" dominantBaseline="central" fill="#ffffff" fontSize="17" fontWeight="700" className="font-display">
        {symbol}
      </text>
    </svg>
  )
}

function ElementTile({ element }: { element: PeriodicElement }) {
  return (
    <div className={`flex size-28 shrink-0 flex-col justify-between rounded-2xl border-2 p-3 ${CATEGORY_INFO[element.category].cell}`} aria-hidden="true">
      <span className="text-sm font-semibold tabular-nums">{element.number}</span>
      <span className="font-display text-5xl font-extrabold leading-none">{element.symbol}</span>
      <span className="truncate text-xs font-medium tabular-nums">{formatMass(element.mass)}</span>
    </div>
  )
}

const elementGroups = (Object.keys(CATEGORY_INFO) as ElementCategory[]).map((category) => ({
  category,
  ...CATEGORY_INFO[category],
  elements: ELEMENTS.filter((element) => element.category === category),
}))

type RecentResult = { number: number; name: string; symbol: string; config: string }

export function ElectronicConfig() {
  const [atomicNumber, setAtomicNumber] = useState('26')
  const [message, setMessage] = useState('Escribe un número atómico o elige un elemento de la lista.')
  const [inputError, setInputError] = useState(false)
  const [current, setCurrent] = useState<{ element: PeriodicElement; subshells: Subshell[] } | null>(null)
  const [properties, setProperties] = useState('')
  const [propertiesError, setPropertiesError] = useState('')
  const [propertiesLoading, setPropertiesLoading] = useState(false)
  const [previousResults, setPreviousResults] = useState<RecentResult[]>([])
  const [selectedCategories, setSelectedCategories] = useState<ElementCategory[]>([])
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false)
  const stageRef = useRef<HTMLElement>(null)
  const categoryMenuRef = useRef<HTMLDivElement>(null)
  // Si eligen otro elemento antes de que llegue la explicación, la respuesta vieja se descarta
  const requestRef = useRef(0)

  useEffect(() => {
    if (!categoryMenuOpen) return
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!categoryMenuRef.current?.contains(event.target as Node)) setCategoryMenuOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsidePointer)
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer)
  }, [categoryMenuOpen])

  const typedNumber = Number(atomicNumber)
  const typedElement = ELEMENTS[typedNumber - 1]

  const clearResults = () => {
    requestRef.current += 1
    setCurrent(null)
    setProperties('')
    setPropertiesError('')
    setPropertiesLoading(false)
    setInputError(false)
  }

  const calculate = async (number: number) => {
    clearResults()
    const requestId = requestRef.current

    if (isNaN(number)) {
      setInputError(true)
      setMessage('Por favor, introduce un número válido.')
      return
    }

    let subshells: Subshell[]
    try {
      subshells = buildSubshells(number)
    } catch (error) {
      setInputError(true)
      setMessage(error instanceof Error ? error.message : 'No se pudo calcular la configuración.')
      return
    }

    const element = ELEMENTS[number - 1]
    const config = toConfigString(subshells)

    setCurrent({ element, subshells })
    setPreviousResults((previous) =>
      [
        { number, name: element.name, symbol: element.symbol, config },
        ...previous.filter((item) => item.number !== number),
      ].slice(0, 6),
    )
    setMessage(`Configuración electrónica de ${element.name} (Z = ${number}) calculada.`)
    setPropertiesLoading(true)

    let explanationText = ''
    try {
      const answer = await askModel('/electronic-config', [
        `Elemento: ${element.name}`,
        `Número atómico: ${number}`,
        `Configuración electrónica: ${config}`,
        'Explica qué significa la configuración electrónica y cómo se construyó, paso a paso, usando el orden de llenado y la capacidad de cada orbital. Muestra cómo la distribución corresponde al número atómico y qué indica sobre los electrones externos y las propiedades químicas del elemento. Basa la explicación en la configuración proporcionada; no la cambies ni inventes datos. Usa lenguaje claro para un estudiante y no hagas preguntas.',
      ].join('\n'))
      explanationText = cleanExplanation(answer)
      if (requestId === requestRef.current) setProperties(explanationText)
    } catch (error) {
      if (requestId === requestRef.current) {
        setPropertiesError(
          error instanceof Error
            ? error.message
            : 'No se pudo conectar con el asistente de química.',
        )
      }
    } finally {
      if (requestId === requestRef.current) setPropertiesLoading(false)
    }

    const token = localStorage.getItem('quimica-token')
    if (token) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      try {
        // El backend espera los mismos campos que el historial del balanceador
        const response = await fetch(`${apiUrl.replace(/\/$/, '')}/history`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            ecuacion: `Configuración electrónica: ${element.name} (Z = ${number})`,
            resultado: config,
            explicacion: explanationText || undefined,
          }),
        })
        if (response.ok) window.dispatchEvent(new Event('chemistry-history-updated'))
      } catch {
        // El resultado sigue disponible aunque no se guarde el historial.
      }
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void calculate(parseInt(atomicNumber, 10))
  }

  const loadElement = (number: number) => {
    setAtomicNumber(String(number))
    void calculate(number)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    stageRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' })
  }

  const stepNumber = (delta: number) => {
    const base = Number.isInteger(typedNumber) ? typedNumber : 0
    setAtomicNumber(String(Math.min(118, Math.max(1, base + delta))))
    clearResults()
  }

  const toggleCategory = (category: ElementCategory) => {
    setSelectedCategories((previous) =>
      previous.includes(category)
        ? previous.filter((item) => item !== category)
        : [...previous, category],
    )
  }

  const visibleGroups = selectedCategories.length > 0
    ? elementGroups.filter((group) => selectedCategories.includes(group.category))
    : elementGroups
  const visibleCount = visibleGroups.reduce((total, group) => total + group.elements.length, 0)

  const shells = current ? electronsPerShell(current.subshells) : []
  const abbreviated = current ? abbreviatedConfig(current.element.number, current.subshells) : null

  return (
    <section id="configuracion-electronica" className="mx-auto w-full max-w-360 scroll-mt-20 px-4 pb-20 pt-10 sm:px-8 lg:px-10">
      <header className="mb-10 max-w-3xl">
        <p className="ec-eyebrow">Calculadora · Estructura atómica</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-6xl">Configuración electrónica</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Descubre cómo se reparten los electrones de cualquier elemento en capas y subniveles, del 1s al 7p.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0 space-y-6">
          <form onSubmit={handleSubmit} className="ec-card" noValidate>
            <label htmlFor="atomic-number" className="block text-sm font-semibold text-slate-800">
              Número atómico (Z)
            </label>
            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="ec-stepper"
                    onClick={() => stepNumber(-1)}
                    disabled={typedNumber <= 1}
                    aria-label="Restar uno al número atómico"
                  >
                    <Minus size={18} aria-hidden="true" />
                  </button>
                  <input
                    id="atomic-number"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    max="118"
                    value={atomicNumber}
                    onChange={(event) => {
                      setAtomicNumber(event.target.value)
                      clearResults()
                    }}
                    placeholder="26"
                    className="ec-number-input"
                    aria-invalid={inputError}
                    aria-describedby="atomic-number-hint atomic-number-status"
                  />
                  <button
                    type="button"
                    className="ec-stepper"
                    onClick={() => stepNumber(1)}
                    disabled={typedNumber >= 118}
                    aria-label="Sumar uno al número atómico"
                  >
                    <Plus size={18} aria-hidden="true" />
                  </button>
                </div>
                <p id="atomic-number-hint" className="text-sm text-slate-600">
                  {typedElement ? (
                    <>
                      Corresponde a <span className="font-semibold text-slate-900">{typedElement.name}</span> ({typedElement.symbol})
                    </>
                  ) : (
                    'Usa un número entero del 1 al 118.'
                  )}
                </p>
              </div>
              <button type="submit" className="button-primary shrink-0 justify-center whitespace-nowrap">
                Calcular configuración
                <span aria-hidden="true">&#8594;</span>
              </button>
            </div>
            <p
              id="atomic-number-status"
              className={`mt-4 text-sm ${inputError ? 'font-medium text-red-700' : 'text-slate-600'}`}
              aria-live="polite"
            >
              {message}
            </p>
          </form>

          <section ref={stageRef} className="ec-stage scroll-mt-24" aria-labelledby="ec-stage-title">
            {current ? (
              <div key={current.element.number} className="ec-enter @container">
                <div className="grid gap-8 @2xl:grid-cols-[minmax(0,1fr)_15rem] @2xl:items-center">
                  <div className="flex flex-wrap items-center gap-5">
                    <ElementTile element={current.element} />
                    <div className="min-w-0">
                      <p className="ec-stage-label">{CATEGORY_INFO[current.element.category].label}</p>
                      <h2 id="ec-stage-title" className="mt-1 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        {current.element.name}
                        <span className="sr-only">, símbolo {current.element.symbol}, número atómico {current.element.number}</span>
                      </h2>
                      <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        <div>
                          <dt className="text-slate-400">Masa atómica</dt>
                          <dd className="font-semibold tabular-nums text-white">{formatMass(current.element.mass)} u</dd>
                        </div>
                        <div>
                          <dt className="text-slate-400">Estado</dt>
                          <dd className="font-semibold text-white">{current.element.state}</dd>
                        </div>
                        <div>
                          <dt className="text-slate-400">Capas ocupadas</dt>
                          <dd className="font-semibold tabular-nums text-white">{shells.length}</dd>
                        </div>
                        <div>
                          <dt className="text-slate-400">En la última capa</dt>
                          <dd className="font-semibold tabular-nums text-white">{shells[shells.length - 1]} electrones</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  <div>
                    <AtomModel shells={shells} symbol={current.element.symbol} />
                    <ol className="mt-4 flex flex-wrap justify-center gap-1.5" aria-label="Electrones por capa">
                      {shells.map((count, index) => (
                        <li key={shellLetters[index]} className="ec-shell-chip">
                          <span aria-hidden="true" className="font-semibold text-teal-300">{shellLetters[index]}</span>
                          <span aria-hidden="true" className="tabular-nums">{count}</span>
                          <span className="sr-only">Capa {shellLetters[index]}: {count} electrones</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="ec-stage-label">Configuración electrónica</p>
                  <p className="ec-config mt-2">
                    <ConfigText subshells={current.subshells} />
                  </p>
                  {abbreviated && (
                    <p className="mt-4 text-sm text-slate-300">
                      <span className="font-semibold text-slate-100">Notación abreviada: </span>
                      <span className="ec-config-inline">
                        <ConfigText subshells={abbreviated.subshells} core={abbreviated.core} />
                      </span>
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid items-center gap-6 sm:grid-cols-[12rem_minmax(0,1fr)]">
                <div className="mx-auto w-40 opacity-80 sm:w-full">
                  <AtomModel shells={[]} symbol="?" />
                </div>
                <div>
                  <h2 id="ec-stage-title" className="font-display text-2xl font-bold tracking-tight text-white">Tu átomo aparecerá aquí</h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">
                    Calcula un número atómico o toca un elemento de la lista para ver sus capas, sus subniveles y su configuración completa.
                  </p>
                </div>
              </div>
            )}
          </section>

          {current && (
            <>
              <section className="ec-card" aria-labelledby="ec-subshells-title">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h2 id="ec-subshells-title" className="ec-card-title">Orden de llenado</h2>
                    <p className="mt-1 text-sm text-slate-600">Los electrones ocupan primero los subniveles de menor energía.</p>
                  </div>
                  <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-700" aria-label="Capacidad máxima de cada tipo de subnivel">
                    {(Object.keys(orbitalCapacity) as OrbitalType[]).map((type) => (
                      <li key={type} className="flex items-center gap-1.5">
                        <span className={`size-2.5 rounded-sm ${orbitalFill[type]}`} aria-hidden="true" />
                        <span><span className="font-semibold">{type}</span>: máx. {orbitalCapacity[type]}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <ol className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(5rem,1fr))] gap-2" aria-label="Subniveles en orden de llenado">
                  {current.subshells.map((subshell) => (
                    <li key={subshell.orbital} className="ec-subshell">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="font-display text-base font-bold text-slate-900">{subshell.orbital}</span>
                        <span className="text-xs tabular-nums text-slate-600" aria-hidden="true">{subshell.electrons}/{subshell.capacity}</span>
                      </span>
                      <span className="sr-only">: {subshell.electrons} de {subshell.capacity} electrones</span>
                      <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-slate-200" aria-hidden="true">
                        <span
                          className={`block h-full rounded-full ${orbitalFill[subshell.type]}`}
                          style={{ width: `${(subshell.electrons / subshell.capacity) * 100}%` }}
                        />
                      </span>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="ec-card" aria-labelledby="ec-ai-title" aria-busy={propertiesLoading}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="ai-status-dot" aria-hidden="true" />
                  <h2 id="ec-ai-title" className="ec-card-title">¿Cómo se construyó?</h2>
                  <span className="ai-model-badge">Llama 3.1 · 8B</span>
                </div>
                <div aria-live="polite">
                  {propertiesLoading && (
                    <p className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                      <span className="size-4 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600 motion-reduce:animate-none" aria-hidden="true" />
                      Preparando la explicación paso a paso…
                    </p>
                  )}
                  {propertiesError && <p className="mt-4 text-sm font-medium text-amber-800">{propertiesError}</p>}
                  {properties && (
                    <div className="mt-4 max-w-prose space-y-3 text-[0.95rem] leading-7 text-slate-700">
                      {properties.split(/\n\s*\n/).map((paragraph, index) => (
                        <p key={index} className="whitespace-pre-wrap">{paragraph}</p>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </>
          )}

          <section aria-labelledby="previous-results-title">
            <div className="mb-3 flex items-center justify-between">
              <h2 id="previous-results-title" className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">Resultados recientes</h2>
              {previousResults.length > 0 && <span className="text-xs text-slate-600">{countLabel(previousResults.length)}</span>}
            </div>
            {previousResults.length > 0 ? (
              <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {previousResults.map((item) => {
                  const subshells = buildSubshells(item.number)
                  const short = abbreviatedConfig(item.number, subshells)
                  return (
                    <li key={item.number}>
                      <button type="button" className="ec-recent" onClick={() => loadElement(item.number)}>
                        <span className={`grid size-10 shrink-0 place-items-center rounded-xl border font-display text-sm font-bold ${CATEGORY_INFO[ELEMENTS[item.number - 1].category].cell}`} aria-hidden="true">
                          {item.symbol}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-semibold">{item.name}</span>
                          <span className="ec-config-small block truncate">
                            {short ? <ConfigText subshells={short.subshells} core={short.core} /> : <ConfigText subshells={subshells} />}
                          </span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="text-sm text-slate-600">Las configuraciones que calcules aparecerán aquí.</p>
            )}
          </section>
        </div>

        <aside className="ec-card h-fit lg:sticky lg:top-24" aria-labelledby="elements-list-title">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="elements-list-title" className="ec-card-title">Elige un elemento</h2>
            <p className="text-xs tabular-nums text-slate-600" aria-live="polite">{countLabel(visibleCount)}</p>
          </div>

          <div className="mt-4 flex gap-2" role="group" aria-label="Filtrar elementos por tipo">
            <button
              type="button"
              className="category-chip"
              aria-pressed={selectedCategories.length === 0}
              onClick={() => {
                setSelectedCategories([])
                setCategoryMenuOpen(false)
              }}
            >
              Todos
            </button>
            <div
              ref={categoryMenuRef}
              className="relative"
              onKeyDown={(event) => {
                if (event.key !== 'Escape') return
                setCategoryMenuOpen(false)
                event.currentTarget.querySelector('button')?.focus()
              }}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setCategoryMenuOpen(false)
              }}
            >
              <button
                type="button"
                className="category-chip"
                data-active={selectedCategories.length > 0}
                aria-expanded={categoryMenuOpen}
                aria-controls={categoryMenuOpen ? 'category-menu' : undefined}
                onClick={() => setCategoryMenuOpen((open) => !open)}
              >
                Tipos
                {selectedCategories.length > 0 && (
                  <span className="tabular-nums">
                    ({selectedCategories.length}<span className="sr-only"> seleccionados</span>)
                  </span>
                )}
                <ChevronDown
                  aria-hidden="true"
                  size={14}
                  className={`transition-transform duration-200 motion-reduce:transition-none ${categoryMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {categoryMenuOpen && (
                <div
                  id="category-menu"
                  className="absolute left-0 top-full z-20 mt-2 max-h-64 w-60 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg"
                >
                  {elementGroups.map((group) => {
                    const selected = selectedCategories.includes(group.category)
                    return (
                      <button
                        key={group.category}
                        type="button"
                        className="category-option"
                        aria-pressed={selected}
                        onClick={() => toggleCategory(group.category)}
                      >
                        <span className={`size-2.5 shrink-0 rounded-full ${group.dot}`} aria-hidden="true" />
                        <span className="flex-1">{group.label}</span>
                        <span className="tabular-nums text-slate-500">{group.elements.length}</span>
                        <Check aria-hidden="true" size={14} className={`shrink-0 text-teal-700 ${selected ? '' : 'invisible'}`} />
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="-mx-2 mt-4 max-h-96 overflow-y-auto px-2 lg:max-h-[calc(100vh-17rem)]">
            {visibleGroups.map((group) => (
              <section key={group.category} className="mb-4 last:mb-0" aria-labelledby={`group-${group.category}`}>
                <h3
                  id={`group-${group.category}`}
                  className="sticky top-0 z-10 flex items-center gap-2 bg-white py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600"
                >
                  <span className={`size-2.5 rounded-full ${group.dot}`} aria-hidden="true" />
                  {group.label}
                  <span className="font-normal normal-case tracking-normal text-slate-500">({group.elements.length})</span>
                </h3>
                <ul className="grid gap-0.5">
                  {group.elements.map((element) => (
                    <li key={element.number}>
                      <button
                        type="button"
                        className="ec-element"
                        aria-current={current?.element.number === element.number ? 'true' : undefined}
                        onClick={() => loadElement(element.number)}
                      >
                        <span className={`grid size-9 shrink-0 place-items-center rounded-lg border font-display text-sm font-bold ${group.cell}`}>
                          {element.symbol}
                        </span>
                        <span className="min-w-0 flex-1 truncate">{element.name}</span>
                        <span className="text-xs tabular-nums text-slate-600">
                          <span className="sr-only">número atómico </span>
                          {element.number}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}
