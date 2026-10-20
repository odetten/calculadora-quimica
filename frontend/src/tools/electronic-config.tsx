import { useRef, useState, type FormEvent, type ReactElement } from 'react'
import { PERIODIC_ELEMENTS } from './periodicTable.ts'

const orbitalOrder = ['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p', '6s', '4f', '5d', '6p', '7s', '5f', '6d', '7p']
const orbitalCapacity: Record<string, number> = {
  's': 2, 'p': 6, 'd': 10, 'f': 14,
}

function getOrbitalType(orbital: string): string {
  return orbital[orbital.length - 1]
}

function getOrbitalCapacityForOrbital(orbital: string): number {
  return orbitalCapacity[getOrbitalType(orbital)] ?? 2
}

function generateElectronicConfig(atomicNumber: number): string {
  if (atomicNumber <= 0 || atomicNumber > 118) {
    throw new Error('El número atómico debe estar entre 1 y 118.')
  }

  const config: Array<{ orbital: string; electrons: number }> = []
  let remaining = atomicNumber

  for (const orbital of orbitalOrder) {
    if (remaining <= 0) break
    const capacity = getOrbitalCapacityForOrbital(orbital)
    const electrons = Math.min(remaining, capacity)
    config.push({ orbital, electrons })
    remaining -= electrons
  }

  return config.map(({ orbital, electrons }) => `${orbital}${electrons}`).join(' ')
}

function formatElectronicConfig(config: string): ReactElement {
  const parts = config.split(' ')
  return (
    <span aria-hidden="true">
      {parts.map((part, index) => {
        const orbital = part.replace(/\d+$/, '')
        const electrons = part.slice(orbital.length)
        return (
          <span key={index}>
            {orbital}
            <sup>{electrons}</sup>
            {index < parts.length - 1 && ' '}
          </span>
        )
      })}
    </span>
  )
}

