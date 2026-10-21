import { Fragment, useRef, useState, type FormEvent } from 'react'
import { Check, CheckCircle2, LayoutGrid, Scale } from 'lucide-react'
import { balanceEquation, countAtoms } from './chemistry.ts'
import { extractElements } from './elements.ts'

const periodicRows: Array<Array<string | null>> = [
  ['H', ...Array(16).fill(null), 'He'],
  ['Li', 'Be', ...Array(10).fill(null), 'B', 'C', 'N', 'O', 'F', 'Ne'],
  ['Na', 'Mg', ...Array(10).fill(null), 'Al', 'Si', 'P', 'S', 'Cl', 'Ar'],
  ['K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr'],
  ['Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe'],
  ['Cs', 'Ba', '*', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn'],
  ['Fr', 'Ra', '**', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og'],
]

const elementGroups = {
  alkali: new Set(['Li', 'Na', 'K', 'Rb', 'Cs', 'Fr']),
  alkaline: new Set(['Be', 'Mg', 'Ca', 'Sr', 'Ba', 'Ra']),
  transition: new Set(['Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn']),
  postTransition: new Set(['Al', 'Ga', 'In', 'Sn', 'Tl', 'Pb', 'Bi', 'Nh', 'Fl', 'Mc', 'Lv']),
  metalloid: new Set(['B', 'Si', 'Ge', 'As', 'Sb', 'Te', 'Po']),
  nonmetal: new Set(['H', 'C', 'N', 'O', 'P', 'S', 'Se']),
  halogen: new Set(['F', 'Cl', 'Br', 'I', 'At', 'Ts']),
  nobleGas: new Set(['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn', 'Og']),
}

function getElementGroup(element: string) {
  if (element === '*') return 'lanthanoid'
  if (element === '**') return 'actinoid'
  return Object.entries(elementGroups).find(([, elements]) => elements.has(element))?.[0] ?? 'unknown'
}

const elementGroupLabels = [
  ['alkali', 'Alcalinos'],
  ['alkaline', 'Alcalinotérreos'],
  ['transition', 'Transición'],
  ['postTransition', 'Otros metales'],
  ['metalloid', 'Metaloides'],
  ['nonmetal', 'No metales'],
  ['halogen', 'Halógenos'],
  ['nobleGas', 'Gases nobles'],
  ['lanthanoid', 'Lantánidos'],
  ['actinoid', 'Actínidos'],
] as const

const equationIdeas = [
  { label: 'Formación de agua', reactants: 'H_2 + O_2', products: 'H_2O' },
  { label: 'Síntesis de amoníaco', reactants: 'N_2 + H_2', products: 'NH_3' },
  { label: 'Combustión de metano', reactants: 'CH_4 + O_2', products: 'CO_2 + H_2O' },
  { label: 'Neutralización', reactants: 'HCl + NaOH', products: 'NaCl + H_2O' },
]

const subscriptPattern = /_(\d+)/g

function cleanExplanation(text: string): string {
  return text
    .replace(/\*/g, '')
    .replace(/([A-Za-z0-9])_(\d+)/g, '$1$2')
    .replace(/→/g, '->')
    .replace(/^#+\s*/gm, '')
    .trim()
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

function FormulaPreview({ value }: { value: string }) {
  const parts = value.split(subscriptPattern)

  return (
    <span aria-hidden="true">
      {parts.map((part, index) => index % 2 === 1 ? <sub key={`${part}-${index}`}>{part}</sub> : part)}
    </span>
  )
}

// Ecuación balanceada con los coeficientes resaltados, p. ej. "4Fe + 3O_2 → 2Fe_2O_3"
function BalancedEquation({ value }: { value: string }) {
  return (
    <>
      <span className="sr-only">{value.replace(/_/g, '')}</span>
      {value.split(' → ').map((side, sideIndex) => (
        <Fragment key={sideIndex}>
          {sideIndex === 1 && <span className="balance-arrow" aria-hidden="true">→</span>}
          {side.split(' + ').map((term, termIndex) => {
            const [, coefficient, formula] = term.match(/^(\d*)(.*)$/) ?? ['', '', term]
            return (
              <Fragment key={termIndex}>
                {termIndex > 0 && <span className="balance-plus" aria-hidden="true">+</span>}
                <span className="whitespace-nowrap" aria-hidden="true">
                  {coefficient && <span className="balance-coefficient">{coefficient}</span>}
                  <FormulaPreview value={formula} />
                </span>
              </Fragment>
            )
          })}
        </Fragment>
      ))}
    </>
  )
}

function atomCheck(balanced: string) {
  const [left, right] = balanced.split(' → ').map(countAtoms)
  return Object.keys(left).map((element) => ({ element, left: left[element], right: right[element] ?? 0 }))
}

export function Balance() {
  const [reactants, setReactants] = useState('Fe + O_2')
  const [products, setProducts] = useState('Fe_2O_3')
  const [message, setMessage] = useState('Completa la ecuación y encuentra sus coeficientes.')
  const [messageIsError, setMessageIsError] = useState(false)
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [activeInput, setActiveInput] = useState<'reactants' | 'products'>('reactants')
  const [balancedResult, setBalancedResult] = useState('')
  const [explanation, setExplanation] = useState('')
  const [explanationError, setExplanationError] = useState('')
  const [explanationLoading, setExplanationLoading] = useState(false)
  const [applications, setApplications] = useState('')
  const [applicationsError, setApplicationsError] = useState('')
  const [applicationsLoading, setApplicationsLoading] = useState(false)
  const [previousResults, setPreviousResults] = useState<Array<{ input: string; balanced: string }>>([])
  const reactantsRef = useRef<HTMLInputElement>(null)
  const productsRef = useRef<HTMLInputElement>(null)
  const equationCardRef = useRef<HTMLFormElement>(null)

  const getInputWidth = (value: string) => `${Math.max(value.replace(/_/g, '').length + 1, 8)}ch`

  const clearResults = () => {
    setBalancedResult('')
    setExplanation('')
    setExplanationError('')
    setApplications('')
    setApplicationsError('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    clearResults()

    const equation = `${reactants} -> ${products}`
    let result: string
    try {
      result = balanceEquation(equation)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo balancear la ecuación.')
      setMessageIsError(true)
      return
    }

    setBalancedResult(result)
    setPreviousResults((previous) => [
      { input: equation, balanced: result },
      ...previous,
    ].slice(0, 3))
    setMessage('Balance encontrado con los menores coeficientes enteros.')
    setMessageIsError(false)
    setExplanationLoading(true)
    setApplicationsLoading(true)
    let explanationText = ''
    let applicationsText = ''

    // 1) Explicación paso a paso
    try {
      const answer = await askModel('/ask', [
        `Ecuación original: ${reactants} -> ${products}`,
        `Solución del sistema (solo para tu uso interno, no la muestres antes del último paso): ${result}`,
        'Empieza tu respuesta directamente con la línea "Ecuación original". No hagas preguntas.',
      ].join('\n'))
      explanationText = cleanExplanation(answer)
      setExplanation(explanationText)
    } catch (error) {
      setExplanationError(
        error instanceof Error
          ? error.message
          : 'No se pudo conectar con el asistente de química.',
      )
    } finally {
      setExplanationLoading(false)
    }

    // 2) Aplicaciones de cada elemento (los nombres salen de elements.ts, no del modelo)
    const elements = extractElements(`${reactants} ${products}`)
    if (elements.length === 0) {
      setApplicationsLoading(false)
      return
    }

    try {
      const answer = await askModel('/applications', [
        'Elementos de la ecuación, en este orden:',
        ...elements.map(({ symbol, name }) => `- ${symbol} (${name})`),
        'Describe las aplicaciones de cada uno de estos elementos y de ningún otro. Empieza directamente con el primer elemento. No hagas preguntas.',
      ].join('\n'))
      applicationsText = cleanExplanation(answer)
      setApplications(applicationsText)
    } catch (error) {
      setApplicationsError(
        error instanceof Error
          ? error.message
          : 'No se pudo conectar con el asistente de química.',
      )
    } finally {
      setApplicationsLoading(false)
    }

    const token = localStorage.getItem('quimica-token')
    if (token) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      try {
        const response = await fetch(`${apiUrl.replace(/\/$/, '')}/history`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ ecuacion: equation, resultado: result, explicacion: explanationText, aplicaciones: applicationsText }),
        })
        if (response.ok) window.dispatchEvent(new Event('chemistry-history-updated'))
      } catch {
        // El resultado del balanceo sigue disponible aunque no se guarde el historial.
      }
    }
  }

  const focusEquation = () => {
    requestAnimationFrame(() => equationCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }))
  }

  const loadEquation = (nextReactants: string, nextProducts: string, label: string) => {
    setReactants(nextReactants)
    setProducts(nextProducts)
    clearResults()
    setKeyboardOpen(false)
    setMessage(`Cargada: ${label}. Pulsa «Balancear ecuación».`)
    setMessageIsError(false)
  }

  const insertElement = (element: string) => {
    const input = activeInput === 'reactants' ? reactantsRef.current : productsRef.current
    if (!input) return

    const start = input.selectionStart ?? input.value.length
    const end = input.selectionEnd ?? start
    const nextValue = `${input.value.slice(0, start)}${element}${input.value.slice(end)}`
    const update = activeInput === 'reactants' ? setReactants : setProducts
    update(nextValue)

    requestAnimationFrame(() => {
      input.focus()
      input.setSelectionRange(start + element.length, start + element.length)
    })
  }

  const removePreviousCharacter = () => {
    const input = activeInput === 'reactants' ? reactantsRef.current : productsRef.current
    if (!input) return

    const start = input.selectionStart ?? input.value.length
    const end = input.selectionEnd ?? start
    if (start === 0 && end === 0) return

    const deleteStart = start === end ? start - 1 : start
    const nextValue = `${input.value.slice(0, deleteStart)}${input.value.slice(end)}`
    const update = activeInput === 'reactants' ? setReactants : setProducts
    update(nextValue)
    clearResults()

    requestAnimationFrame(() => {
      input.focus()
      input.setSelectionRange(deleteStart, deleteStart)
    })
  }

  const focusInput = (name: 'reactants' | 'products') => {
    setActiveInput(name)
    setKeyboardOpen(true)
    requestAnimationFrame(() => {
      const input = name === 'reactants' ? reactantsRef.current : productsRef.current
      input?.focus()
      const cursor = input?.value.length ?? 0
      input?.setSelectionRange(cursor, cursor)
    })
  }

  const moveBetweenInputs = (direction: 'previous' | 'next') => {
    if (direction === 'previous' && activeInput === 'products') focusInput('reactants')
    if (direction === 'next' && activeInput === 'reactants') focusInput('products')
  }

  const renderInput = (
    value: string,
    setValue: (nextValue: string) => void,
    name: 'reactants' | 'products',
    inputRef: React.RefObject<HTMLInputElement | null>,
    align: 'left' | 'right',
  ) => (
    // En el celular los dos campos van uno debajo del otro, así que ambos se alinean a la izquierda
    <label className={`formula-editor ${align === 'right' ? 'justify-start sm:justify-end' : 'justify-start'}`}>
      <span className="sr-only">{name === 'reactants' ? 'Reactivos' : 'Productos'}</span>
      <span className={`formula-preview ${align === 'right' ? 'text-left sm:text-right' : 'text-left'}`}>
        {value && <FormulaPreview value={value} />}
      </span>
      <input
        ref={inputRef}
        className={`formula-input formula-input-editable ${align === 'right' ? 'text-left sm:text-right' : 'text-left'}`}
        style={{ width: getInputWidth(value) }}
        value={value}
        onFocus={() => {
          setActiveInput(name)
          setKeyboardOpen(true)
          focusEquation()
        }}
        onChange={(event) => {
          setValue(event.target.value)
          clearResults()
        }}
        aria-label={name === 'reactants' ? 'Reactivos' : 'Productos'}
        placeholder=""
        spellCheck="false"
      />
    </label>
  )

  const atoms = balancedResult ? atomCheck(balancedResult) : []

  return (
    <>
      {/* <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-7 sm:px-10">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-teal-700 text-sm font-bold text-white">Q</span>
          <span className="font-display text-lg font-semibold tracking-tight">Quimica Clara</span>
        </div>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-600">Balanceador</span>
      </header> */}

      <section id="balanceador" className="equation-section mx-auto w-full max-w-[1600px] scroll-mt-20 px-6 pb-16 pt-6 sm:px-10">
        <div className="mb-8 flex w-full flex-col items-start text-left">
          <span className="balance-eyebrow">
            <Scale size={14} aria-hidden="true" />
            Calculadora · Balanceo químico
          </span>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[0.98] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Equilibra tu <span className="text-teal-700">ecuación</span>.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">Introduce los reactivos y productos para comenzar a resolver el balance quimico.</p>
        </div>

        <div className="equation-workspace grid w-full gap-8 xl:grid-cols-[minmax(220px,1fr)_minmax(0,900px)_minmax(220px,1fr)]">
          <div className="min-w-0 xl:col-start-2 xl:row-start-1">
            <form ref={equationCardRef} onSubmit={handleSubmit} className="balance-card scroll-mt-24">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-5">
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <span className="balance-side-label">Reactivos</span>
                  {renderInput(reactants, setReactants, 'reactants', reactantsRef, 'right')}
                </div>
                <span className="balance-arrow-badge" aria-hidden="true">
                  <svg className="size-6 rotate-90 sm:rotate-0" viewBox="0 0 48 24" fill="none">
                    <path d="M1 12h44M35 3l10 9-10 9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <span className="balance-side-label">Productos</span>
                  {renderInput(products, setProducts, 'products', productsRef, 'left')}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                <span>
                  Usa <kbd className="balance-kbd">_</kbd> seguido de un número para escribir subíndices.
                </span>
                <button
                  type="button"
                  className="balance-tool-button"
                  aria-expanded={keyboardOpen}
                  aria-controls="periodic-keyboard"
                  onClick={() => setKeyboardOpen((open) => !open)}
                >
                  <LayoutGrid size={14} aria-hidden="true" />
                  {keyboardOpen ? 'Ocultar tabla' : 'Mostrar tabla periódica'}
                </button>
              </div>

              <aside
                id="periodic-keyboard"
                className={`periodic-keyboard ${keyboardOpen ? 'periodic-keyboard-open' : ''}`}
                aria-label="Teclado de la tabla periódica"
                aria-hidden={!keyboardOpen}
              >
                <div className="w-full px-4 py-4 sm:px-6">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Insertar elemento</p>
                      <p className="mt-1 text-xs text-slate-600">Campo activo: {activeInput === 'reactants' ? 'reactivos' : 'productos'}</p>
                    </div>
                    <button type="button" className="keyboard-close" onClick={() => setKeyboardOpen(false)} aria-label="Cerrar teclado">&#215;</button>
                  </div>
                  <div className="element-controls mb-4" aria-label="Controles del input">
                    <button type="button" className="element-control" onMouseDown={(event) => event.preventDefault()} onClick={() => insertElement('+')} title="Agregar signo más" aria-label="Agregar signo más">+</button>
                    <button type="button" className="element-control" onMouseDown={(event) => event.preventDefault()} onClick={() => moveBetweenInputs('previous')} title="Ir al input anterior" aria-label="Ir al input anterior">&#8592;</button>
                    <button type="button" className="element-control" onMouseDown={(event) => event.preventDefault()} onClick={() => moveBetweenInputs('next')} title="Ir al input siguiente" aria-label="Ir al input siguiente">&#8594;</button>
                    <button type="button" className="element-control" onMouseDown={(event) => event.preventDefault()} onClick={removePreviousCharacter} title="Borrar carácter anterior" aria-label="Borrar carácter anterior">&#9003;</button>
                  </div>
                  <div className="mb-4 flex flex-wrap gap-x-3 gap-y-2" aria-label="Leyenda de familias de elementos">
                    {elementGroupLabels.map(([group, label]) => (
                      <span key={group} className="flex items-center gap-1.5 text-[10px] text-slate-600">
                        <span className={`element-legend-swatch element-group-${group}`} aria-hidden="true" />
                        {label}
                      </span>
                    ))}
                  </div>
                  <div className="overflow-x-auto pb-1">
                    <div className="periodic-grid min-w-[620px]">
                      {periodicRows.flatMap((row, rowIndex) => row.map((element, columnIndex) => element ? (
                        <button
                          key={`${rowIndex}-${columnIndex}`}
                          type="button"
                          className={`element-key element-group-${getElementGroup(element)}`}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => insertElement(element === '*' ? 'La' : element === '**' ? 'Ac' : element)}
                          aria-label={`Insertar ${element}`}
                        >
                          {element}
                        </button>
                      ) : <span key={`${rowIndex}-${columnIndex}`} />))}
                    </div>
                  </div>
                </div>
              </aside>

              <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
                <p className={`text-sm ${messageIsError ? 'font-medium text-red-700' : 'text-slate-600'}`} aria-live="polite">{message}</p>
                <button type="submit" className="button-primary shrink-0 disabled:cursor-wait disabled:opacity-60" disabled={explanationLoading || applicationsLoading}>
                  Balancear ecuación
                  <span aria-hidden="true">&#8594;</span>
                </button>
              </div>
            </form>

            {balancedResult && (
              <>
                <div key={balancedResult} className="result-panel lab-pop" aria-live="polite">
                  <span className="result-label">
                    <CheckCircle2 size={16} aria-hidden="true" />
                    Ecuación balanceada
                  </span>
                  <p className="result-equation mt-3">
                    <BalancedEquation value={balancedResult} />
                  </p>
                  <div className="mt-5 border-t border-teal-100 pt-4">
                    <p className="text-xs font-semibold text-slate-700">Átomos en cada lado</p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {atoms.map(({ element, left, right }) => (
                        <li key={element} className="balance-atom-chip">
                          <span className="font-semibold text-teal-800">{element}</span>
                          <span className="tabular-nums">{left} = {right}</span>
                          <Check size={14} className="text-teal-600" aria-hidden="true" />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <section className="ai-explanation" aria-label="Desglose paso a paso" aria-live="polite" aria-busy={explanationLoading}>
                  <div className="ai-explanation-heading">
                    <span className="ai-status-dot" aria-hidden="true" />
                    Desglose paso a paso
                    <span className="ai-model-badge">Llama 3.1 · 8B</span>
                  </div>
                  {explanationLoading && (
                    <p className="ai-explanation-text flex items-center gap-2">
                      <span className="size-4 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600 motion-reduce:animate-none" aria-hidden="true" />
                      Analizando la ecuación y preparando los pasos…
                    </p>
                  )}
                  {explanationError && <p className="ai-explanation-text text-amber-800">{explanationError}</p>}
                  {explanation && <p className="ai-explanation-text whitespace-pre-wrap">{explanation}</p>}
                </section>

                <section className="ai-explanation" aria-label="Aplicaciones de los elementos" aria-live="polite" aria-busy={applicationsLoading}>
                  <div className="ai-explanation-heading">
                    <span className="ai-status-dot" aria-hidden="true" />
                    Aplicaciones de los elementos
                    <span className="ai-model-badge">Llama 3.1 · 8B</span>
                  </div>
                  {applicationsLoading && (
                    <p className="ai-explanation-text flex items-center gap-2">
                      <span className="size-4 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600 motion-reduce:animate-none" aria-hidden="true" />
                      Buscando las aplicaciones de cada elemento…
                    </p>
                  )}
                  {applicationsError && <p className="ai-explanation-text text-amber-800">{applicationsError}</p>}
                  {applications && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {applications.split(/\n\s*\n/).map((block, index) => {
                        const [title, ...rest] = block.split('\n')
                        return (
                          <div key={index} className="rounded-2xl border border-violet-100 bg-violet-50/40 px-4 py-3">
                            <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
                            {rest.length > 0 && (
                              <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">{rest.join('\n')}</p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </section>
              </>
            )}
          </div>

          <aside className="ideas-card h-fit xl:col-start-1 xl:row-start-1" aria-labelledby="equation-ideas-title">
            <div className="mb-4">
              <p className="ideas-eyebrow">Para practicar</p>
              <h2 id="equation-ideas-title" className="mt-1 text-lg font-semibold tracking-tight text-slate-900">Ideas de ecuaciones</h2>
              <p className="mt-1 text-xs leading-5 text-slate-600">Elige una para cargarla en el balanceador.</p>
            </div>
            <ul className="grid gap-2">
              {equationIdeas.map((idea) => (
                <li key={idea.label}>
                  <button
                    type="button"
                    className="idea-button"
                    aria-current={idea.reactants === reactants && idea.products === products}
                    onClick={() => loadEquation(idea.reactants, idea.products, idea.label)}
                  >
                    <span className="block text-xs font-semibold text-slate-800">{idea.label}</span>
                    <span className="idea-formula mt-1 block">
                      <FormulaPreview value={idea.reactants} />
                      <span className="mx-1 text-teal-700">→</span>
                      <FormulaPreview value={idea.products} />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <section className="ideas-card h-fit xl:col-start-3 xl:row-start-1" aria-labelledby="previous-results-title">
            <div className="mb-4">
              <p className="ideas-eyebrow">Historial rápido</p>
              <h2 id="previous-results-title" className="mt-1 text-lg font-semibold tracking-tight text-slate-900">Resultados anteriores</h2>
              {previousResults.length > 0 && (
                <p className="mt-1 text-xs text-slate-600">
                  {previousResults.length} {previousResults.length === 1 ? 'reciente' : 'recientes'} · tócalo para cargarlo
                </p>
              )}
            </div>
            {previousResults.length > 0 ? (
              <ul className="grid gap-2">
                {previousResults.map((item, index) => {
                  const [itemReactants, itemProducts] = item.input.split(' -> ')
                  return (
                    <li key={`${item.input}-${index}`}>
                      <button
                        type="button"
                        className="idea-button"
                        onClick={() => loadEquation(itemReactants, itemProducts, 'ecuación anterior')}
                      >
                        <span className="idea-formula block truncate text-slate-500">
                          <FormulaPreview value={itemReactants} />
                          <span className="mx-1 text-teal-700">→</span>
                          <FormulaPreview value={itemProducts} />
                        </span>
                        <span className="balance-recent-equation mt-1 block truncate">
                          <BalancedEquation value={item.balanced} />
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="text-xs leading-5 text-slate-600">Tus ecuaciones balanceadas aparecerán aquí.</p>
            )}
          </section>
        </div>
      </section>
    </>
  )
}
