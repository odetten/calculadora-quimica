import { useState, type DragEvent } from 'react'
import { parseFormula, splitEquation, type Activity } from '../lessons.ts'
import { ChemText } from './chemText.tsx'
import { Confetti } from './confetti.tsx'
import type { MascotMood } from './mascot.tsx'

type Feedback = (text: string, mood: MascotMood) => void
type GameProps<T> = { activity: T; onDone: (summary?: string) => void; onFeedback: Feedback }

const CHEERS = ['¡Muy bien! 🎉', '¡Excelente! ⭐', '¡Así se hace! 💪', '¡Eres un genio! 🧠', '¡Perfecto! 🙌']
const bigButton = 'rounded-2xl border-b-4 px-5 py-3 text-base font-bold transition active:translate-y-0.5 active:border-b-2'

// ------------------------------------------------------------------ clasificar
function Sort({ activity, onDone, onFeedback }: GameProps<Extract<Activity, { tipo: 'clasificar' }>>) {
  const [placed, setPlaced] = useState<Record<number, string>>({})
  const [selected, setSelected] = useState<number | null>(null)
  const [shake, setShake] = useState<{ item: number; key: number } | null>(null)

  const place = (item: number | null, group: string) => {
    if (item === null) {
      onFeedback('Primero elige una tarjeta y luego toca el grupo donde va. 👆', 'pensando')
      return
    }
    const element = activity.elementos[item]
    if (element.grupo !== group) {
      setShake({ item, key: (shake?.key ?? 0) + 1 })
      onFeedback(`¡Uy! «${element.texto}» no va en «${group}». ¡Inténtalo en otro grupo!`, 'pensando')
      return
    }
    const next = { ...placed, [item]: group }
    setPlaced(next)
    setSelected(null)
    const count = Object.keys(next).length
    if (count === activity.elementos.length) onDone()
    else onFeedback(CHEERS[count % CHEERS.length], 'feliz')
  }

  const pending = activity.elementos.map((element, index) => ({ element, index })).filter(({ index }) => placed[index] === undefined)

  return (
    <div>
      <div className="flex min-h-14 flex-wrap gap-2">
        {pending.map(({ element, index }) => (
          <button
            key={`${index}-${shake?.item === index ? shake.key : 0}`}
            type="button"
            draggable
            onDragStart={(event: DragEvent) => {
              event.dataTransfer.setData('text/plain', String(index))
              setSelected(index)
            }}
            onClick={() => setSelected(selected === index ? null : index)}
            aria-pressed={selected === index}
            className={`flex items-center gap-2 rounded-2xl border-2 px-4 py-2.5 text-base font-semibold text-ink shadow-sm transition ${
              selected === index ? '-translate-y-1 border-amber-400 bg-amber-50 shadow-md' : 'border-slate-200 bg-white hover:border-teal-400'
            } ${shake?.item === index ? 'lp-shake' : ''}`}
          >
            {element.emoji && <span className="text-2xl" aria-hidden="true">{element.emoji}</span>}
            <ChemText text={element.texto} />
          </button>
        ))}
      </div>
      <div className={`mt-4 grid gap-3 ${activity.grupos.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
        {activity.grupos.map((group) => (
          <button
            key={group.nombre}
            type="button"
            onClick={() => place(selected, group.nombre)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              place(Number(event.dataTransfer.getData('text/plain')), group.nombre)
            }}
            className={`min-h-32 rounded-2xl border-2 border-dashed p-3 text-left transition ${selected !== null ? 'border-teal-500 bg-teal-50/80' : 'border-teal-200 bg-teal-50/40'}`}
          >
            <span className="flex items-center gap-2 font-display text-lg font-bold text-ink">
              {group.emoji && <span className="text-2xl" aria-hidden="true">{group.emoji}</span>}
              {group.nombre}
            </span>
            <span className="mt-2 flex flex-wrap gap-1.5">
              {activity.elementos.map((element, index) => placed[index] === group.nombre && (
                <span key={index} className="lv-enter flex items-center gap-1 rounded-xl bg-white px-2.5 py-1 text-sm font-semibold text-ink shadow-sm">
                  {element.emoji && <span aria-hidden="true">{element.emoji}</span>}
                  <ChemText text={element.texto} /> ✅
                </span>
              ))}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ------------------------------------------------------------ verdadero / falso
function TrueFalse({ activity, onDone, onFeedback }: GameProps<Extract<Activity, { tipo: 'verdadero_falso' }>>) {
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const statement = activity.afirmaciones[index]
  const last = index === activity.afirmaciones.length - 1

  const choose = (value: boolean) => {
    if (answer !== null) return
    setAnswer(value)
    const correct = value === statement.respuesta
    if (correct) setScore(score + 1)
    onFeedback(correct ? CHEERS[index % CHEERS.length] : '¡Casi! Lee la explicación y sigue adelante. 💪', correct ? 'feliz' : 'pensando')
  }

  const next = () => {
    if (last) {
      onDone(`Acertaste ${score} de ${activity.afirmaciones.length}`)
      return
    }
    setIndex(index + 1)
    setAnswer(null)
  }

  const correct = answer !== null && answer === statement.respuesta
  return (
    <div key={index} className="lv-enter">
      <p className="text-sm font-semibold text-ink/60">Frase {index + 1} de {activity.afirmaciones.length}</p>
      <p className="mt-2 rounded-2xl bg-white px-5 py-4 text-center font-display text-xl font-semibold text-ink shadow-sm"><ChemText text={statement.texto} /></p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {[true, false].map((value) => {
          const chosen = answer === value
          const isRight = answer !== null && value === statement.respuesta
          return (
            <button
              key={String(value)}
              type="button"
              disabled={answer !== null}
              onClick={() => choose(value)}
              className={`${bigButton} ${
                isRight ? 'border-emerald-700 bg-emerald-500 text-white' : chosen ? 'border-rose-700 bg-rose-500 text-white' : value ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100' : 'border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-100'
              } disabled:cursor-default`}
            >
              {value ? '✅ Verdadero' : '❌ Falso'}
            </button>
          )
        })}
      </div>
      {answer !== null && (
        <div className={`lv-enter mt-4 rounded-2xl px-4 py-3 ${correct ? 'bg-emerald-50' : 'bg-amber-50'}`}>
          <p className="font-bold text-ink">{correct ? '¡Correcto! 🎉' : `¡Casi! Era ${statement.respuesta ? 'verdadero' : 'falso'}.`}</p>
          <p className="mt-1 text-ink/80"><ChemText text={statement.explicacion} /></p>
          <button type="button" className={`${bigButton} mt-3 border-teal-800 bg-teal-600 text-white hover:bg-teal-500`} onClick={next}>
            {last ? 'Terminar ✨' : 'Siguiente →'}
          </button>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------- descubre
function Discover({ activity, onDone, onFeedback }: GameProps<Extract<Activity, { tipo: 'descubre' }>>) {
  const [flipped, setFlipped] = useState<number[]>([])
  const [seen, setSeen] = useState<number[]>([])

  const flip = (index: number) => {
    setFlipped(flipped.includes(index) ? flipped.filter((item) => item !== index) : [...flipped, index])
    if (seen.includes(index)) return
    const nextSeen = [...seen, index]
    setSeen(nextSeen)
    if (nextSeen.length === activity.tarjetas.length) onDone()
    else onFeedback(`¡Descubriste ${nextSeen.length} de ${activity.tarjetas.length}! Sigue tocando tarjetas. 🃏`, 'feliz')
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {activity.tarjetas.map((card, index) => (
        <button
          key={index}
          type="button"
          onClick={() => flip(index)}
          aria-label={flipped.includes(index) ? card.reverso.replace(/\*\*/g, '') : `${card.frente} (toca para voltear)`}
          className={`flip-card h-36 text-left ${flipped.includes(index) ? 'flipped' : ''}`}
        >
          <span className="flip-inner block">
            <span className="flip-face flex flex-col items-center justify-center gap-2 rounded-2xl border-b-4 border-teal-700 bg-gradient-to-br from-teal-400 to-teal-600 p-4 text-center text-white shadow-md">
              {card.emoji && <span className="text-4xl" aria-hidden="true">{card.emoji}</span>}
              <span className="font-display text-base font-bold"><ChemText text={card.frente} /></span>
              <span className="text-xs opacity-80">Toca para voltear 🔄</span>
            </span>
            <span className="flip-face flip-back flex items-center justify-center rounded-2xl border-2 border-teal-300 bg-white p-4 text-center text-base text-ink shadow-md">
              <span><ChemText text={card.reverso} /></span>
            </span>
          </span>
        </button>
      ))}
    </div>
  )
}

// --------------------------------------------------------------- construye
const ATOM_STYLE: Record<string, string> = {
  H: 'bg-white text-ink border-slate-300',
  O: 'bg-red-500 text-white border-red-700',
  C: 'bg-slate-800 text-white border-slate-950',
  N: 'bg-blue-500 text-white border-blue-700',
  Cl: 'bg-green-500 text-white border-green-700',
  Na: 'bg-violet-500 text-white border-violet-700',
}
const atomStyle = (symbol: string) => ATOM_STYLE[symbol] ?? 'bg-amber-400 text-ink border-amber-600'

function Build({ activity, onDone, onFeedback }: GameProps<Extract<Activity, { tipo: 'construye' }>>) {
  const [target, setTarget] = useState(0)
  const [built, setBuilt] = useState<string[]>([])
  const [solved, setSolved] = useState(false)
  const molecule = activity.moleculas[target]

  const check = () => {
    const want = parseFormula(molecule.formula)
    const have: Record<string, number> = {}
    for (const atom of built) have[atom] = (have[atom] ?? 0) + 1
    for (const atom of activity.atomos) {
      const diff = (want[atom] ?? 0) - (have[atom] ?? 0)
      if (diff > 0) return onFeedback(`Te ${diff === 1 ? 'falta 1 átomo' : `faltan ${diff} átomos`} de ${atom}. ¡Mira bien la fórmula! 🔍`, 'pensando')
      if (diff < 0) return onFeedback(`Te ${diff === -1 ? 'sobra 1 átomo' : `sobran ${-diff} átomos`} de ${atom}. Toca un átomo para quitarlo.`, 'pensando')
    }
    setSolved(true)
    onFeedback(`¡Armaste ${molecule.nombre}! ${CHEERS[target % CHEERS.length]}`, 'feliz')
  }

  const next = () => {
    if (target === activity.moleculas.length - 1) return onDone()
    setTarget(target + 1)
    setBuilt([])
    setSolved(false)
  }

  return (
    <div key={target} className="lv-enter">
      <p className="text-sm font-semibold text-ink/60">Molécula {target + 1} de {activity.moleculas.length}</p>
      <p className="mt-1 font-display text-2xl font-bold text-ink">
        Arma: <span className="text-teal-700"><ChemText text={molecule.formula} /></span> <span className="text-base font-semibold text-ink/70">({molecule.nombre})</span>
      </p>

      <div className={`mt-3 flex min-h-24 flex-wrap items-center justify-center gap-1 rounded-2xl border-2 border-dashed p-4 ${solved ? 'border-emerald-400 bg-emerald-50' : 'border-slate-300 bg-white/70'}`}>
        {built.length === 0 && <span className="text-sm text-ink/50">Toca los átomos de abajo para agregarlos aquí 👇</span>}
        {built.map((atom, index) => (
          <button
            key={index}
            type="button"
            disabled={solved}
            onClick={() => setBuilt(built.filter((_, item) => item !== index))}
            aria-label={`Quitar ${atom}`}
            className={`mascot-pop flex h-14 w-14 items-center justify-center rounded-full border-b-4 text-lg font-bold shadow ${atomStyle(atom)}`}
          >
            {atom}
          </button>
        ))}
      </div>

      {solved ? (
        <button type="button" className={`${bigButton} mt-4 border-teal-800 bg-teal-600 text-white hover:bg-teal-500`} onClick={next}>
          {target === activity.moleculas.length - 1 ? 'Terminar ✨' : 'Siguiente molécula →'}
        </button>
      ) : (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {activity.atomos.map((atom) => (
            <button
              key={atom}
              type="button"
              onClick={() => built.length < 12 && setBuilt([...built, atom])}
              aria-label={`Agregar ${atom}`}
              className={`flex h-14 w-14 items-center justify-center rounded-full border-b-4 text-lg font-bold shadow transition hover:-translate-y-1 active:translate-y-0 ${atomStyle(atom)}`}
            >
              {atom}
            </button>
          ))}
          <span className="mx-1 hidden h-10 w-px bg-slate-200 sm:block" aria-hidden="true" />
          <button type="button" className={`${bigButton} border-slate-300 bg-white text-ink/70 hover:bg-slate-50`} onClick={() => setBuilt([])}>Borrar</button>
          <button type="button" disabled={built.length === 0} className={`${bigButton} border-teal-800 bg-teal-600 text-white hover:bg-teal-500 disabled:border-slate-300 disabled:bg-slate-200 disabled:text-ink/40`} onClick={check}>
            Comprobar ✔
          </button>
        </div>
      )}
    </div>
  )
}

// ----------------------------------------------------------------- balanza
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))

function Balance({ activity, onDone, onFeedback }: GameProps<Extract<Activity, { tipo: 'balanza' }>>) {
  const [round, setRound] = useState(0)
  const { reactivos, productos } = splitEquation(activity.ecuaciones[round].ecuacion)
  const species = [...reactivos, ...productos]
  const [coefficients, setCoefficients] = useState<number[]>(() => species.map(() => 1))
  const [solved, setSolved] = useState(false)

  const side = (formulas: string[], offset: number) => {
    const counts: Record<string, number> = {}
    formulas.forEach((formula, index) => {
      for (const [element, amount] of Object.entries(parseFormula(formula))) counts[element] = (counts[element] ?? 0) + amount * coefficients[index + offset]
    })
    return counts
  }
  const left = side(reactivos, 0)
  const right = side(productos, reactivos.length)
  const elements = [...new Set([...Object.keys(left), ...Object.keys(right)])]
  const balanced = elements.every((element) => left[element] === right[element])
  const totalLeft = Object.values(left).reduce((sum, value) => sum + value, 0)
  const totalRight = Object.values(right).reduce((sum, value) => sum + value, 0)
  const tilt = balanced ? 0 : Math.max(-14, Math.min(14, (totalRight - totalLeft) * 4)) || 6

  const change = (position: number, delta: number) => {
    if (solved) return
    setCoefficients(coefficients.map((value, index) => (index === position ? Math.max(1, Math.min(9, value + delta)) : value)))
  }

  const check = () => {
    if (!balanced) return onFeedback('Todavía no está pareja. Revisa qué átomo no empata en la tabla. ⚖️', 'pensando')
    if (coefficients.reduce(gcd) !== 1) return onFeedback('¡Está pareja! Pero puedes usar números más pequeños. Intenta bajarlos. 😉', 'pensando')
    setSolved(true)
    onFeedback(`¡Balanza pareja! ${CHEERS[round % CHEERS.length]}`, 'feliz')
  }

  const next = () => {
    if (round === activity.ecuaciones.length - 1) return onDone()
    const nextEquation = splitEquation(activity.ecuaciones[round + 1].ecuacion)
    setRound(round + 1)
    setCoefficients([...nextEquation.reactivos, ...nextEquation.productos].map(() => 1))
    setSolved(false)
  }

  return (
    <div key={round} className="lv-enter">
      <p className="text-sm font-semibold text-ink/60">Ecuación {round + 1} de {activity.ecuaciones.length}</p>

      <svg viewBox="0 0 200 90" className="mx-auto mt-2 h-24 w-56" aria-hidden="true">
        <path d="M100 30 L88 82 H112 Z" fill="#94a3b8" />
        <g style={{ transform: `rotate(${tilt}deg)`, transformOrigin: '100px 30px', transition: 'transform 0.4s' }}>
          <rect x="20" y="27" width="160" height="6" rx="3" fill={balanced ? '#10b981' : '#64748b'} />
          <path d="M30 33 L18 55 H52 L40 33" fill="none" stroke="#64748b" strokeWidth="2" />
          <path d="M160 33 L148 55 H182 L170 33" fill="none" stroke="#64748b" strokeWidth="2" />
          <rect x="14" y="54" width="42" height="6" rx="3" fill="#14b8a6" />
          <rect x="144" y="54" width="42" height="6" rx="3" fill="#14b8a6" />
        </g>
        <circle cx="100" cy="30" r="5" fill="#334155" />
      </svg>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-4 text-xl text-ink">
        {species.map((formula, position) => (
          <span key={position} className="flex items-center gap-2">
            {position === reactivos.length && <span className="px-1 text-ink/50">→</span>}
            {position > 0 && position !== reactivos.length && <span className="text-ink/50">+</span>}
            <span className="flex flex-col items-center rounded-xl border-2 border-slate-200 bg-white">
              <button type="button" className="w-full rounded-t-lg px-3 text-lg font-bold text-teal-700 hover:bg-teal-50" onClick={() => change(position, 1)} aria-label={`Subir el número de ${formula.replace(/_/g, '')}`}>+</button>
              <span className="w-10 text-center text-xl font-bold text-teal-700">{coefficients[position]}</span>
              <button type="button" className="w-full rounded-b-lg px-3 text-lg font-bold text-teal-700 hover:bg-teal-50" onClick={() => change(position, -1)} aria-label={`Bajar el número de ${formula.replace(/_/g, '')}`}>−</button>
            </span>
            <span className="font-semibold"><ChemText text={formula} /></span>
          </span>
        ))}
      </div>

      <table className="mx-auto mt-4 text-center text-sm">
        <thead>
          <tr className="text-ink/60">
            <th className="px-3 py-1 font-semibold">Átomo</th>
            <th className="px-3 py-1 font-semibold">Izquierda</th>
            <th className="px-3 py-1 font-semibold">Derecha</th>
            <th className="px-3 py-1" />
          </tr>
        </thead>
        <tbody>
          {elements.map((element) => {
            const ok = left[element] === right[element]
            return (
              <tr key={element} className={ok ? 'text-emerald-700' : 'text-rose-600'}>
                <td className="px-3 py-1 font-bold">{element}</td>
                <td className="px-3 py-1 text-base font-bold">{left[element] ?? 0}</td>
                <td className="px-3 py-1 text-base font-bold">{right[element] ?? 0}</td>
                <td className="px-3 py-1">{ok ? '✅' : '❌'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="mt-4 flex justify-center">
        {solved ? (
          <button type="button" className={`${bigButton} border-teal-800 bg-teal-600 text-white hover:bg-teal-500`} onClick={next}>
            {round === activity.ecuaciones.length - 1 ? 'Terminar ✨' : 'Siguiente ecuación →'}
          </button>
        ) : (
          <button type="button" className={`${bigButton} border-teal-800 bg-teal-600 text-white hover:bg-teal-500`} onClick={check}>Comprobar ⚖️</button>
        )}
      </div>
    </div>
  )
}

// ----------------------------------------------------------------- envoltura
export function ActivityBox({ activity, done, onComplete, onFeedback }: { activity: Activity; done: boolean; onComplete: () => void; onFeedback: Feedback }) {
  const [round, setRound] = useState(0)
  const [finished, setFinished] = useState<string | null>(null)

  const finish = (summary?: string) => {
    setFinished(summary ?? '')
    onComplete()
    onFeedback('¡Completaste la actividad! 🏆 Ya puedes pasar al siguiente tema.', 'feliz')
  }

  const props = { onDone: finish, onFeedback }
  return (
    <section className="lv-enter relative overflow-hidden rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-teal-50 p-5 shadow-sm sm:p-6" aria-label="Actividad">
      {finished !== null && <Confetti />}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-display text-xl font-bold text-ink">🎮 ¡A jugar!</p>
        {done && <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">⭐ Completada</span>}
      </div>
      <p className="mt-1 text-ink/80"><ChemText text={activity.instruccion} /></p>

      <div className="mt-4">
        {finished !== null ? (
          <div className="lv-enter rounded-2xl bg-white/80 p-5 text-center">
            <p className="text-5xl" aria-hidden="true">🏆</p>
            <p className="mt-2 font-display text-2xl font-bold text-ink">¡Lo lograste!</p>
            {finished && <p className="mt-1 text-ink/70">{finished}</p>}
            <button type="button" className="mt-3 text-sm font-bold text-teal-700 hover:text-teal-500" onClick={() => { setFinished(null); setRound(round + 1) }}>
              🔄 Jugar otra vez
            </button>
          </div>
        ) : activity.tipo === 'clasificar' ? (
          <Sort key={round} activity={activity} {...props} />
        ) : activity.tipo === 'verdadero_falso' ? (
          <TrueFalse key={round} activity={activity} {...props} />
        ) : activity.tipo === 'descubre' ? (
          <Discover key={round} activity={activity} {...props} />
        ) : activity.tipo === 'construye' ? (
          <Build key={round} activity={activity} {...props} />
        ) : (
          <Balance key={round} activity={activity} {...props} />
        )}
      </div>
    </section>
  )
}
