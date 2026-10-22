import { useMemo, useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, Lightbulb, Puzzle, Sparkles } from 'lucide-react'
import { buildGuide, parseBalanced, splitExplanation, toChemText } from '../tools/balanceGuide.ts'
import { ChemText } from './chemText.tsx'
import { Confetti } from './confetti.tsx'
import { Quimi, type MascotMood } from './mascot.tsx'

// Lo que el balanceador necesita para tapar coeficientes durante el reto
export type GuideView = {
  coefficients: Array<number | null>
  // Casillas que se están adivinando en la pregunta actual
  focus: number[]
}

type BalanceTutorProps = {
  balanced: string
  explanation: string
  explanationLoading: boolean
  explanationError: string
  onGuideChange: (view: GuideView | null) => void
}

type Mode = 'menu' | 'hidden' | 'quiz' | 'explain'

type Bubble = {
  key: string
  title: string
  text: string
  mood: MascotMood
  options: ReactNode
  progress?: string
  ai?: boolean
  typing?: boolean
  note?: string
  links?: ReactNode
  party?: boolean
}

// Lo que tarda Quimi en "escribir" un mensaje; las opciones aparecen al terminar
const typingMs = (text: string) => Math.min(text.split(/\s+/).length * 45, 1400)

// Muestra el mensaje palabra por palabra, como si Quimi lo fuera escribiendo
function TypedText({ text }: { text: string }) {
  const tokens = text.split(/(\s+)/)
  const delay = typingMs(text) / Math.max(tokens.length / 2, 1)
  return (
    <p className="tutor-text" aria-hidden="true">
      {tokens.map((token, index) => index % 2 === 1 ? token : (
        <span key={index} className="tutor-word" style={{ animationDelay: `${(index / 2) * delay}ms` }}>
          <ChemText text={token} />
        </span>
      ))}
    </p>
  )
}

/**
 * Quimi explica el balanceo sin chat: cada mensaje trae 2 o 3 opciones.
 * El reto se arma con los coeficientes del sistema; la explicación larga viene de la IA.
 */
