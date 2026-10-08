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
  const [message, setMessage] = useState('Completa la ecuacion y encuentra sus coeficientes.')
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [activeInput, setActiveInput] = useState<'reactants' | 'products'>('reactants')
  const [balancedResult, setBalancedResult] = useState('')
  const reactantsRef = useRef<HTMLInputElement>(null)
  const productsRef = useRef<HTMLInputElement>(null)
  const equationSectionRef = useRef<HTMLElement>(null)

  const getInputWidth = (value: string) => `${Math.max(value.length + 1, 8)}ch`

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      setBalancedResult(balanceEquation(`${reactants} -> ${products}`))
      setMessage('Balance encontrado con los menores coeficientes enteros.')
    } catch (error) {
      setBalancedResult('')
      setMessage(error instanceof Error ? error.message : 'No se pudo balancear la ecuacion.')
    }
  }

  const focusEquation = () => {
    requestAnimationFrame(() => equationSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
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
        {value ? <FormulaPreview value={value} /> : <span className="text-slate-300">{name === 'reactants' ? 'Reactivos' : 'Productos'}</span>}
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
    <main className="min-h-screen overflow-x-hidden bg-stone-50 text-slate-900">
      {/* <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-7 sm:px-10">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-teal-700 text-sm font-bold text-white">Q</span>
          <span className="font-display text-lg font-semibold tracking-tight">Quimica Clara</span>
        </div>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Balanceador</span>
      </header> */}

      <section ref={equationSectionRef} className="equation-section mx-auto flex min-h-[calc(100vh-104px)] w-full max-w-7xl flex-col justify-center px-6 pb-16 pt-10 sm:px-10">
        <div className="mb-14 max-w-xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-teal-700"></p>
          <h1 className="font-display text-5xl font-semibold leading-[0.98] tracking-tight text-slate-950 sm:text-7xl">Equilibra tu ecuacion.</h1>
          <p className="mt-6 max-w-md text-base leading-7 text-slate-500">Introduce los reactivos y productos para comenzar a resolver el balance quimico.</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="equation-shell flex w-full items-center justify-center gap-3 border-y border-slate-200 py-8 sm:gap-7 sm:py-12">
            {renderInput(reactants, setReactants, 'reactants', reactantsRef, 'right')}
            <span className="shrink-0 text-teal-700" aria-hidden="true">
              <svg className="size-8 sm:size-11" viewBox="0 0 48 24" fill="none">
                <path d="M1 12h44M35 3l10 9-10 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {renderInput(products, setProducts, 'products', productsRef, 'left')}
          </div>

          <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
            <span>Usa _ seguido de un numero para escribir subindices.</span>
            <button type="button" className="keyboard-toggle" onClick={() => setKeyboardOpen((open) => !open)}>
              {keyboardOpen ? 'Ocultar tabla' : 'Mostrar tabla periodica'}
            </button>
          </div>

          <div className="mt-7 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <p className="text-sm text-slate-500" aria-live="polite">{message}</p>
            <button type="submit" className="button-primary">
              Balancear ecuacion
              <span aria-hidden="true">&#8594;</span>
            </button>
          </div>
          {balancedResult && (
            <div className="result-panel" aria-live="polite">
              <span className="result-label">Ecuacion balanceada</span>
              <span className="result-equation">
                {balancedResult.split(' → ').map((side, index) => (
                  <span key={side}>
                    <FormulaPreview value={side} />
                    {index === 0 && <span className="mx-3 text-teal-700">→</span>}
                  </span>
                ))}
              </span>
            </div>
          )}
        </form>
      </section>

      <aside className={`periodic-keyboard ${keyboardOpen ? 'periodic-keyboard-open' : ''}`} aria-label="Teclado de la tabla periodica">
        <div className="mx-auto w-full max-w-7xl px-5 pb-5 pt-4 sm:px-10">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Insertar elemento</p>
              <p className="mt-1 text-xs text-slate-400">Campo activo: {activeInput === 'reactants' ? 'reactivos' : 'productos'}</p>
            </div>
            <button type="button" className="keyboard-close" onClick={() => setKeyboardOpen(false)} aria-label="Cerrar teclado">&#215;</button>
          </div>
          <div className="periodic-grid">
            {periodicRows.flatMap((row, rowIndex) => row.map((element, columnIndex) => element ? (
              <button
                key={`${rowIndex}-${columnIndex}`}
                type="button"
                className={`element-key ${element === '*' || element === '**' ? 'element-key-special' : ''}`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => insertElement(element === '*' ? 'La' : element === '**' ? 'Ac' : element)}
                aria-label={`Insertar ${element}`}
              >
                {element}
              </button>
            ) : <span key={`${rowIndex}-${columnIndex}`} />))}
          </div>
        </div>
      </aside>
    </main>
  )
}

export default App
