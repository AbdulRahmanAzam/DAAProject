export function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

/**
 * Divide and Conquer Closest Pair (O(n log n))
 * @param {Array<{id?: string, x:number, y:number}>} points
 * @returns {{ pair: [any, any] | [], distance: number | null, comparisons: number }}
 */
export function divideAndConquerClosestPair(points) {
  if (!Array.isArray(points) || points.length < 2) {
    return { pair: [], distance: null, comparisons: 0 }
  }

  const ptsByX = [...points].sort((p, q) => (p.x - q.x) || (p.y - q.y))
  const ptsByY = [...points].sort((p, q) => (p.y - q.y) || (p.x - q.x))

  function mergeByY(left, right) {
    const res = []
    let i = 0, j = 0
    while (i < left.length && j < right.length) {
      if (left[i].y <= right[j].y) res.push(left[i++])
      else res.push(right[j++])
    }
    while (i < left.length) res.push(left[i++])
    while (j < right.length) res.push(right[j++])
    return res
  }

  function rec(px, py) {
    const n = px.length
    if (n <= 3) {
      let bestD = Infinity
      let bestPair = []
      let comps = 0
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          comps++
          const d = distance(px[i], px[j])
          if (d < bestD) {
            bestD = d
            bestPair = [px[i], px[j]]
          }
        }
      }
      return { pair: bestPair, distance: bestD, comparisons: comps, sortedY: py }
    }

    const mid = Math.floor(n / 2)
    const midX = px[mid].x
    const leftX = px.slice(0, mid)
    const rightX = px.slice(mid)
    const leftSet = new Set(leftX)

    const leftY = []
    const rightY = []
    for (const p of py) {
      if (leftSet.has(p)) leftY.push(p)
      else rightY.push(p)
    }

    const L = rec(leftX, leftY)
    const R = rec(rightX, rightY)

    let best = L.distance <= R.distance ? L : R
    let comps = L.comparisons + R.comparisons

    const delta = best.distance
    const strip = []
    for (const p of py) {
      if (Math.abs(p.x - midX) <= delta) strip.push(p)
    }

    for (let i = 0; i < strip.length; i++) {
      for (let j = i + 1; j < strip.length && (strip[j].y - strip[i].y) <= delta; j++) {
        comps++
        const d = distance(strip[i], strip[j])
        if (d < best.distance) {
          best = {
            pair: [strip[i], strip[j]],
            distance: d,
            comparisons: best.comparisons,
            sortedY: best.sortedY,
          }
        }
      }
    }

    return { pair: best.pair, distance: best.distance, comparisons: comps, sortedY: mergeByY(leftY, rightY) }
  }

  const res = rec(ptsByX, ptsByY)
  return { pair: res.pair, distance: res.distance, comparisons: res.comparisons }
}

/**
 * Build the ordered list of comparisons performed by the divide & conquer algorithm.
 * Mirrors divideAndConquerClosestPair logic but records each distance check in sequence.
 * @param {Array<{id?: string, x:number, y:number}>} points
 * @returns {{ a: any, b: any, d: number }[]}
 */
export function buildDivideComparisons(points) {
  if (!Array.isArray(points) || points.length < 2) return []
  const ptsByX = [...points].sort((p, q) => (p.x - q.x) || (p.y - q.y))
  const ptsByY = [...points].sort((p, q) => (p.y - q.y) || (p.x - q.x))

  function mergeByY(left, right) {
    const res = []
    let i = 0, j = 0
    while (i < left.length && j < right.length) {
      if (left[i].y <= right[j].y) res.push(left[i++])
      else res.push(right[j++])
    }
    while (i < left.length) res.push(left[i++])
    while (j < right.length) res.push(right[j++])
    return res
  }

  const steps = []

  function rec(px, py) {
    const n = px.length
    if (n <= 3) {
      let bestD = Infinity
      let bestPair = []
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const d = distance(px[i], px[j])
          steps.push({ a: px[i], b: px[j], d })
          if (d < bestD) {
            bestD = d
            bestPair = [px[i], px[j]]
          }
        }
      }
      return { pair: bestPair, distance: bestD, sortedY: py }
    }

    const mid = Math.floor(n / 2)
    const midX = px[mid].x
    const leftX = px.slice(0, mid)
    const rightX = px.slice(mid)
    const leftSet = new Set(leftX)

    const leftY = []
    const rightY = []
    for (const p of py) {
      if (leftSet.has(p)) leftY.push(p)
      else rightY.push(p)
    }

    const L = rec(leftX, leftY)
    const R = rec(rightX, rightY)

    let best = L.distance <= R.distance ? L : R
    const delta = best.distance

    const strip = []
    for (const p of py) {
      if (Math.abs(p.x - midX) <= delta) strip.push(p)
    }

    for (let i = 0; i < strip.length; i++) {
      for (let j = i + 1; j < strip.length && (strip[j].y - strip[i].y) <= delta; j++) {
        const d = distance(strip[i], strip[j])
        steps.push({ a: strip[i], b: strip[j], d })
        if (d < best.distance) {
          best = { pair: [strip[i], strip[j]], distance: d, sortedY: best.sortedY }
        }
      }
    }

    return { pair: best.pair, distance: best.distance, sortedY: mergeByY(leftY, rightY) }
  }

  rec(ptsByX, ptsByY)
  return steps
}
