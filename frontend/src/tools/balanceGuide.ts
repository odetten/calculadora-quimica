import { parseCompound } from './chemistry.ts'
import { ELEMENT_NAMES } from './elements.ts'

// Un compuesto de la ecuación ya balanceada, p. ej. { formula: 'O_2', coefficient: 3, left: true, atoms: { O: 2 } }
export type GuideTerm = {
  formula: string
  coefficient: number
  left: boolean
  atoms: Record<string, number>
}

// Una pregunta del reto de Quimi, con 2 o 3 opciones
export type GuideQuestion = {
  title: string
  prompt: string
  options: string[]
  answer: number
  hint: string
  explanation: string
  // Compuestos cuyo coeficiente se descubre en la ecuación al acertar
  reveal: number[]
  // Compuestos cuyo coeficiente se muestra desde que aparece la pregunta
  show?: number[]
}

export type ExplanationSection = { title: string; body: string }

const gcd = (first: number, second: number): number => (second ? gcd(second, first % second) : first)
const lcm = (first: number, second: number) => (first * second) / gcd(first, second)

const describe = (element: string) => (ELEMENT_NAMES[element] ? `${element} (${ELEMENT_NAMES[element]})` : element)
const withCoefficient = (coefficient: number, formula: string) => `${coefficient === 1 ? '' : coefficient}${formula}`
const atomsOf = (amount: number) => `${amount} ${amount === 1 ? 'átomo' : 'átomos'}`

// La correcta y hasta dos distractores, de menor a mayor para que la respuesta no quede siempre en el mismo lugar
function numberOptions(correct: number, distractors: number[]) {
  const wrong = [...new Set(distractors)].filter((value) => value > 0 && value !== correct).slice(0, 2)
  const options = [correct, ...wrong].sort((first, second) => first - second)
  return { options: options.map(String), answer: options.indexOf(correct) }
}

export function parseBalanced(balanced: string): GuideTerm[] {
  return balanced.split(' → ').flatMap((side, sideIndex) => side.split(' + ').map((term) => {
    const [, coefficient, formula] = term.match(/^(\d*)(.*)$/) ?? ['', '', term]
    return { formula, coefficient: Number(coefficient || 1), left: sideIndex === 0, atoms: parseCompound(formula) }
  }))
}

// Ecuación con los coeficientes descubiertos en el reto; los que faltan cuentan como 1
export function fillCoefficients(balanced: string, coefficients: Array<number | null>) {
  const terms = parseBalanced(balanced)
  const side = (left: boolean) => terms
    .flatMap((term, index) => (term.left === left ? [`${coefficients[index] ?? 1}${term.formula}`] : []))
    .join(' + ')
  return `${side(true)} → ${side(false)}`
}

/**
 * Arma el reto a partir de la ecuación ya balanceada: contar átomos, la regla de oro,
 * el mínimo común múltiplo y luego un coeficiente por pregunta. Todo sale de los
 * coeficientes que calculó el sistema, así que las respuestas siempre son correctas.
 */
