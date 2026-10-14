import { useState, type DragEvent, type KeyboardEvent } from 'react'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

interface Substance {
  id: string
  name: string
  emoji: string
  formula: string // en texto plano: los números se muestran como subíndices
  detail: string // lo que se le manda al modelo
}

// Sustancias cotidianas: ninguna combinación entre ellas es peligrosa.
const SUBSTANCES: Substance[] = [
  { id: 'agua', name: 'Agua', emoji: '💧', formula: 'H2O', detail: 'agua, H2O' },
  { id: 'sal', name: 'Sal de mesa', emoji: '🧂', formula: 'NaCl', detail: 'cloruro de sodio, NaCl' },
  { id: 'azucar', name: 'Azúcar', emoji: '🍬', formula: 'C12H22O11', detail: 'sacarosa, C12H22O11' },
  { id: 'bicarbonato', name: 'Bicarbonato', emoji: '🥄', formula: 'NaHCO3', detail: 'bicarbonato de sodio, NaHCO3' },
  { id: 'vinagre', name: 'Vinagre', emoji: '🍶', formula: 'CH3COOH', detail: 'ácido acético diluido en agua, CH3COOH' },
  { id: 'limon', name: 'Jugo de limón', emoji: '🍋', formula: 'C6H8O7', detail: 'ácido cítrico en agua, C6H8O7' },
  { id: 'aceite', name: 'Aceite de cocina', emoji: '🫒', formula: 'Triglicéridos', detail: 'grasa formada por triglicéridos (no polar)' },
  { id: 'leche', name: 'Leche', emoji: '🥛', formula: 'Caseína y lactosa', detail: 'agua con proteínas (caseína), grasa y lactosa' },
  { id: 'maicena', name: 'Maicena', emoji: '🌽', formula: '(C6H10O5)n', detail: 'almidón de maíz, (C6H10O5)n' },
  { id: 'hierro', name: 'Clavo de hierro', emoji: '🔩', formula: 'Fe', detail: 'hierro metálico, Fe' },
]

// Datos verificados: se le pasan al modelo para que no invente productos.
const KNOWN: Array<{ ids: [string, string]; text: string }> = [
  {
    ids: ['bicarbonato', 'vinagre'],
    text: 'Reacción ácido-base: NaHCO3 + CH3COOH -> CH3COONa + H2O + CO2. Se libera dióxido de carbono (efervescencia, burbujas).',
  },
  {
    ids: ['bicarbonato', 'limon'],
    text: 'Reacción ácido-base entre el bicarbonato y el ácido cítrico. Se libera dióxido de carbono (efervescencia, burbujas).',
  },
  {
    ids: ['leche', 'vinagre'],
    text: 'El ácido hace que las proteínas de la leche (caseína) se coagulen y se separen en cuajada y suero. No se libera gas.',
  },
  {
    ids: ['leche', 'limon'],
    text: 'El ácido hace que las proteínas de la leche (caseína) se coagulen y se separen en cuajada y suero. No se libera gas.',
  },
  {
    ids: ['hierro', 'agua'],
    text: 'El hierro se oxida lentamente con el agua y el oxígeno del aire y forma óxido de hierro (herrumbre). Es un proceso lento, tarda días.',
  },
  {
    ids: ['hierro', 'vinagre'],
    text: 'El ácido acético ataca la superficie del hierro y acelera su corrosión. Es un proceso lento.',
  },
  {
    ids: ['hierro', 'limon'],
    text: 'El ácido cítrico ataca la superficie del hierro y acelera su corrosión. Es un proceso lento.',
  },
  {
    ids: ['sal', 'agua'],
    text: 'La sal se disuelve en el agua: NaCl -> Na+ + Cl-. Es un cambio físico (disolución), no se forma una sustancia nueva.',
  },
  {
    ids: ['azucar', 'agua'],
    text: 'El azúcar se disuelve en el agua. Es un cambio físico: las moléculas de azúcar no se rompen.',
  },
  {
    ids: ['aceite', 'agua'],
    text: 'No se mezclan: el agua es polar y el aceite no polar, por eso forman dos capas. No hay reacción química.',
  },
  {
    ids: ['maicena', 'agua'],
    text: 'La maicena no se disuelve: forma una suspensión que se comporta como líquido o como sólido según la fuerza que se aplique (fluido no newtoniano). Es un cambio físico.',
  },
]

