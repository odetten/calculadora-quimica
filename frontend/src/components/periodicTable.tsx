import { useEffect, useMemo, useRef, useState } from 'react'
import { X } from 'lucide-react'
import {
  CATEGORY_INFO,
  elementBySymbol,
  labCompatibility,
  PERIODIC_ELEMENTS,
  reagentElements,
  type PeriodicElement,
} from '../tools/periodicTable.ts'
import { REAGENTS } from '../tools/reactions.ts'

type PeriodicTableProps = {
  contents: string[]
  canAdd: boolean
  onAddReagent: (id: string) => void
}

const LAB_SYMBOLS = new Set(REAGENTS.flatMap(reagentElements))

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-0.5 font-display text-lg font-semibold text-slate-900">{value}</dd>
    </div>
  )
}

function ElementCard({
  element,
  contents,
  canAdd,
  onAddReagent,
  onSelect,
  onClose,
}: {
  element: PeriodicElement
  contents: string[]
  canAdd: boolean
  onAddReagent: (id: string) => void
  onSelect: (symbol: string) => void
  onClose: () => void
}) {
  const category = CATEGORY_INFO[element.category]
  const { reagents, compatible } = labCompatibility(element.symbol)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      opener?.focus()
    }
    // El foco se guarda al abrir la tarjeta; cambiar de elemento no debe reiniciarlo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Propiedades de ${element.name}`}
        className="lab-pop max-h-full w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start gap-4">
          <div className={`flex size-20 shrink-0 flex-col items-center justify-center rounded-2xl border-2 ${category.cell}`}>
            <span className="text-xs">{element.number}</span>
            <span className="font-display text-3xl font-bold leading-none">{element.symbol}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-2xl font-semibold capitalize text-slate-900">{element.name}</h2>
            <p className="mt-1 text-sm text-slate-600">{category.label}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
          <Stat label="Número atómico" value={element.number} />
          <Stat label="Masa atómica" value={`${element.mass} u`} />
          <Stat label="Estado físico" value={element.state} />
          <Stat label="Protones" value={element.protons} />
          <Stat label="Electrones" value={element.electrons} />
          <Stat label="Neutrones" value={element.neutrons} />
        </dl>
        <p className="mt-2 text-xs text-slate-500">
          Electrones del átomo neutro. Neutrones ≈ masa atómica redondeada − protones. Estado físico a temperatura ambiente.
        </p>

        <div className="mt-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-teal-700">Familia química</h3>
          <p className="mt-1 text-slate-700">{category.label}</p>
        </div>

        <div className="mt-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-teal-700">Compatibles para experimentar</h3>
          {compatible.length > 0 ? (
            <ul className="mt-2 flex flex-wrap gap-2">
              {compatible.map((symbol) => {
                const other = elementBySymbol(symbol)
                if (!other) return null
                return (
                  <li key={symbol}>
                    <button
                      type="button"
                      onClick={() => onSelect(symbol)}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 transition-colors hover:border-teal-300 hover:bg-teal-50"
                    >
                      <span className="text-sm">
                        <strong>{symbol}</strong> · <span className="capitalize">{other.name}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="mt-1 text-sm text-slate-600">
              Por ahora no hay reacciones disponibles en el laboratorio con este elemento.
            </p>
          )}
        </div>

        {reagents.length > 0 && (
          <div className="mt-6 border-t border-slate-200 pt-5">
            {reagents.some((reagent) => reagent.element !== element.symbol) && (
              <p className="mb-3 text-sm text-slate-600">
                Este elemento se añade al laboratorio dentro de un compuesto.
              </p>
            )}
            <div className="flex flex-col gap-2">
              {reagents.map((reagent) => {
                const used = contents.includes(reagent.id)
                return (
                  <button
                    key={reagent.id}
                    type="button"
                    disabled={used || !canAdd}
                    onClick={() => onAddReagent(reagent.id)}
                    className="rounded-full bg-teal-700 px-5 py-2.5 text-white transition-colors enabled:hover:bg-teal-800 disabled:bg-slate-200 disabled:text-slate-500"
                  >
                    <span className="text-sm font-semibold">
                      {used
                        ? `${reagent.formula} ya está en el laboratorio`
                        : canAdd
                          ? `Añadir ${reagent.formula} al laboratorio`
                          : 'El laboratorio está ocupado'}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function PeriodicTable({ contents, canAdd, onAddReagent }: PeriodicTableProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const element = selected ? elementBySymbol(selected) : undefined
  const legend = useMemo(() => Object.entries(CATEGORY_INFO), [])

  return (
    <div>
      <p className="mb-3 text-center text-sm text-slate-600">Toca un elemento para ver sus propiedades.</p>

      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
        <div
          className="mx-auto grid min-w-[58rem] max-w-6xl gap-1"
          style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))', gridTemplateRows: 'repeat(7, auto) 0.75rem repeat(2, auto)' }}
        >
          {PERIODIC_ELEMENTS.map((item) => (
            <button
              key={item.symbol}
              type="button"
              onClick={() => setSelected(item.symbol)}
              aria-label={`${item.name}, número atómico ${item.number}`}
              aria-pressed={selected === item.symbol}
              style={{ gridColumn: item.column, gridRow: item.row }}
              className={`relative flex aspect-square flex-col items-center justify-center rounded-lg border transition hover:z-10 hover:scale-110 hover:shadow-md ${
                CATEGORY_INFO[item.category].cell
              } ${selected === item.symbol ? 'ring-2 ring-teal-600 ring-offset-1' : ''}`}
            >
              <span className="absolute left-1 top-0.5 text-[0.6rem] leading-none">{item.number}</span>
              {LAB_SYMBOLS.has(item.symbol) && (
                <span className="absolute right-1 top-1 size-1.5 rounded-full bg-teal-600" aria-hidden="true" />
              )}
              <span className="font-display text-base font-bold leading-none">{item.symbol}</span>
              <span className="mt-0.5 w-full truncate px-0.5 text-center text-[0.55rem] capitalize leading-none">{item.name}</span>
            </button>
          ))}
          <div
            aria-hidden="true"
            style={{ gridColumn: 3, gridRow: 6 }}
            className="flex items-center justify-center rounded-lg border border-dashed border-amber-300 text-[0.6rem] text-amber-800"
          >
            57–71
          </div>
          <div
            aria-hidden="true"
            style={{ gridColumn: 3, gridRow: 7 }}
            className="flex items-center justify-center rounded-lg border border-dashed border-pink-300 text-[0.6rem] text-pink-800"
          >
            89–103
          </div>
        </div>
      </div>

      <ul className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-slate-600" aria-label="Familias químicas">
        {legend.map(([key, info]) => (
          <li key={key} className="flex items-center gap-1.5">
            <span className={`size-3 rounded ${info.dot}`} aria-hidden="true" />
            {info.label}
          </li>
        ))}
        <li className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-teal-600" aria-hidden="true" />
          Disponible en el laboratorio
        </li>
      </ul>

      {element && (
        <ElementCard
          element={element}
          contents={contents}
          canAdd={canAdd}
          onAddReagent={onAddReagent}
          onSelect={setSelected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
