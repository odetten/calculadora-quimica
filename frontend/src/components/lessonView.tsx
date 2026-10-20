import { useEffect, useState } from 'react'
import { apiRequest } from '../api.ts'
import { splitEquation, type ExamQuestion, type ExamResult, type Lesson, type TheorySection, type WorkedExample } from '../lessons.ts'
import { ActivityBox } from './activities.tsx'
import { ChemText } from './chemText.tsx'
import { Confetti } from './confetti.tsx'
import { Mascot, type MascotMood } from './mascot.tsx'

type Step = 'teoria' | 'ejemplos' | 'examen' | 'resultado'

const STEPS: { id: Step; label: string }[] = [
  { id: 'teoria', label: 'Teoría' },
  { id: 'ejemplos', label: 'Ejemplos' },
  { id: 'examen', label: 'Mini examen' },
]

type LessonViewProps = {
  course: string
  number: number
  onBack: () => void
  onNext: (number: number) => void
}

type Bubble = { title: string; text: string; mood: MascotMood }

const primaryButton = 'rounded-xl border-b-4 border-teal-800 bg-teal-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-500 active:translate-y-0.5 active:border-b-2 disabled:cursor-not-allowed disabled:border-slate-400 disabled:bg-slate-300'
const secondaryButton = 'rounded-xl border-2 border-slate-300 bg-white px-5 py-2 text-sm font-bold text-ink transition hover:border-teal-600 hover:text-teal-800 disabled:invisible'
const linkButton = 'text-xs font-bold text-teal-700 hover:text-teal-500'
const card = 'lv-enter rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm sm:p-6'

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/** «Tema 2 de 5» con puntos para saltar a lo ya visto. */
function Progress({ label, current, total, reached, onJump }: { label: string; current: number; total: number; reached: number; onJump: (index: number) => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm font-semibold text-ink/75">{label} {current + 1} de {total}</p>
      <div className="flex gap-1.5">
        {Array.from({ length: total }, (_, index) => (
          <button
            key={index}
            type="button"
            disabled={index > reached}
            aria-label={`${label} ${index + 1}`}
            aria-current={index === current ? 'step' : undefined}
            onClick={() => onJump(index)}
            className={`h-2.5 rounded-full transition-all ${index === current ? 'w-7 bg-teal-600' : index <= reached ? 'w-2.5 bg-teal-300 hover:bg-teal-500' : 'w-2.5 bg-slate-200'}`}
          />
        ))}
      </div>
    </div>
  )
}