const MAX_ITEMS = 4

function Formula({ value }: { value: string }) {
  return (
    <>
      {value.split(/(\d+)/).map((part, index) => (index % 2 === 1 ? <sub key={index}>{part}</sub> : part))}
    </>
  )
}

function cleanText(text: string): string {
  return text.replace(/\*/g, '').replace(/^#+\s*/gm, '').trim()
}

async function askMix(prompt: string): Promise<string> {
  let response: Response
  try {
    response = await fetch(`${API_URL}/mix`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor. ¿Está corriendo el backend?')
  }

  let data: { answer?: unknown; detail?: unknown } | null = null
  try {
    data = await response.json()
  } catch {
    // sin JSON
  }

  if (!response.ok) {
    throw new Error(
      typeof data?.detail === 'string' ? data.detail : `No se pudo generar la explicación (HTTP ${response.status}).`,
    )
  }
  if (typeof data?.answer !== 'string' || !data.answer.trim()) {
    throw new Error('El modelo no devolvió una respuesta.')
  }
  return data.answer
}

export default function MixGame({ onBack }: { onBack?: () => void }) {
  const [mix, setMix] = useState<string[]>([])
  const [over, setOver] = useState(false)
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const [explanation, setExplanation] = useState('')
  const [error, setError] = useState('')

  const byId = (id: string) => SUBSTANCES.find((s) => s.id === id)!

  const clearResult = () => {
    setExplanation('')
    setError('')
  }

  const addToMix = (id: string) => {
    if (loading) return
    if (mix.includes(id)) {
      setNotice('Esa sustancia ya está en la mezcla.')
      return
    }
    if (mix.length >= MAX_ITEMS) {
      setNotice(`Máximo ${MAX_ITEMS} sustancias por mezcla.`)
      return
    }
    setNotice('')
    clearResult()
    setMix((previous) => [...previous, id])
  }

  const removeFromMix = (id: string) => {
    if (loading) return
    setNotice('')
    clearResult()
    setMix((previous) => previous.filter((item) => item !== id))
  }

  const resetMix = () => {
    if (loading) return
    setMix([])
    setNotice('')
    clearResult()
  }

  const handleDragStart = (event: DragEvent<HTMLDivElement>, id: string) => {
    event.dataTransfer.setData('text/plain', id)
    event.dataTransfer.effectAllowed = 'copy'
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setOver(false)
    const id = event.dataTransfer.getData('text/plain')
    if (SUBSTANCES.some((s) => s.id === id)) addToMix(id)
  }

  const handleCardKey = (event: KeyboardEvent<HTMLDivElement>, id: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      addToMix(id)
    }
  }

  const handleMix = async () => {
    if (mix.length < 2 || loading) return
    setLoading(true)
    clearResult()

    const items = mix.map(byId)
    const equation = `${items.map((s) => s.name).join(' + ')} -> ?`
    const facts = KNOWN.filter((k) => k.ids.every((id) => mix.includes(id))).map((k) => `- ${k.text}`)

    const prompt = [
      'Sustancias elegidas por el estudiante:',
      ...items.map((s) => `- ${s.name} (${s.detail})`),
      `Ecuación propuesta: ${equation}`,
      facts.length > 0
        ? 'Datos verificados (úsalos como base y no los contradigas):'
        : 'Datos verificados: no hay reacciones relevantes registradas para esta combinación; no se espera una reacción química significativa.',
      ...facts,
      'Empieza directamente con la explicación. No hagas preguntas.',
    ].join('\n')

    try {
      setExplanation(cleanText(await askMix(prompt)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo generar la explicación.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-transparent px-6 py-10 text-slate-900 sm:px-10">
      <div className="mx-auto w-full max-w-4xl">
        {onBack && (
          <button type="button" className="mb-6 text-sm text-slate-600 hover:text-teal-700" onClick={onBack}>
            ← Volver
          </button>
        )}

        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">Nivel básico</p>
        <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Laboratorio de mezclas
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          Arrastra sustancias a la mezcla, arma tu propia ecuación y descubre qué significa.
        </p>

        <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          ⚠️ Juego educativo. No repitas mezclas de sustancias por tu cuenta: algunas combinaciones de productos
          reales pueden ser peligrosas.
        </p>

        {/* Bandeja de sustancias */}
        <section className="mt-8" aria-labelledby="tray-title">
          <h2 id="tray-title" className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
            Sustancias · arrastra o toca para agregar
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {SUBSTANCES.map((s) => {
              const used = mix.includes(s.id)
              return (
                <div
                  key={s.id}
                  role="button"
                  tabIndex={0}
                  draggable={!used && !loading}
                  aria-disabled={used}
                  aria-label={`Agregar ${s.name} a la mezcla`}
                  onDragStart={(event) => handleDragStart(event, s.id)}
                  onClick={() => addToMix(s.id)}
                  onKeyDown={(event) => handleCardKey(event, s.id)}
                  className={`select-none rounded-xl border px-3 py-3 text-center shadow-sm transition ${
                    used
                      ? 'cursor-not-allowed border-slate-200 bg-slate-100 opacity-50'
                      : 'cursor-grab border-slate-200 bg-white hover:-translate-y-0.5 hover:border-teal-600 hover:shadow active:cursor-grabbing'
                  }`}
                >
                  <span className="block text-3xl" aria-hidden="true">
                    {s.emoji}
                  </span>
                  <span className="mt-1 block text-sm font-semibold text-slate-800">{s.name}</span>
                  <span className="block text-xs text-slate-500">
                    <Formula value={s.formula} />
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        {/* Zona de mezcla */}
        <section className="mt-8" aria-labelledby="mix-title">
          <h2 id="mix-title" className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
            Tu mezcla
          </h2>
          <div
            onDragOver={(event) => {
              event.preventDefault()
              event.dataTransfer.dropEffect = 'copy'
              setOver(true)
            }}
            onDragLeave={() => setOver(false)}
            onDrop={handleDrop}
            className={`mt-3 flex min-h-32 flex-wrap items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-4 py-6 transition ${
              over ? 'border-teal-600 bg-teal-50' : 'border-slate-300 bg-white/65'
            }`}
            aria-live="polite"
          >
            {mix.length === 0 && <p className="text-sm text-slate-500">Suelta aquí las sustancias</p>}

            {mix.map((id, index) => {
              const s = byId(id)
              return (
                <div key={id} className="flex items-center gap-3">
                  {index > 0 && <span className="text-2xl font-light text-teal-700">+</span>}
                  <span className="flex items-center gap-2 rounded-xl border border-teal-200 bg-white px-3 py-2 shadow-sm">
                    <span aria-hidden="true">{s.emoji}</span>
                    <span className="text-sm font-semibold text-slate-800">{s.name}</span>
                    <button
                      type="button"
                      className="ml-1 text-slate-400 hover:text-red-600"
                      onClick={() => removeFromMix(id)}
                      aria-label={`Quitar ${s.name}`}
                    >
                      ×
                    </button>
                  </span>
                </div>
              )
            })}

            {mix.length > 0 && (
              <>
                <span className="text-2xl text-teal-700" aria-hidden="true">
                  →
                </span>
                <span className="rounded-xl border border-dashed border-slate-300 px-3 py-2 text-sm font-semibold text-slate-500">
                  ¿?
                </span>
              </>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              {notice || (mix.length < 2 ? 'Elige al menos 2 sustancias.' : `${mix.length} de ${MAX_ITEMS} sustancias.`)}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                onClick={resetMix}
                disabled={mix.length === 0 || loading}
              >
                Limpiar
              </button>
              <button
                type="button"
                className="button-primary disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleMix}
                disabled={mix.length < 2 || loading}
              >
                {loading ? 'Analizando…' : '¿Qué significa?'}
              </button>
            </div>
          </div>
        </section>

        {/* Explicación del modelo */}
        {(loading || explanation || error) && (
          <section className="ai-explanation mt-8" aria-label="Explicación de la mezcla" aria-live="polite" aria-busy={loading}>
            <div className="ai-explanation-heading">
              <span className="ai-status-dot" aria-hidden="true" />
              Explicación
              <span className="ai-model-badge">Llama 3.1 · 8B</span>
            </div>
            {loading && <p className="ai-explanation-text">Analizando tu mezcla…</p>}
            {error && <p className="ai-explanation-text text-amber-800">{error}</p>}
            {explanation && <p className="ai-explanation-text whitespace-pre-wrap">{explanation}</p>}
          </section>
        )}
      </div>
    </main>
  )
}