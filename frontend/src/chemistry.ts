type Fraction = {
  numerator: number
  denominator: number
}

type ParsedEquation = {
  reactants: string[]
  products: string[]
}

const subscriptDigits: Record<string, string> = {
  '₀': '0',
  '₁': '1',
  '₂': '2',
  '₃': '3',
  '₄': '4',
  '₅': '5',
  '₆': '6',
  '₇': '7',
  '₈': '8',
  '₉': '9',
}

const gcd = (first: number, second: number): number => {
  let left = Math.abs(first)
  let right = Math.abs(second)
  while (right) {
    const remainder = left % right
    left = right
    right = remainder
  }
  return left || 1
}

const lcm = (first: number, second: number) => Math.abs(first * second) / gcd(first, second)

const fraction = (numerator: number, denominator = 1): Fraction => {
  if (denominator === 0) throw new Error('No se pudo resolver la ecuacion.')
  const sign = denominator < 0 ? -1 : 1
  const divisor = gcd(numerator, denominator)
  return { numerator: sign * numerator / divisor, denominator: sign * denominator / divisor }
}

const add = (left: Fraction, right: Fraction) => fraction(left.numerator * right.denominator + right.numerator * left.denominator, left.denominator * right.denominator)
const multiply = (left: Fraction, right: Fraction) => fraction(left.numerator * right.numerator, left.denominator * right.denominator)
const negate = (value: Fraction) => fraction(-value.numerator, value.denominator)
const divide = (left: Fraction, right: Fraction) => multiply(left, fraction(right.denominator, right.numerator))
const isZero = (value: Fraction) => value.numerator === 0

const normalizeFormula = (formula: string) => formula
  .replace(/_/g, '')
  .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (digit) => subscriptDigits[digit])

const formatFormulaForDisplay = (formula: string) => formula.replace(/([A-Za-z\)])(\d+)/g, '$1_$2')
const removeLeadingCoefficient = (compound: string) => compound.replace(/^\d+(?:\.\d+)?/, '')

const parseCompound = (compound: string): Record<string, number> => {
  const normalized = normalizeFormula(compound.trim())
  const formula = removeLeadingCoefficient(normalized)
  if (!formula || /^\d/.test(formula)) throw new Error(`Formula no reconocida: ${compound}`)
  const elements: Record<string, number> = {}
  const pattern = /([A-Z][a-z]?)(\d*)/g
  let position = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(formula)) !== null) {
    if (match.index !== position) throw new Error(`Formula no reconocida: ${compound}`)
    const element = match[1]
    const count = match[2] ? Number(match[2]) : 1
    if (!count) throw new Error(`Formula no reconocida: ${compound}`)
    elements[element] = (elements[element] || 0) + count
    position = pattern.lastIndex
  }

  if (!position || position !== formula.length) throw new Error(`Formula no reconocida: ${compound}`)
  return elements
}

const parseEquation = (equation: string): ParsedEquation => {
  const normalized = equation.replace(/\s/g, '').replace(/-->/g, '->').replace(/→/g, '->')
  const sides = normalized.split('->')
  if (sides.length !== 2 || !sides[0] || !sides[1]) {
    throw new Error("Usa una flecha para separar reactivos y productos.")
  }

  const splitCompounds = (side: string) => side.split('+').filter(Boolean)
  const reactants = splitCompounds(sides[0])
  const products = splitCompounds(sides[1])
  if (!reactants.length || !products.length) throw new Error('Escribe al menos un compuesto en cada lado.')
  return { reactants, products }
}

const findNullSpaceVector = (matrix: Fraction[][]): Fraction[] => {
  const rows = matrix.length
  const columns = matrix[0]?.length || 0
  const reduced = matrix.map((row) => row.map((value) => fraction(value.numerator, value.denominator)))
  const pivotColumns: number[] = []
  let pivotRow = 0

  for (let column = 0; column < columns && pivotRow < rows; column += 1) {
    let selectedRow = pivotRow
    while (selectedRow < rows && isZero(reduced[selectedRow][column])) selectedRow += 1
    if (selectedRow === rows) continue

    ;[reduced[pivotRow], reduced[selectedRow]] = [reduced[selectedRow], reduced[pivotRow]]
    const pivot = reduced[pivotRow][column]
    reduced[pivotRow] = reduced[pivotRow].map((value) => divide(value, pivot))

    for (let row = 0; row < rows; row += 1) {
      if (row === pivotRow || isZero(reduced[row][column])) continue
      const factor = reduced[row][column]
      reduced[row] = reduced[row].map((value, index) => add(value, negate(multiply(factor, reduced[pivotRow][index]))))
    }

    pivotColumns.push(column)
    pivotRow += 1
  }

  const freeColumn = Array.from({ length: columns }, (_, index) => index).find((column) => !pivotColumns.includes(column))
  if (freeColumn === undefined) throw new Error('La ecuacion no tiene una solucion de balanceo.')

  const solution = Array.from({ length: columns }, () => fraction(0))
  solution[freeColumn] = fraction(1)
  pivotColumns.forEach((column, row) => {
    solution[column] = negate(reduced[row][freeColumn])
  })
  return solution
}

export const balanceEquation = (equation: string) => {
  const { reactants, products } = parseEquation(equation)
  const compounds = [...reactants, ...products]
  const compositions = compounds.map(parseCompound)
  const elements = [...new Set(compositions.flatMap((composition) => Object.keys(composition)))]
  const matrix = elements.map((element) => compositions.map((composition, compoundIndex) => {
    const amount = composition[element] || 0
    return fraction(compoundIndex < reactants.length ? amount : -amount)
  }))
  const solution = findNullSpaceVector(matrix)
  const commonDenominator = solution.reduce((current, value) => lcm(current, value.denominator), 1)
  let coefficients = solution.map((value) => value.numerator * commonDenominator / value.denominator)
  const commonFactor = coefficients.reduce((current, value) => gcd(current, value), 0)
  coefficients = coefficients.map((value) => value / commonFactor)

  if (coefficients.some((value) => value <= 0)) {
    coefficients = coefficients.map((value) => -value)
  }
  if (coefficients.some((value) => !Number.isInteger(value) || value <= 0)) {
    throw new Error('No se encontro un balanceo positivo para esta ecuacion.')
  }

  const formatSide = (side: string[], offset: number) => side.map((compound, index) => {
    const coefficient = coefficients[offset + index]
    const formula = removeLeadingCoefficient(compound)
    return `${coefficient === 1 ? '' : coefficient}${formatFormulaForDisplay(formula)}`
  }).join(' + ')

  return `${formatSide(reactants, 0)} → ${formatSide(products, reactants.length)}`
}