function TheoryCard({ section, kids }: { section: TheorySection; kids: boolean }) {
  const body = kids ? 'text-lg leading-8' : 'leading-7'
  return (
    <article className={card}>
      <div className="flex items-center gap-3">
        {section.emoji && (
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-3xl" aria-hidden="true">{section.emoji}</span>
        )}
        <h2 className={`font-display font-semibold text-ink ${kids ? 'text-3xl' : 'text-2xl'}`}>{section.titulo}</h2>
      </div>
      {section.parrafos?.map((paragraph, index) => (
        <p key={index} className={`mt-3 text-ink ${body}`}><ChemText text={paragraph} /></p>
      ))}
      {section.tabla && (
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead className="bg-teal-50 text-teal-900">
              <tr>
                {section.tabla.columnas.map((column, index) => (
                  <th key={index} scope="col" className="px-3 py-2 font-semibold"><ChemText text={column} /></th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.tabla.filas.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t border-slate-100 even:bg-slate-50/60">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className={`px-3 py-2 text-ink ${cellIndex === 0 ? 'font-semibold' : ''}`}><ChemText text={cell} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {section.puntos && (
        <ul className="mt-4 space-y-2">
          {section.puntos.map((point, index) => (
            <li key={index} className={`flex gap-2.5 text-ink ${kids ? 'text-lg leading-8' : 'leading-6'}`}>
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" aria-hidden="true" />
              <span><ChemText text={point} /></span>
            </li>
          ))}
        </ul>
      )}
      {section.ejemplo && (
        <div className="mt-4 rounded-xl border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm leading-6 text-ink">
          <span className="font-bold text-amber-800">Ejemplo: </span><ChemText text={section.ejemplo} />
        </div>
      )}
    </article>
  )
}

function ExampleCard({ example, index, shown, onShow }: { example: WorkedExample; index: number; shown: number; onShow: (count: number) => void }) {
  const finished = shown >= example.pasos.length
  return (
    <article className={card}>
      <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">Ejemplo {index + 1}</p>
      <h2 className="mt-1 font-display text-2xl font-semibold text-ink">{example.titulo}</h2>
      <p className="mt-3 rounded-xl bg-slate-50 px-4 py-3 leading-7 text-ink"><ChemText text={example.enunciado} /></p>

      {example.datos && (
        <div className="mt-3">
          <p className="text-xs font-bold uppercase tracking-wider text-ink/60">Datos</p>
          <ul className="mt-1 flex flex-wrap gap-2">
            {example.datos.map((item) => (
              <li key={item} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-sm text-ink"><ChemText text={item} /></li>
            ))}
          </ul>
        </div>
      )}

      {shown > 0 && (
        <ol className="mt-5 space-y-4">
          {example.pasos.slice(0, shown).map((step, stepIndex) => (
            <li key={stepIndex} className="lv-enter flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">{stepIndex + 1}</span>
              <div className="min-w-0">
                <p className="font-medium leading-7 text-ink"><ChemText text={step.texto} /></p>
                <p className="mt-1 rounded-lg bg-teal-50/70 px-3 py-2 text-sm leading-6 text-ink/75">
                  <span className="font-semibold text-teal-800">¿Por qué? </span><ChemText text={step.detalle} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}

      {finished ? (
        <p className="lv-enter mt-5 rounded-xl border-l-4 border-emerald-500 bg-emerald-50 px-4 py-3 text-ink">
          <span className="font-bold text-emerald-800">Resultado: </span><ChemText text={example.resultado} />
        </p>
      ) : (
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button type="button" className={primaryButton} onClick={() => onShow(shown + 1)}>
            {shown === 0 ? 'Ver la solución paso a paso' : `Siguiente paso (${shown + 1} de ${example.pasos.length})`}
          </button>
          <button type="button" className="text-sm text-ink/60 hover:text-ink" onClick={() => onShow(example.pasos.length)}>
            Mostrar todo
          </button>
        </div>
      )}
    </article>
  )
}

function QuestionInput({ question, value, onChange, index }: { question: ExamQuestion; value: string; onChange: (value: string) => void; index: number }) {
  if (question.tipo === 'opcion') {
    return (
      <div role="radiogroup" aria-label={`Pregunta ${index + 1}`} className="mt-4 grid gap-2 sm:grid-cols-2">
        {question.opciones.map((option, optionIndex) => {
          const active = value === option
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option)}
              className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm transition ${active ? 'border-teal-600 bg-teal-50 font-semibold text-teal-900' : 'border-slate-200 bg-white text-ink hover:border-teal-400'}`}
            >
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${active ? 'bg-teal-600 text-white' : 'bg-slate-100 text-ink/60'}`}>
                {String.fromCharCode(65 + optionIndex)}
              </span>
              <span><ChemText text={option} /></span>
            </button>
          )
        })}
      </div>
    )
  }

  if (question.tipo === 'numero') {
    return (
      <label className="mt-4 flex items-center gap-2">
        <input
          className="w-44 rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 text-base text-ink focus:border-teal-600 focus:outline-none"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Tu respuesta"
          maxLength={20}
          aria-label={`Respuesta de la pregunta ${index + 1}`}
        />
        {question.unidad && <span className="text-ink/75"><ChemText text={question.unidad} /></span>}
      </label>
    )
  }

  // Coeficientes: una casilla delante de cada sustancia (vacía = 1)
  const { reactivos, productos } = splitEquation(question.ecuacion)
  const species = [...reactivos, ...productos]
  const values = value ? value.split(',') : species.map(() => '')
  const setCoefficient = (position: number, coefficient: string) => {
    const next = species.map((_, item) => (item === position ? coefficient.replace(/\D/g, '').slice(0, 2) : values[item] ?? ''))
    onChange(next.every((item) => item === '') ? '' : next.join(','))
  }
  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-3 text-lg text-ink">
        {species.map((formula, position) => (
          <span key={position} className="flex items-center gap-2">
            {position === reactivos.length && <span className="px-1 text-ink/60">→</span>}
            {position > 0 && position !== reactivos.length && <span className="text-ink/60">+</span>}
            <input
              className="h-11 w-12 rounded-lg border-2 border-slate-200 bg-white text-center text-base font-semibold text-ink focus:border-teal-600 focus:outline-none"
              inputMode="numeric"
              value={values[position] ?? ''}
              onChange={(event) => setCoefficient(position, event.target.value)}
              placeholder="1"
              aria-label={`Coeficiente de ${formula.replace(/_/g, '')}`}
            />
            <span><ChemText text={formula} /></span>
          </span>
        ))}
      </div>
      <p className="mt-2 text-xs text-ink/60">Deja la casilla vacía si el coeficiente es 1.</p>
    </div>
  )
}

/** 3 estrellas con todo bien, 2 si aprobó con algún error, 1 si no aprobó pero acertó algo. */
function stars(result: ExamResult) {
  if (result.aciertos === result.total) return 3
  if (result.aprobado) return 2
  return result.aciertos > 0 ? 1 : 0
}

function formatAnswer(question: ExamQuestion, answer: string | number | number[]) {
  if (question.tipo === 'coeficientes' && Array.isArray(answer)) {
    const { reactivos, productos } = splitEquation(question.ecuacion)
    const withCoefficient = (formula: string, index: number) => `${answer[index] === 1 ? '' : answer[index]}${formula}`
    return `${reactivos.map(withCoefficient).join(' + ')} → ${productos.map((formula, index) => withCoefficient(formula, index + reactivos.length)).join(' + ')}`
  }
  if (question.tipo === 'numero' && question.unidad) return `${answer} ${question.unidad}`
  return String(answer)
}

export function LessonView({ course, number, onBack, onNext }: LessonViewProps) {
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [error, setError] = useState('')
  const [step, setStep] = useState<Step>('teoria')
  const [reachedStep, setReachedStep] = useState(0)
  // Tema, ejemplo y pregunta actuales, y el más lejano visto de cada uno
  const [topic, setTopic] = useState(0)
  const [topicReached, setTopicReached] = useState(0)
  const [example, setExample] = useState(0)
  const [exampleReached, setExampleReached] = useState(0)
  const [stepsShown, setStepsShown] = useState<number[]>([])
  const [question, setQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [result, setResult] = useState<ExamResult | null>(null)
  const [sending, setSending] = useState(false)
  const [examError, setExamError] = useState('')
  // Lo que dice la mascota cuando el alumno pide algo; solo vale para la pantalla donde lo pidió
  const [bubble, setBubble] = useState<(Bubble & { screen: string }) | null>(null)
  const [conceptIndex, setConceptIndex] = useState(0)
  const [activitiesDone, setActivitiesDone] = useState<number[]>([])

  useEffect(() => {
    let cancelled = false
    apiRequest<Lesson>(`/lessons/${course}/${number}`)
      .then((data) => {
        if (cancelled) return
        setLesson(data)
        setAnswers(data.examen.map(() => ''))
        setStepsShown(data.ejemplos.map(() => 0))
        if (data.aprobada) {
          // Si ya la aprobó puede ir directo a cualquier parte
          setReachedStep(2)
          setTopicReached(data.teoria.length - 1)
          setExampleReached(data.ejemplos.length - 1)
        }
      })
      .catch((requestError: unknown) => {
        if (!cancelled) setError(requestError instanceof Error ? requestError.message : 'No se pudo abrir la lección.')
      })
    return () => { cancelled = true }
  }, [course, number])

  if (error || !lesson) {
    return (
      <section className="mx-auto w-full max-w-3xl px-6 pb-10 pt-3 sm:px-10">
        <button type="button" className="mb-2 w-fit text-sm text-ink/75 hover:text-teal-800" onClick={onBack}>← Volver al camino</button>
        <p className={`mt-10 text-center ${error ? 'text-rose-700' : 'text-ink/75'}`} role={error ? 'alert' : undefined}>{error || 'Cargando lección…'}</p>
      </section>
    )
  }

  const goToStep = (next: Step) => {
    const index = STEPS.findIndex((item) => item.id === next)
    if (index > reachedStep) setReachedStep(index)
    setStep(next)
    scrollTop()
  }

  const goToTopic = (index: number) => {
    setTopic(index)
    setTopicReached((reached) => Math.max(reached, index))
    scrollTop()
  }

  const goToExample = (index: number) => {
    setExample(index)
    setExampleReached((reached) => Math.max(reached, index))
    scrollTop()
  }

  const submitExam = async () => {
    const missing = answers.findIndex((answer) => answer.trim() === '')
    if (missing !== -1) {
      setQuestion(missing)
      setExamError(`Te falta responder la pregunta ${missing + 1}.`)
      return
    }
    setExamError('')
    setSending(true)
    try {
      const data = await apiRequest<ExamResult>(`/lessons/${course}/${number}/exam`, {
        method: 'POST',
        body: JSON.stringify({ respuestas: answers }),
      })
      setResult(data)
      setStep('resultado')
      scrollTop()
    } catch (requestError) {
      setExamError(requestError instanceof Error ? requestError.message : 'No se pudo calificar el examen.')
    } finally {
      setSending(false)
    }
  }

  const retry = () => {
    setAnswers(lesson.examen.map(() => ''))
    setResult(null)
    setQuestion(0)
    goToStep('examen')
  }

  const reviewTheory = () => {
    setTopic(0)
    goToStep('teoria')
  }

  const kids = lesson.nivel === 'basico'
  const section = lesson.teoria[topic]
  // En básico hay que jugar la actividad del tema antes de avanzar (salvo si ya aprobó la lección)
  const topicLocked = Boolean(section.actividad) && !lesson.aprobada && !activitiesDone.includes(topic)
  const passCount = Math.ceil((lesson.aprobado_minimo / 100) * lesson.examen.length)

  // ---- Mascota ----
  const concepts = lesson.teoria.map((item) => item.tip)
  const screen = step === 'teoria' ? `t${topic}` : step === 'ejemplos' ? `e${example}` : step === 'examen' ? `q${question}` : 'r'
  const nextConcept = () => {
    const next = (conceptIndex + 1) % concepts.length
    setConceptIndex(next)
    setBubble({ screen, title: `Concepto clave ${next + 1} de ${concepts.length}`, text: concepts[next], mood: 'feliz' })
  }

  let base: Bubble
  if (step === 'teoria') {
    base = { title: 'Concepto clave', text: section.tip, mood: 'feliz' }
  } else if (step === 'ejemplos') {
    const finished = (stepsShown[example] ?? 0) >= lesson.ejemplos[example].pasos.length
    base = finished
      ? { title: 'Tip', text: lesson.ejemplos[example].tip, mood: 'feliz' }
      : { title: 'Antes de ver la solución', text: 'Intenta resolverlo tú primero en una hoja. Luego revela los pasos uno por uno y compara con lo que hiciste.', mood: 'pensando' }
  } else if (step === 'examen') {
    base = kids
      ? { title: '¡Hora del reto!', text: 'Lee despacito cada pregunta. Si no sabes, pídeme una pista. ¡Yo te ayudo! 💪', mood: 'feliz' }
      : { title: '¡Tú puedes!', text: 'Lee con calma la pregunta. Si te atoras, pídeme una pista: no te daré la respuesta, pero sí un empujoncito.', mood: 'feliz' }
  } else if (result?.aprobado) {
    base = {
      title: '¡Lo lograste!',
      text: result.siguiente_desbloqueada ? '¡Excelente trabajo! Ya desbloqueaste la siguiente lección. Revisa las explicaciones para reforzar lo que aprendiste.' : '¡Terminaste todas las lecciones del curso! Eres todo un químico.',
      mood: 'feliz',
    }
  } else {
    base = { title: 'No pasa nada', text: 'Equivocarse es parte de aprender. Repasa los temas de las preguntas que fallaste y vuelve a intentarlo. ¡Yo te acompaño!', mood: 'triste' }
  }
  const shownBubble = bubble?.screen === screen ? bubble : base

  const mascotActions = step === 'examen'
    ? <button type="button" className={linkButton} onClick={() => setBubble({ screen, title: `Pista para la pregunta ${question + 1}`, text: lesson.examen[question].pista, mood: 'pensando' })}>💡 Pedir una pista</button>
    : <button type="button" className={linkButton} onClick={nextConcept}>Otro concepto clave →</button>

  const activeStep = step === 'resultado' ? 2 : STEPS.findIndex((item) => item.id === step)
  const currentQuestion = lesson.examen[question]
  const answeredCount = answers.filter((answer) => answer.trim() !== '').length

  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-16 pt-3 sm:px-10">
      <button type="button" className="mb-2 w-fit text-sm text-ink/75 hover:text-teal-800" onClick={onBack}>← Volver al camino</button>

      <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">Lección {lesson.numero} de {lesson.total}</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-ink sm:text-4xl">{lesson.titulo}</h1>
      <p className="mt-2 text-ink/75">{lesson.resumen}</p>

      <nav aria-label="Partes de la lección" className="mt-6 flex max-w-3xl gap-2">
        {STEPS.map((item, index) => {
          const enabled = index <= reachedStep
          const active = index === activeStep
          return (
            <button
              key={item.id}
              type="button"
              disabled={!enabled}
              aria-current={active ? 'step' : undefined}
              onClick={() => (item.id === 'examen' && result ? setStep('resultado') : goToStep(item.id))}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-2 py-2 text-xs font-bold transition sm:text-sm ${
                active ? 'border-teal-600 bg-teal-600 text-white' : enabled ? 'border-teal-200 bg-white text-teal-800 hover:border-teal-500' : 'border-slate-200 bg-slate-50 text-slate-400'
              }`}
            >
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${active ? 'bg-white text-teal-700' : enabled ? 'bg-teal-100' : 'bg-slate-200'}`}>{index + 1}</span>
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-10">
        <aside className="lg:sticky lg:top-24 lg:order-2 lg:self-start" aria-label="Quimi, tu guía">
          <Mascot title={shownBubble.title} message={shownBubble.text} mood={shownBubble.mood} actions={mascotActions} onPoke={step === 'examen' ? undefined : nextConcept} />
        </aside>

        <div className="min-w-0 space-y-5 lg:order-1">
          {step === 'teoria' && (
            <>
              <Progress label="Tema" current={topic} total={lesson.teoria.length} reached={topicReached} onJump={goToTopic} />
              <TheoryCard key={topic} section={section} kids={kids} />
              {section.actividad && (
                <ActivityBox
                  key={`actividad-${topic}`}
                  activity={section.actividad}
                  done={activitiesDone.includes(topic)}
                  onComplete={() => setActivitiesDone((previous) => (previous.includes(topic) ? previous : [...previous, topic]))}
                  onFeedback={(text, mood) => setBubble({ screen, title: 'Quimi dice', text, mood })}
                />
              )}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button type="button" className={secondaryButton} disabled={topic === 0} onClick={() => goToTopic(topic - 1)}>← Tema anterior</button>
                {topicLocked && <p className="text-sm font-semibold text-amber-700">🎮 Completa la actividad para seguir</p>}
                {topic < lesson.teoria.length - 1 ? (
                  <button type="button" className={primaryButton} disabled={topicLocked} onClick={() => goToTopic(topic + 1)}>Siguiente tema →</button>
                ) : (
                  <button type="button" className={primaryButton} disabled={topicLocked} onClick={() => goToStep('ejemplos')}>Ver ejemplos resueltos →</button>
                )}
              </div>
            </>
          )}

          {step === 'ejemplos' && (
            <>
              <Progress label="Ejemplo" current={example} total={lesson.ejemplos.length} reached={exampleReached} onJump={goToExample} />
              <ExampleCard
                key={example}
                example={lesson.ejemplos[example]}
                index={example}
                shown={stepsShown[example] ?? 0}
                onShow={(count) => setStepsShown((previous) => previous.map((value, index) => (index === example ? count : value)))}
              />
              <div className="flex flex-wrap justify-between gap-3">
                {example === 0 ? (
                  <button type="button" className={secondaryButton} onClick={() => { setTopic(lesson.teoria.length - 1); goToStep('teoria') }}>← Volver a la teoría</button>
                ) : (
                  <button type="button" className={secondaryButton} onClick={() => goToExample(example - 1)}>← Ejemplo anterior</button>
                )}
                {example < lesson.ejemplos.length - 1 ? (
                  <button type="button" className={primaryButton} onClick={() => goToExample(example + 1)}>Siguiente ejemplo →</button>
                ) : (
                  <button type="button" className={primaryButton} onClick={() => goToStep('examen')}>Ir al mini examen →</button>
                )}
              </div>
            </>
          )}

          {step === 'examen' && (
            <>
              <p className={`rounded-xl bg-teal-50 px-4 py-3 text-teal-900 ${kids ? 'text-base' : 'text-sm'}`}>
                {kids
                  ? <>🏆 ¡Hora del reto! Si aciertas <strong>{passCount} de {lesson.examen.length}</strong> preguntas, ganas y desbloqueas la siguiente lección. ¡Puedes intentarlo las veces que quieras!</>
                  : <>Necesitas al menos <strong>{lesson.aprobado_minimo} %</strong> para aprobar y desbloquear la siguiente lección. Puedes intentarlo las veces que quieras.</>}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-ink/75">Pregunta {question + 1} de {lesson.examen.length} · {answeredCount} respondidas</p>
                <div className="flex gap-1.5">
                  {lesson.examen.map((_, index) => {
                    const answered = answers[index]?.trim() !== ''
                    return (
                      <button
                        key={index}
                        type="button"
                        aria-label={`Ir a la pregunta ${index + 1}${answered ? ' (respondida)' : ''}`}
                        aria-current={index === question ? 'step' : undefined}
                        onClick={() => setQuestion(index)}
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition ${
                          index === question ? 'border-teal-600 bg-teal-600 text-white' : answered ? 'border-teal-300 bg-teal-50 text-teal-800' : 'border-slate-200 bg-white text-ink/60 hover:border-teal-400'
                        }`}
                      >
                        {index + 1}
                      </button>
                    )
                  })}
                </div>
              </div>
              <article key={question} className={card}>
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">Pregunta {question + 1}</p>
                <p className="mt-2 text-lg font-medium leading-8 text-ink"><ChemText text={currentQuestion.pregunta} /></p>
                <QuestionInput
                  question={currentQuestion}
                  index={question}
                  value={answers[question] ?? ''}
                  onChange={(value) => {
                    setExamError('')
                    setAnswers((previous) => previous.map((item, position) => (position === question ? value : item)))
                  }}
                />
              </article>
              {examError && <p className="text-sm text-rose-700" role="alert">{examError}</p>}
              <div className="flex flex-wrap justify-between gap-3">
                <button type="button" className={secondaryButton} disabled={question === 0} onClick={() => setQuestion(question - 1)}>← Anterior</button>
                {question < lesson.examen.length - 1 ? (
                  <button type="button" className={primaryButton} disabled={(answers[question] ?? '').trim() === ''} onClick={() => setQuestion(question + 1)}>
                    Siguiente pregunta →
                  </button>
                ) : (
                  <button type="button" className={primaryButton} disabled={sending} onClick={submitExam}>
                    {sending ? 'Calificando…' : 'Calificar examen'}
                  </button>
                )}
              </div>
            </>
          )}

          {step === 'resultado' && result && (
            <>
              <div className={`lv-enter relative overflow-hidden rounded-2xl border-2 p-6 text-center ${result.aprobado ? 'border-emerald-300 bg-emerald-50' : 'border-amber-300 bg-amber-50'}`}>
                {result.aprobado && <Confetti />}
                {kids && (
                  <p className="text-5xl tracking-widest" aria-label={`${stars(result)} de 3 estrellas`}>
                    {[0, 1, 2].map((index) => <span key={index} className={index < stars(result) ? '' : 'opacity-20 grayscale'}>⭐</span>)}
                  </p>
                )}
                <p className={`font-display text-5xl font-bold ${result.aprobado ? 'text-emerald-700' : 'text-amber-700'}`}>{kids ? `${result.aciertos} de ${result.total}` : `${result.puntaje} %`}</p>
                <p className="mt-1 text-sm text-ink/75">{kids ? 'correctas' : `${result.aciertos} de ${result.total} correctas`} · intento {result.intentos}</p>
                <p className="mt-3 font-display text-xl font-semibold text-ink">
                  {result.aprobado
                    ? result.siguiente_desbloqueada ? '¡Aprobaste! Desbloqueaste la siguiente lección.' : '¡Aprobaste! Terminaste todas las lecciones del curso.'
                    : kids ? `¡Casi! Necesitas ${passCount} correctas para ganar. ¡Tú puedes!` : `Aún no. Necesitas ${result.aprobado_minimo} % para aprobar.`}
                </p>
              </div>

              <ol className="space-y-3">
                {lesson.examen.map((item, index) => {
                  const outcome = result.resultados[index]
                  return (
                    <li key={index} className={`rounded-xl border-l-4 bg-white/90 px-4 py-3 shadow-sm ${outcome.correcto ? 'border-emerald-500' : 'border-rose-400'}`}>
                      <p className="text-sm text-ink">
                        <span className={`mr-2 font-bold ${outcome.correcto ? 'text-emerald-700' : 'text-rose-600'}`}>{outcome.correcto ? '✓' : '✗'}</span>
                        {index + 1}. <ChemText text={item.pregunta} />
                      </p>
                      {outcome.respuesta !== undefined && (
                        <p className="mt-1.5 text-sm text-ink">
                          <strong>Respuesta:</strong> <ChemText text={formatAnswer(item, outcome.respuesta)} />
                        </p>
                      )}
                      {outcome.explicacion && <p className="mt-1 text-sm text-ink/75"><ChemText text={outcome.explicacion} /></p>}
                      {!outcome.correcto && !result.aprobado && <p className="mt-1 text-xs text-ink/60">Pista: <ChemText text={item.pista} /></p>}
                    </li>
                  )
                })}
              </ol>

              <div className="flex flex-wrap justify-between gap-3">
                {result.aprobado ? (
                  <>
                    <button type="button" className={secondaryButton} onClick={onBack}>Volver al camino</button>
                    {result.siguiente_desbloqueada && (
                      <button type="button" className={primaryButton} onClick={() => onNext(number + 1)}>Siguiente lección →</button>
                    )}
                  </>
                ) : (
                  <>
                    <button type="button" className={secondaryButton} onClick={reviewTheory}>Repasar la teoría</button>
                    <button type="button" className={primaryButton} onClick={retry}>Intentar de nuevo</button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