export function buildGuide(terms: GuideTerm[]): GuideQuestion[] {
  const elements = [...new Set(terms.flatMap((term) => Object.keys(term.atoms)))]
  const holders = (element: string) => terms.flatMap((term, index) => (term.atoms[element] ? [index] : []))
  const rawCount = (element: string, left: boolean) =>
    terms.reduce((sum, term) => (term.left === left ? sum + (term.atoms[element] ?? 0) : sum), 0)
  const questions: GuideQuestion[] = []

  // 1) Contar átomos tal como viene escrita la ecuación
  const unbalanced = elements.find((element) => rawCount(element, true) !== rawCount(element, false))
  const counted = unbalanced ?? elements[0]
  const left = rawCount(counted, true)
  const right = rawCount(counted, false)
  const severalHolders = holders(counted).filter((index) => terms[index].left).length > 1
  questions.push({
    title: 'Primero, a contar',
    prompt: `Sin coeficientes, ¿cuántos átomos de ${describe(counted)} hay en los reactivos?`,
    ...numberOptions(left, [right, left + 1, left + 2, left * 2]),
    hint: `Busca el ${counted} en las fórmulas de la izquierda. El número pequeñito a su derecha (el subíndice) dice cuántos átomos hay; si no lleva número, es 1.${severalHolders ? ' Está en varias sustancias, así que súmalos.' : ''}`,
    explanation: unbalanced
      ? `¡Exacto! Hay ${left} a la izquierda y ${right} a la derecha. Como no son iguales, la ecuación todavía no está balanceada.`
      : `¡Así es! Hay ${left} de cada lado, y lo mismo pasa con los demás elementos. Esta ecuación ya venía balanceada, así que todos sus coeficientes son 1.`,
    reveal: unbalanced ? [] : terms.map((_, index) => index),
  })
  if (!unbalanced) return questions

  // 2) Solo se pueden cambiar coeficientes, nunca subíndices
  const sample = terms.find((term) => term.formula.includes('_'))?.formula ?? 'H_2O'
  questions.push({
    title: 'La regla de oro',
    prompt: 'Para igualar los átomos, ¿qué número podemos cambiar?',
    options: [`El subíndice, como el ${sample.match(/_(\d+)/)?.[1]} de ${sample}`, 'El coeficiente, el número grande que va adelante'],
    answer: 1,
    hint: 'Si cambias un subíndice, cambias la sustancia: H_2O es agua, pero H_2O_2 es agua oxigenada. ¡Ya no sería la misma reacción!',
    explanation: '¡Eso! El coeficiente multiplica toda la molécula sin cambiar qué sustancia es. Es lo único que vamos a mover.',
    reveal: [],
  })

  // 3) Punto de partida: un elemento que está en una sola sustancia de cada lado, igualado con el mínimo común múltiplo
  const seeds = elements.flatMap((element) => {
    const leftSide = holders(element).filter((index) => terms[index].left)
    const rightSide = holders(element).filter((index) => !terms[index].left)
    if (leftSide.length !== 1 || rightSide.length !== 1) return []
    const [l, r] = [leftSide[0], rightSide[0]]
    const target = lcm(terms[l].atoms[element], terms[r].atoms[element])
    const fits = terms[l].coefficient * terms[l].atoms[element] === target && terms[r].coefficient * terms[r].atoms[element] === target
    return fits ? [{ element, l, r, target }] : []
  })
  const seed = seeds.find(({ element, l, r }) => terms[l].atoms[element] !== terms[r].atoms[element]) ?? seeds[0]
  const known = new Set<number>()

  if (seed) {
    const { element, l, r, target } = seed
    const [a, b] = [terms[l].atoms[element], terms[r].atoms[element]]
    questions.push({
      title: 'El número mágico',
      prompt: `El ${describe(element)} está en ${terms[l].formula}, que tiene ${a}, y en ${terms[r].formula}, que tiene ${b}. ¿A cuántos átomos de ${element} conviene llegar en cada lado?`,
      ...numberOptions(target, [a * b, a + b, target * 2, target + 1]),
      hint: `Busca el número más pequeño que esté en la tabla del ${a} y también en la del ${b}. Se llama mínimo común múltiplo.`,
      explanation: `¡Sí, ${target}! Para llegar ahí: ${withCoefficient(terms[l].coefficient, terms[l].formula)} da ${terms[l].coefficient} × ${a} = ${target}, y ${withCoefficient(terms[r].coefficient, terms[r].formula)} da ${terms[r].coefficient} × ${b} = ${target}.`,
      reveal: [l, r],
    })
    known.add(l)
    known.add(r)
  }

  // 4) Cada coeficiente que falta sale de un elemento cuyas demás sustancias ya están resueltas
  const total = (element: string, left: boolean, except: number) =>
    terms.reduce((sum, term, index) => (term.left === left && index !== except && known.has(index) ? sum + term.coefficient * (term.atoms[element] ?? 0) : sum), 0)

  while (seed && known.size < terms.length) {
    const [next] = terms.flatMap((term, index) => (known.has(index) ? [] : Object.keys(term.atoms)
      .filter((element) => holders(element).every((holder) => holder === index || known.has(holder)))
      .map((element) => ({ index, element }))))
    if (!next) break
    const { index, element } = next
    const term = terms[index]
    const each = term.atoms[element]
    const goal = total(element, !term.left, index)
    const already = total(element, term.left, index)
    const missing = goal - already
    if (term.coefficient * each !== missing) break
    questions.push({
      title: `Ahora el ${element}`,
      prompt: `Mira arriba cuántos átomos de ${describe(element)} hay en cada lado. ¿Qué coeficiente necesita ${term.formula} para igualarlos?`,
      ...numberOptions(term.coefficient, [missing, term.coefficient + 1, term.coefficient - 1, term.coefficient * 2]),
      hint: `Del otro lado hay ${atomsOf(goal)} de ${element}${already ? ` y de este lado ya tienes ${already}, así que faltan ${missing}` : ''}. Cada ${term.formula} aporta ${each === 1 ? 'solo 1' : each}.`,
      explanation: `¡Muy bien! ${withCoefficient(term.coefficient, term.formula)} da ${term.coefficient} × ${each} = ${missing}${already ? `, que con los ${already} que ya había suman ${goal}` : ''}. Ya hay ${atomsOf(goal)} de ${element} en cada lado.${term.coefficient === 1 ? ' El 1 no se escribe.' : ''}`,
      reveal: [index],
    })
    known.add(index)
  }

  // 5) Ecuaciones enredadas (como las redox): los coeficientes que faltan se muestran y solo se comprueban
  const pending = terms.flatMap((_, index) => (known.has(index) ? [] : [index]))
  if (pending.length) {
    const element = elements[0]
    const amount = terms.reduce((sum, term) => (term.left ? sum + term.coefficient * (term.atoms[element] ?? 0) : sum), 0)
    questions.push({
      title: 'Un atajo',
      prompt: `Esta es de las difíciles: sus elementos están repartidos en varias sustancias, así que los coeficientes que faltan salen de resolver un sistema de ecuaciones. Ya te los puse arriba. Comprueba: ¿cuántos átomos de ${describe(element)} hay en cada lado?`,
      ...numberOptions(amount, [amount + 1, amount - 1, amount * 2, rawCount(element, true)]),
      hint: `Multiplica cada coeficiente por el subíndice del ${element} y suma todo lo de un mismo lado.`,
      explanation: `¡Correcto! Hay ${amount} de cada lado. Si haces lo mismo con los demás elementos, verás que todos cuadran.`,
      reveal: [],
      show: pending,
    })
  }

  return questions
}

const HEADING = /^(ecuaci[oó]n (original|balanceada)|paso \d+\b.*)$/i

// Separa la explicación de la IA en sus apartados: "Ecuación original", "Paso 1: …", "Ecuación balanceada"
export function splitExplanation(text: string): ExplanationSection[] {
  const sections: ExplanationSection[] = []
  for (const line of text.split('\n')) {
    const heading = line.trim().replace(/:$/, '')
    if (HEADING.test(heading)) sections.push({ title: heading, body: '' })
    else if (sections.length) sections[sections.length - 1].body += `${line}\n`
    else if (line.trim()) sections.push({ title: 'Explicación', body: `${line}\n` })
  }
  return sections.map((section) => ({ ...section, body: section.body.trim() })).filter((section) => section.body)
}

// La IA escribe O2 y ->; ChemText necesita O_2 y la flecha se ve mejor como →
export const toChemText = (text: string) => text.replace(/->/g, '→').replace(/([A-Z][a-z]?|\))(\d+)/g, '$1_$2')
