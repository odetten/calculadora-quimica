export type LessonState = 'aprobada' | 'disponible' | 'bloqueada'

export type LessonSummary = {
  numero: number
  titulo: string
  resumen: string
  estado: LessonState
  mejor_puntaje: number | null
}

export type CourseLessons = {
  curso: string
  titulo: string
  nivel: string
  aprobado_minimo: number
  lecciones: LessonSummary[]
}

export type TheorySection = {
  titulo: string
  parrafos?: string[]
  puntos?: string[]
  tabla?: { columnas: string[]; filas: string[][] }
  ejemplo?: string
  tip: string
  emoji?: string
  actividad?: Activity
}

export type Activity =
  | { tipo: 'clasificar'; instruccion: string; grupos: { nombre: string; emoji?: string }[]; elementos: { texto: string; emoji?: string; grupo: string }[] }
  | { tipo: 'verdadero_falso'; instruccion: string; afirmaciones: { texto: string; respuesta: boolean; explicacion: string }[] }
  | { tipo: 'descubre'; instruccion: string; tarjetas: { emoji?: string; frente: string; reverso: string }[] }
  | { tipo: 'construye'; instruccion: string; atomos: string[]; moleculas: { formula: string; nombre: string }[] }
  | { tipo: 'balanza'; instruccion: string; ecuaciones: { ecuacion: string; respuesta: number[] }[] }

export type WorkedExample = {
  titulo: string
  enunciado: string
  datos?: string[]
  pasos: { texto: string; detalle: string }[]
  resultado: string
  tip: string
}

export type ExamQuestion =
  | { tipo: 'opcion'; pregunta: string; pista: string; opciones: string[] }
  | { tipo: 'numero'; pregunta: string; pista: string; unidad?: string }
  | { tipo: 'coeficientes'; pregunta: string; pista: string; ecuacion: string }

export type Lesson = {
  numero: number
  total: number
  nivel: string
  titulo: string
  resumen: string
  teoria: TheorySection[]
  ejemplos: WorkedExample[]
  examen: ExamQuestion[]
  aprobado_minimo: number
  aprobada: boolean
  mejor_puntaje: number | null
}

export type ExamResult = {
  puntaje: number
  aciertos: number
  total: number
  aprobado: boolean
  aprobado_minimo: number
  intentos: number
  siguiente_desbloqueada: boolean
  resultados: { correcto: boolean; respuesta?: string | number | number[]; explicacion?: string }[]
}

/** 'A + B -> C' → { reactivos: ['A', 'B'], productos: ['C'] } */
export function splitEquation(equation: string) {
  const [left, right] = equation.split('->')
  const species = (side: string) => side.split(' + ').map((item) => item.trim())
  return { reactivos: species(left), productos: species(right) }
}

/** Átomos de una fórmula: 'Ca(OH)_2' → { Ca: 1, O: 2, H: 2 } */
export function parseFormula(formula: string): Record<string, number> {
  const text = formula.replace(/_/g, '')
  let index = 0
  const parse = (): Record<string, number> => {
    const counts: Record<string, number> = {}
    const add = (element: string, amount: number) => { counts[element] = (counts[element] ?? 0) + amount }
    while (index < text.length) {
      if (text[index] === '(') {
        index += 1
        const inner = parse()
        const digits = /^\d+/.exec(text.slice(index))?.[0] ?? ''
        index += digits.length
        for (const [element, amount] of Object.entries(inner)) add(element, amount * (Number(digits) || 1))
      } else if (text[index] === ')') {
        index += 1
        return counts
      } else {
        const match = /^([A-Z][a-z]?)(\d*)/.exec(text.slice(index))
        if (!match) { index += 1; continue }
        add(match[1], Number(match[2]) || 1)
        index += match[0].length
      }
    }
    return counts
  }
  return parse()
}
