export function stripZeros(s) {
  s = String(s || '0').replace(/\D/g, '') || '0'
  return s.replace(/^0+(?!$)/, '')
}

export function cmp(a, b) {
  a = stripZeros(a)
  b = stripZeros(b)
  if (a.length !== b.length) return a.length < b.length ? -1 : 1
  if (a === b) return 0
  return a < b ? -1 : 1
}

export function addDec(a, b) {
  a = stripZeros(a)
  b = stripZeros(b)
  let i = a.length - 1,
    j = b.length - 1,
    carry = 0,
    out = ''
  while (i >= 0 || j >= 0 || carry) {
    const da = i >= 0 ? a.charCodeAt(i) - 48 : 0
    const db = j >= 0 ? b.charCodeAt(j) - 48 : 0
    const s = da + db + carry
    out = String(s % 10) + out
    carry = (s / 10) | 0
    i--
    j--
  }
  return stripZeros(out)
}

// Assumes a >= b
export function subDec(a, b) {
  a = stripZeros(a)
  b = stripZeros(b)
  if (cmp(a, b) < 0) throw new Error('subDec requires a >= b')
  let i = a.length - 1,
    j = b.length - 1,
    borrow = 0,
    out = ''
  while (i >= 0) {
    let da = a.charCodeAt(i) - 48
    const db = j >= 0 ? b.charCodeAt(j) - 48 : 0
    da -= borrow
    if (da < db) {
      da += 10
      borrow = 1
    } else borrow = 0
    const d = da - db
    out = String(d) + out
    i--
    j--
  }
  return stripZeros(out)
}

export function shiftLeft10(a, k) {
  a = stripZeros(a)
  if (a === '0') return '0'
  return a + '0'.repeat(k)
}

export function splitAt(a, m) {
  // Split into high|low with low having m digits
  a = stripZeros(a)
  const k = Math.max(0, a.length - m)
  return [stripZeros(a.slice(0, k)), stripZeros(a.slice(k))]
}