export function BalanceTutor({ balanced, explanation, explanationLoading, explanationError, onGuideChange }: BalanceTutorProps) {
  const terms = useMemo(() => parseBalanced(balanced), [balanced])
  const questions = useMemo(() => buildGuide(terms), [terms])
  const sections = useMemo(() => splitExplanation(explanation), [explanation])
  const [mode, setMode] = useState<Mode>('menu')
  const [step, setStep] = useState(0)
  const [solved, setSolved] = useState(false)
  const [wrong, setWrong] = useState<number[]>([])
  const [hint, setHint] = useState(false)
  const [jumps, setJumps] = useState(0)

  // Avisa al balanceador qué coeficientes ya se descubrieron
  const report = (index: number, isSolved: boolean) => {
    if (index >= questions.length) {
      onGuideChange(null)
      return
    }
    const shown = new Set(questions.flatMap((question, position) => [
      ...(position <= index ? question.show ?? [] : []),
      ...(position < index || (position === index && isSolved) ? question.reveal : []),
    ]))
    onGuideChange({
      coefficients: terms.map((term, position) => (shown.has(position) ? term.coefficient : null)),
      focus: isSolved ? [] : questions[index].reveal,
    })
  }

  const goToQuestion = (index: number) => {
    setMode('quiz')
    setStep(index)
    setSolved(false)
    setWrong([])
    setHint(false)
    if (index >= questions.length) setJumps((count) => count + 1)
    report(index, false)
  }

  const choose = (option: number) => {
    if (option !== questions[step].answer) {
      setWrong((current) => [...current, option])
      return
    }
    setSolved(true)
    setJumps((count) => count + 1)
    report(step, true)
  }

  const leave = (next: Mode) => {
    setMode(next)
    setStep(0)
    onGuideChange(null)
  }

  const startButton = (label: string, primary = false) => (
    <button type="button" className={`tutor-option ${primary ? 'tutor-option-primary' : ''}`} onClick={() => goToQuestion(0)}>
      <Puzzle size={16} aria-hidden="true" />
      {label}
    </button>
  )
  const menuButton = (label: string) => (
    <button type="button" className="tutor-option" onClick={() => leave('menu')}>{label}</button>
  )

  let bubble: Bubble
  if (mode === 'hidden') {
    bubble = {
      key: 'hidden',
      title: 'Aquí ando',
      text: '¡Va! Si después quieres entender cómo se balanceó, nomás dime.',
      mood: 'feliz',
      options: menuButton('Ayúdame a entenderla'),
    }
  } else if (mode === 'quiz' && step >= questions.length) {
    bubble = {
      key: 'done',
      title: '¡Ecuación equilibrada!',
      text: `¡Lo lograste! ${balanced}. Ahora cada elemento tiene los mismos átomos de los dos lados.`,
      mood: 'feliz',
      party: true,
      options: (
        <>
          <button type="button" className="tutor-option tutor-option-primary" onClick={() => leave('explain')}>
            <Sparkles size={16} aria-hidden="true" />
            Ver la explicación de la IA
          </button>
          {startButton('Repetir el reto')}
        </>
      ),
    }
  } else if (mode === 'quiz') {
    const question = questions[step]
    const helping = !solved && (wrong.length > 0 || hint)
    bubble = {
      key: `quiz-${step}-${solved}`,
      title: question.title,
      progress: `${step + 1} de ${questions.length}`,
      text: solved ? question.explanation : question.prompt,
      mood: solved ? 'feliz' : wrong.length > 0 ? 'triste' : 'pensando',
      note: helping ? `${wrong.length > 0 ? '¡Casi! ' : ''}${question.hint}` : undefined,
      options: solved ? (
        <button type="button" className="tutor-option tutor-option-primary" onClick={() => goToQuestion(step + 1)}>
          {step + 1 < questions.length ? 'Siguiente' : 'Ver cómo quedó'}
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      ) : question.options.map((option, index) => (
        <button
          key={option}
          type="button"
          className={`tutor-option ${wrong.includes(index) ? 'tutor-option-wrong' : ''}`}
          disabled={wrong.includes(index)}
          onClick={() => choose(index)}
        >
          <ChemText text={option} />
        </button>
      )),
      links: !solved && (
        <>
          {!helping && (
            <button type="button" className="tutor-link" onClick={() => setHint(true)}>
              <Lightbulb size={14} aria-hidden="true" />
              Dame una pista
            </button>
          )}
          <button type="button" className="tutor-link" onClick={() => leave('menu')}>Salir del reto</button>
        </>
      ),
    }
  } else if (mode === 'explain' && explanationLoading) {
    bubble = {
      key: 'explain-loading',
      title: 'Pensando…',
      text: 'Estoy escribiendo la explicación con la IA. Tarda unos segundos.',
      mood: 'pensando',
      ai: true,
      typing: true,
      options: (
        <>
          {startButton('Mientras, lo intento yo')}
          {menuButton('Volver')}
        </>
      ),
    }
  } else if (mode === 'explain' && sections.length === 0) {
    bubble = {
      key: 'explain-error',
      title: 'No pude hablar con la IA',
      text: 'La explicación no llegó esta vez. Pero sin IA también te puedo guiar con pistas.',
      mood: 'triste',
      note: explanationError || undefined,
      options: (
        <>
          {startButton('Resolverlo con pistas', true)}
          {menuButton('Volver')}
        </>
      ),
    }
  } else if (mode === 'explain') {
    const index = Math.min(step, sections.length - 1)
    const last = index === sections.length - 1
    bubble = {
      key: `explain-${index}`,
      title: sections[index].title,
      progress: `${index + 1} de ${sections.length}`,
      text: toChemText(sections[index].body),
      mood: last ? 'feliz' : 'pensando',
      ai: true,
      options: (
        <>
          {index > 0 && (
            <button type="button" className="tutor-option" onClick={() => setStep(index - 1)}>
              <ArrowLeft size={16} aria-hidden="true" />
              Anterior
            </button>
          )}
          {last ? (
            <>
              {startButton('Ahora lo intento yo', true)}
              {menuButton('Volver al inicio')}
            </>
          ) : (
            <button type="button" className="tutor-option tutor-option-primary" onClick={() => setStep(index + 1)}>
              Siguiente
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          )}
        </>
      ),
    }
  } else {
    bubble = {
      key: 'menu',
      title: '¡Listo, la equilibré!',
      text: '¿Quieres entender cómo llegué a esos números? Escoge cómo:',
      mood: 'feliz',
      options: (
        <>
          {startButton('Resolverlo yo, con pistas', true)}
          <button type="button" className="tutor-option" onClick={() => leave('explain')}>
            <Sparkles size={16} aria-hidden="true" />
            Explícamelo paso a paso
          </button>
          <button type="button" className="tutor-option" onClick={() => leave('hidden')}>Solo quería el resultado</button>
        </>
      ),
    }
  }

  const appear = { animationDelay: `${typingMs(bubble.text)}ms` }

  return (
    <section className="tutor-card" aria-label="Quimi, tu guía de balanceo">
      {bubble.party && <Confetti />}
      <p className="sr-only" aria-live="polite">
        <ChemText text={`${bubble.title}. ${bubble.text}${bubble.note ? ` ${bubble.note}` : ''}`} />
      </p>
      {/* En celular Quimi va arriba del globo para que el texto tenga todo el ancho */}
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:gap-5">
        <div className="h-20 w-16 shrink-0 sm:h-36 sm:w-28" aria-hidden="true">
          <span key={jumps} className={`block h-full w-full ${jumps > 0 ? 'mascot-jump' : ''}`}>
            <Quimi mood={bubble.mood} />
          </span>
        </div>

        <div key={bubble.key} className="tutor-bubble mascot-pop">
          <span className="tutor-bubble-tail" aria-hidden="true" />
          <div className="flex flex-wrap items-center gap-2">
            <p className="tutor-title">{bubble.title}</p>
            {bubble.ai && <span className="ai-model-badge">IA · Llama 3.1</span>}
            {bubble.progress && <span className="tutor-progress">{bubble.progress}</span>}
          </div>
          <TypedText text={bubble.text} />
          {bubble.typing && (
            <span className="tutor-typing" aria-hidden="true">
              <span className="tutor-dot" />
              <span className="tutor-dot" />
              <span className="tutor-dot" />
            </span>
          )}
          {bubble.note && (
            <p key={wrong.length} className="tutor-note lab-pop" aria-hidden="true">
              <Lightbulb size={16} className="mt-1 shrink-0" />
              <span><ChemText text={bubble.note} /></span>
            </p>
          )}
          <div className="tutor-options tutor-reveal" style={appear}>{bubble.options}</div>
          {bubble.links && <div className="tutor-links tutor-reveal" style={appear}>{bubble.links}</div>}
        </div>
      </div>
    </section>
  )
}
