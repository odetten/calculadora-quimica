import { useRef, useState, type FormEvent } from 'react'
import './App.css'
import { balanceEquation } from './chemistry.ts'

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

function FormulaPreview({ value }: { value: string }) {
  const parts = value.split(subscriptPattern)

  return (
    <span aria-hidden="true">
      {parts.map((part, index) => index % 2 === 1 ? <sub key={`${part}-${index}`}>{part}</sub> : part)}
    </span>
  )
}

function App() {
  const [reactants, setReactants] = useState('Fe + O_2')
  const [products, setProducts] = useState('Fe_2O_3')
  const [message, setMessage] = useState('Completa la ecuación y encuentra sus coeficientes.')
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [activeInput, setActiveInput] = useState<'reactants' | 'products'>('reactants')
  const [balancedResult, setBalancedResult] = useState('')
  const [aiExplanation, setAiExplanation] = useState('')
  const [isExplaining, setIsExplaining] = useState(false)
  const [previousResults, setPreviousResults] = useState<Array<{ input: string; balanced: string }>>([])
  const reactantsRef = useRef<HTMLInputElement>(null)
  const productsRef = useRef<HTMLInputElement>(null)
  const equationSectionRef = useRef<HTMLElement>(null)

  const getInputWidth = (value: string) => `${Math.max(value.length + 1, 8)}ch`

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const equation = `${reactants} -> ${products}`
      const balanced = balanceEquation(equation)
      setBalancedResult(balanced)
      setAiExplanation('')
      setPreviousResults((previous) => [
        { input: equation, balanced },
        ...previous,
      ].slice(0, 3))
      setMessage('Ecuación balanceada. Llama 3.1 está preparando la explicación…')
      setIsExplaining(true)

      try {
        const response = await fetch('/api/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ equation, balancedEquation: balanced }),
        })
        const result = await response.json() as { explanation?: string; error?: string }
        if (!response.ok) throw new Error(result.error || 'No se pudo obtener la explicación de Llama 3.1.')
        setAiExplanation(result.explanation || 'Llama 3.1 no devolvió una explicación.')
        setMessage('Balance encontrado con los menores coeficientes enteros.')
      } catch (error) {
        setAiExplanation(error instanceof Error ? error.message : 'No se pudo conectar con Ollama.')
        setMessage('La ecuación se balanceó correctamente; no se pudo generar la explicación con Ollama.')
      } finally {
        setIsExplaining(false)
      }
    } catch (error) {
      setBalancedResult('')
      setAiExplanation('')
      setMessage(error instanceof Error ? error.message : 'No se pudo balancear la ecuación.')
    }
  }

  const focusEquation = () => {
    requestAnimationFrame(() => equationSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
  }

  const loadEquationIdea = (idea: (typeof equationIdeas)[number]) => {
    setReactants(idea.reactants)
    setProducts(idea.products)
    setBalancedResult('')
    setAiExplanation('')
    setKeyboardOpen(false)
    setMessage(`Cargada: ${idea.label}. Pulsa «Balancear ecuación».`)
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

  const renderInput = (
    value: string,
    setValue: (nextValue: string) => void,
    name: 'reactants' | 'products',
    inputRef: React.RefObject<HTMLInputElement | null>,
    align: 'left' | 'right',
  ) => (
    <label className={`formula-editor ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
      <span className="sr-only">{name === 'reactants' ? 'Reactivos' : 'Productos'}</span>
      <span className={`formula-preview ${align === 'right' ? 'text-right' : 'text-left'}`}>
        {value ? <FormulaPreview value={value} /> : <span className="text-slate-500">{name === 'reactants' ? 'Reactivos' : 'Productos'}</span>}
      </span>
      <input
        ref={inputRef}
        className="formula-input formula-input-editable"
        style={{ width: getInputWidth(value) }}
        value={value}
        onFocus={() => {
          setActiveInput(name)
          setKeyboardOpen(true)
          focusEquation()
        }}
        onChange={(event) => setValue(event.target.value)}
        aria-label={name === 'reactants' ? 'Reactivos' : 'Productos'}
        placeholder={name === 'reactants' ? 'Reactivos' : 'Productos'}
        spellCheck="false"
      />
    </label>
  )

  return (
    <main className="min-h-screen overflow-x-hidden bg-transparent text-slate-900">
      {/* <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-7 sm:px-10">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-teal-700 text-sm font-bold text-white">Q</span>
          <span className="font-display text-lg font-semibold tracking-tight">Quimica Clara</span>
        </div>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-600">Balanceador</span>
      </header> */}

      <section ref={equationSectionRef} className="equation-section mx-auto flex min-h-[calc(100vh-104px)] w-full max-w-[1600px] flex-col justify-center px-6 pb-16 pt-10 sm:px-10">
        <div className="mb-14 flex w-full flex-col items-center text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-teal-700"></p>
          <h1 className="font-display text-5xl font-semibold leading-[0.98] tracking-tight text-slate-950 sm:text-7xl">Equilibra tu ecuación.</h1>
          <p className="mt-6 max-w-2xl self-center text-center text-base leading-7 text-slate-600">Introduce los reactivos y productos para comenzar a resolver el balance quimico.</p>
        </div>

        <div className="equation-workspace grid w-full gap-8 xl:grid-cols-[minmax(220px,1fr)_minmax(0,900px)_minmax(220px,1fr)]">
          <aside className={`ideas-card h-fit xl:self-center xl:col-start-1 xl:row-start-1 ${keyboardOpen ? 'xl:-translate-y-[10vh]' : 'xl:-translate-y-[2vh]'}`} aria-labelledby="equation-ideas-title">
            <div className="mb-4">
              <p className="ideas-eyebrow">Para practicar</p>
              <h2 id="equation-ideas-title" className="mt-1 text-lg font-semibold tracking-tight text-slate-900">Ideas de ecuaciones</h2>
              <p className="mt-1 text-xs leading-5 text-slate-600">Elige una para cargarla en el balanceador.</p>
            </div>
            <ul className="grid gap-2">
              {equationIdeas.map((idea) => (
                <li key={idea.label}>
                  <button type="button" className="idea-button" onClick={() => loadEquationIdea(idea)}>
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

          <div className="min-w-0 xl:col-start-2 xl:row-start-1">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="equation-shell flex w-full items-center justify-center gap-3 border-y-2 border-slate-400 bg-white/65 py-8 sm:gap-7 sm:py-12">
                {renderInput(reactants, setReactants, 'reactants', reactantsRef, 'right')}
                <span className="shrink-0 text-teal-700" aria-hidden="true">
                  <svg className="size-8 sm:size-11" viewBox="0 0 48 24" fill="none">
                    <path d="M1 12h44M35 3l10 9-10 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {renderInput(products, setProducts, 'products', productsRef, 'left')}
              </div>

              <div className="mt-5 flex items-center justify-between text-xs text-slate-600">
                <span>Usa _ seguido de un numero para escribir subindices.</span>
                <button type="button" className="keyboard-toggle" onClick={() => setKeyboardOpen((open) => !open)}>
                  {keyboardOpen ? 'Ocultar tabla' : 'Mostrar tabla periódica'}
                </button>
              </div>

              <div className="mt-7 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
                <p className="text-sm text-slate-600" aria-live="polite">{message}</p>
                <button type="submit" className="button-primary disabled:cursor-wait disabled:opacity-60" disabled={isExplaining}>
                  Balancear ecuación
                  <span aria-hidden="true">&#8594;</span>
                </button>
              </div>
              {balancedResult && (
                <>
                  <div className="result-panel" aria-live="polite">
                    <span className="result-label">Ecuación balanceada</span>
                    <span className="result-equation">
                      {balancedResult.split(' → ').map((side, index) => (
                        <span key={side}>
                          <FormulaPreview value={side} />
                          {index === 0 && <span className="mx-3 text-teal-700">→</span>}
                        </span>
                      ))}
                    </span>
                  </div>
                  <section className="ai-explanation" aria-label="Explicación de Llama 3.1" aria-live="polite">
                    <div className="ai-explanation-heading">
                      <span className="ai-status-dot" aria-hidden="true" />
                      Explicación de ChemIA
                      <span className="ai-model-badge">Llama 3.1 · 8B</span>
                    </div>
                    {isExplaining ? (
                      <p className="ai-explanation-text">Analizando la ecuación y preparando los pasos…</p>
                    ) : (
                      <p className={`ai-explanation-text ${aiExplanation.startsWith('No se pudo') ? 'text-amber-800' : ''}`}>{aiExplanation}</p>
                    )}
                  </section>
                </>
              )}
            </form>

            <aside className={`periodic-keyboard ${keyboardOpen ? 'periodic-keyboard-open' : ''}`} aria-label="Teclado de la tabla periódica" aria-hidden={!keyboardOpen}>
              <div className="w-full px-4 py-4 sm:px-6">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Insertar elemento</p>
                    <p className="mt-1 text-xs text-slate-600">Campo activo: {activeInput === 'reactants' ? 'reactivos' : 'productos'}</p>
                  </div>
                  <button type="button" className="keyboard-close" onClick={() => setKeyboardOpen(false)} aria-label="Cerrar teclado">&#215;</button>
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

            <section className="mt-10 w-full border-t border-slate-200 pt-6" aria-labelledby="previous-results-title">
              <div className="mb-4 flex items-center justify-between">
                <h2 id="previous-results-title" className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">Resultados anteriores</h2>
                {previousResults.length > 0 && <span className="text-xs text-slate-600">{previousResults.length} recientes</span>}
              </div>
              {previousResults.length > 0 ? (
                <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {previousResults.map((item, index) => (
                    <li key={`${item.input}-${index}`} className="rounded-xl border border-slate-200 bg-white/70 px-4 py-3">
                      <p className="truncate text-xs text-slate-600">
                        {item.input.split(' -> ').map((side, sideIndex) => (
                          <span key={`${side}-${sideIndex}`}>
                            <FormulaPreview value={side} />
                            {sideIndex === 0 && <span className="mx-1 text-teal-700">→</span>}
                          </span>
                        ))}
                      </p>
                      <p className="result-equation mt-1 text-base">
                        {item.balanced.split(' → ').map((side, sideIndex) => (
                          <span key={`${side}-${sideIndex}`}>
                            <FormulaPreview value={side} />
                            {sideIndex === 0 && <span className="mx-2 text-teal-700">→</span>}
                          </span>
                        ))}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-600">Tus ecuaciones balanceadas aparecerán aquí.</p>
              )}
            </section>
          </div>
        </div>
      </section>

    </main>
  )
}

export default App
