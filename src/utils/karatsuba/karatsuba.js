import { addDec, subDec, shiftLeft10, splitAt, stripZeros } from './bigintStr'

function normalize(a, b) {
  a = stripZeros(String(a || '0'))
  b = stripZeros(String(b || '0'))
  const len = Math.max(a.length, b.length)
  const evenLen = len % 2 === 0 ? len : len + 1
  return [a.padStart(evenLen, '0'), b.padStart(evenLen, '0')]
}

export function karatsubaMultiply(a, b) {
  const [A, B] = normalize(a, b)
  const { product, mults, adds } = kMul(A, B)
  return { product: stripZeros(product), multiplications: mults, additions: adds }
}

function kMul(a, b) {
  a = stripZeros(a)
  b = stripZeros(b)
  if (a.length <= 1 && b.length <= 1) {
    const p = String((a.charCodeAt(0) - 48) * (b.charCodeAt(0) - 48))
    return { product: p, mults: 1, adds: 0 }
  }
  const n = Math.max(a.length, b.length)
  const m = Math.floor(n / 2)
  const [a1, a0] = splitAt(a.padStart(n, '0'), m)
  const [b1, b0] = splitAt(b.padStart(n, '0'), m)

  const z2 = kMul(a1, b1)
  const z0 = kMul(a0, b0)
  const a1a0 = addDec(a1, a0)
  const b1b0 = addDec(b1, b0)
  const z1 = kMul(a1a0, b1b0)
  const mid = subDec(subDec(z1.product, z2.product), z0.product)
  const prod = addDec(addDec(shiftLeft10(z2.product, 2 * m), shiftLeft10(mid, m)), z0.product)
  return { product: stripZeros(prod), mults: z2.mults + z0.mults + z1.mults, adds: z2.adds + z0.adds + z1.adds + 3 }
}

export function buildKaratsubaSteps(a, b) {
  const [A, B] = normalize(a, b)
  const steps = []
  function rec(aStr, bStr) {
    aStr = stripZeros(aStr)
    bStr = stripZeros(bStr)
    if (aStr.length <= 1 && bStr.length <= 1) {
      const val = String((aStr.charCodeAt(0) - 48) * (bStr.charCodeAt(0) - 48))
      steps.push({ type: 'base', a: aStr, b: bStr, val })
      return val
    }
    const n = Math.max(aStr.length, bStr.length)
    const m = Math.floor(n / 2)
    const [a1, a0] = splitAt(aStr.padStart(n, '0'), m)
    const [b1, b0] = splitAt(bStr.padStart(n, '0'), m)
    steps.push({ type: 'split', a1, a0, b1, b0, m })

    const z2 = rec(a1, b1)
    const z0 = rec(a0, b0)
    const z1 = rec(addDec(a1, a0), addDec(b1, b0))
    const mid = subDec(subDec(z1, z2), z0)
    const prod = addDec(addDec(shiftLeft10(z2, 2 * m), shiftLeft10(mid, m)), z0)
    steps.push({ type: 'combine', z2, z0, z1, m, mid, prod })
    return prod
  }
  const product = stripZeros(rec(A, B))
  return { steps, product }
}

export function buildKaratsubaTreeAndSteps(a, b) {
  const [A, B] = normalize(a, b)
  const steps = []
  let idSeq = 0
  function rec(aStr, bStr, depth) {
    const node = { id: `n${++idSeq}`, data: { a: stripZeros(aStr), b: stripZeros(bStr) }, children: [], depth }
    aStr = stripZeros(aStr); bStr = stripZeros(bStr)
    if (aStr.length <= 1 && bStr.length <= 1) {
      const val = String((aStr.charCodeAt(0) - 48) * (bStr.charCodeAt(0) - 48))
      node.data.type = 'base'
      node.data.prod = val
      steps.push({ type: 'base', nodeId: node.id, a: aStr, b: bStr, val })
      return { node, product: val }
    }
    const n = Math.max(aStr.length, bStr.length)
    const m = Math.floor(n / 2)
    const [a1, a0] = splitAt(aStr.padStart(n, '0'), m)
    const [b1, b0] = splitAt(bStr.padStart(n, '0'), m)
    steps.push({ type: 'split', nodeId: node.id, a1, a0, b1, b0, m })
    const z2 = rec(a1, b1, depth + 1)
    const z0 = rec(a0, b0, depth + 1)
    const z1 = rec(addDec(a1, a0), addDec(b1, b0), depth + 1)
    node.children = [z2.node, z0.node, z1.node]
    const mid = subDec(subDec(z1.product, z2.product), z0.product)
    const prod = addDec(addDec(shiftLeft10(z2.product, 2 * m), shiftLeft10(mid, m)), z0.product)
    node.data.prod = prod
    steps.push({ type: 'combine', nodeId: node.id, z2: z2.product, z0: z0.product, z1: z1.product, m, mid, prod })
    return { node, product: prod }
  }
  const { node, product } = rec(A, B, 0)
  return { root: node, steps, product: stripZeros(product) }
}
