import { stripZeros } from './bigintStr'

export function multiplyGradeSchool(a, b) {
  a = stripZeros(String(a || '0'))
  b = stripZeros(String(b || '0'))
  if (a === '0' || b === '0') return { product: '0', multiplications: 0, additions: 0 }
  const m = a.length,
    n = b.length
  const res = Array(m + n).fill(0)
  let mults = 0,
    adds = 0
  for (let i = m - 1; i >= 0; i--) {
    const da = a.charCodeAt(i) - 48
    let carry = 0
    for (let j = n - 1; j >= 0; j--) {
      const db = b.charCodeAt(j) - 48
      const idx = i + j + 1
      const s = da * db + res[idx] + carry
      mults++
      carry = (s / 10) | 0
      res[idx] = s % 10
      adds++
    }
    res[i] += carry
    if (carry) adds++
  }
  const product = res.join('').replace(/^0+(?!$)/, '')
  return { product, multiplications: mults, additions: adds }
}

export function buildGradeSteps(a, b) {
  a = stripZeros(String(a || '0'))
  b = stripZeros(String(b || '0'))
  const steps = []
  if (a === '0' || b === '0') return { steps, product: '0' }
  const m = a.length,
    n = b.length
  const res = Array(m + n).fill(0)

  for (let i = m - 1; i >= 0; i--) {
    const da = a.charCodeAt(i) - 48
    let carry = 0
    for (let j = n - 1; j >= 0; j--) {
      const db = b.charCodeAt(j) - 48
      const idx = i + j + 1
      const partial = da * db
      steps.push({ type: 'digit-mul', i, j, da, db, partial })

      const s = partial + res[idx] + carry
      const newDigit = s % 10
      const newCarry = (s / 10) | 0
      steps.push({ type: 'accumulate', idx, carry, prev: res[idx], add: partial, newDigit, newCarry })

      res[idx] = newDigit
      carry = newCarry
    }
    if (carry) {
      steps.push({ type: 'carry-prop', idx: i, carry, prev: res[i], sum: res[i] + carry })
      res[i] += carry
    }
  }
  const product = res.join('').replace(/^0+(?!$)/, '')
  steps.push({ type: 'result', product })
  return { steps, product }
}