async function askModel(path: string, prompt: string): Promise<string> {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  const response = await fetch(`${apiUrl.replace(/\/$/, '')}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })

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

const suggestedElements = [
  { number: 1, name: 'Hidrógeno' },
  { number: 6, name: 'Carbono' },
  { number: 8, name: 'Oxígeno' },
  { number: 11, name: 'Sodio' },
  { number: 26, name: 'Hierro' },
  { number: 29, name: 'Cobre' },
  { number: 35, name: 'Bromo' },
  { number: 47, name: 'Plata' },
  { number: 79, name: 'Oro' },
  { number: 92, name: 'Uranio' },
]

export function ElectronicConfig() {
  const [atomicNumber, setAtomicNumber] = useState('26')
  const [message, setMessage] = useState('Introduce un número atómico (1-118) para ver la configuración electrónica.')
  const [config, setConfig] = useState('')
  const [properties, setProperties] = useState('')
  const [propertiesError, setPropertiesError] = useState('')
  const [propertiesLoading, setPropertiesLoading] = useState(false)
  const [previousResults, setPreviousResults] = useState<Array<{ number: number; name: string; config: string }>>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  const clearResults = () => {
    setConfig('')
    setProperties('')
    setPropertiesError('')
  }

  const calculate = async (number: number) => {
    clearResults()

    if (isNaN(number)) {
      setMessage('Por favor, introduce un número válido.')
      return
    }

    let result: string
    try {
      result = generateElectronicConfig(number)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo calcular la configuración.')
      return
    }

    const elementName = PERIODIC_ELEMENTS.find((e) => e.number === number)?.name || 'Elemento desconocido'

    setConfig(result)
    setPreviousResults((previous) =>
      [
        { number, name: elementName, config: result },
        ...previous,
      ].slice(0, 5),
    )
    setMessage(`Configuración electrónica de ${elementName} (Z=${number}) calculada.`)
    setPropertiesLoading(true)

    try {
      const answer = await askModel('/ask', [
        `Elemento: ${elementName}`,
        `Número atómico: ${number}`,
        `Configuración electrónica: ${result}`,
        'Describe brevemente las propiedades químicas de este elemento basándote en su configuración electrónica. Sé conciso, máximo 3-4 oraciones. No hagas preguntas.',
      ].join('\n'))
      setProperties(answer.trim())
    } catch (error) {
      setPropertiesError(
        error instanceof Error
          ? error.message
          : 'No se pudo conectar con el asistente de química.',
      )
    } finally {
      setPropertiesLoading(false)
    }

    const token = localStorage.getItem('quimica-token')
    if (token) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      try {
        await fetch(`${apiUrl.replace(/\/$/, '')}/history`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ configuracion: `${elementName}: ${result}`, numero_atomico: number }),
        })
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
  }

  return (
    <>
      <section id="configuracion-electronica" ref={sectionRef} className="equation-section mx-auto flex min-h-[calc(100vh-104px)] w-full max-w-[1600px] scroll-mt-20 flex-col justify-center px-6 pb-16 pt-10 sm:px-10">
        <div className="mb-14 flex w-full flex-col items-center text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">Calculadora</p>
          <h1 className="font-display text-5xl font-semibold leading-[0.98] tracking-tight text-slate-950 sm:text-7xl">Configuración electrónica</h1>
          <p className="mt-6 max-w-2xl self-center text-center text-base leading-7 text-slate-600">Descubre cómo se distribuyen los electrones en los orbitales atómicos de cualquier elemento.</p>
        </div>

        <div className="equation-workspace grid w-full gap-8 xl:grid-cols-[minmax(220px,1fr)_minmax(0,900px)_minmax(220px,1fr)]">
          <aside className="ideas-card h-fit xl:self-center xl:col-start-1 xl:row-start-1" aria-labelledby="elements-list-title">
            <div className="mb-4">
              <p className="ideas-eyebrow">Elementos sugeridos</p>
              <h2 id="elements-list-title" className="mt-1 text-lg font-semibold tracking-tight text-slate-900">Ejemplos interesantes</h2>
              <p className="mt-1 text-xs leading-5 text-slate-600">Toca uno para explorarlo.</p>
            </div>
            <ul className="grid gap-2">
              {suggestedElements.map((element) => (
                <li key={element.number}>
                  <button
                    type="button"
                    className="idea-button"
                    onClick={() => loadElement(element.number)}
                  >
                    <span className="block text-xs font-semibold text-slate-800">{element.name}</span>
                    <span className="mt-1 block text-[0.65rem] font-mono text-teal-700">Z = {element.number}</span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className="min-w-0 xl:col-start-2 xl:row-start-1">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="equation-shell flex w-full flex-col items-center justify-center gap-4 border-y-2 border-slate-400 py-8 sm:py-12">
                <label className="w-full flex flex-col items-center gap-2">
                  <span className="text-sm font-semibold text-slate-700">Número atómico (1-118)</span>
                  <span className="formula-editor w-36 flex-none">
                    <input
                      ref={inputRef}
                      type="number"
                      min="1"
                      max="118"
                      value={atomicNumber}
                      onChange={(e) => {
                        setAtomicNumber(e.target.value)
                        clearResults()
                      }}
                      onFocus={() => {
                        requestAnimationFrame(() => sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
                      }}
                      placeholder="26"
                      className="formula-input w-full text-center"
                      style={{ fontFamily: 'var(--font-display)' }}
                      aria-label="Número atómico"
                    />
                  </span>
                </label>
              </div>

              <div className="mt-7 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
                <p className="text-sm text-slate-600" aria-live="polite">{message}</p>
                <button type="submit" className="button-primary disabled:cursor-wait disabled:opacity-60" disabled={propertiesLoading}>
                  Calcular configuración
                  <span aria-hidden="true">&#8594;</span>
                </button>
              </div>

              {config && (
                <>
                  <div className="result-panel" aria-live="polite">
                    <span className="result-label">Configuración electrónica</span>
                    <span className="result-equation text-2xl font-mono">
                      {formatElectronicConfig(config)}
                    </span>
                  </div>

                  <section className="ai-explanation" aria-label="Propiedades del elemento" aria-live="polite" aria-busy={propertiesLoading}>
                    <div className="ai-explanation-heading">
                      <span className="ai-status-dot" aria-hidden="true" />
                      Propiedades químicas
                      <span className="ai-model-badge">Llama 3.1 · 8B</span>
                    </div>
                    {propertiesLoading && <p className="ai-explanation-text">Analizando la configuración electrónica…</p>}
                    {propertiesError && <p className="ai-explanation-text text-amber-800">{propertiesError}</p>}
                    {properties && <p className="ai-explanation-text whitespace-pre-wrap">{properties}</p>}
                  </section>
                </>
              )}
            </form>

            <section className="mt-10 w-full border-t border-slate-200 pt-6" aria-labelledby="previous-results-title">
              <div className="mb-4 flex items-center justify-between">
                <h2 id="previous-results-title" className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">Resultados recientes</h2>
                {previousResults.length > 0 && <span className="text-xs text-slate-600">{previousResults.length} elementos</span>}
              </div>
              {previousResults.length > 0 ? (
                <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {previousResults.map((item, index) => (
                    <li key={`${item.number}-${index}`} className="rounded-xl border border-slate-200 bg-white/70 px-4 py-3">
                      <p className="text-xs font-semibold text-slate-700">{item.name}</p>
                      <p className="mt-1 text-[0.7rem] font-mono text-teal-700">Z = {item.number}</p>
                      <p className="result-equation mt-2 text-xs font-mono leading-5">
                        {formatElectronicConfig(item.config)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-600">Las configuraciones que calcules aparecerán aquí.</p>
              )}
            </section>
          </div>
        </div>
      </section>
    </>
  )
}
