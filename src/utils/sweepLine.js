export function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

/**
 * Sweep Line Closest Pair (O(n log n))
 * @param {Array<{id?: string, x:number, y:number}>} points
 * @returns {{ pair: [any, any] | [], distance: number | null, comparisons: number }}
 */
export function sweepLineClosestPair(points) {
  if (!Array.isArray(points) || points.length < 2) {
    return { pair: [], distance: null, comparisons: 0 }
  }

  const pts = [...points].sort((a, b) => (a.x - b.x) || (a.y - b.y))
  const window = []
  const activeY = []

  let bestD = Infinity
  let bestPair = []
  let comps = 0

  const removeFromActiveY = (p) => {
    const idx = activeY.findIndex((q) => q === p)
    if (idx >= 0) activeY.splice(idx, 1)
  }
  const insertIntoActiveY = (p) => {
    let lo = 0, hi = activeY.length
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (activeY[mid].y <= p.y) lo = mid + 1
      else hi = mid
    }
    activeY.splice(lo, 0, p)
  }

  for (const p of pts) {
    while (window.length && (p.x - window[0].x) > bestD) {
      const old = window.shift()
      removeFromActiveY(old)
    }

    if (Number.isFinite(bestD)) {
      const yMin = p.y - bestD
      const yMax = p.y + bestD
      let i = 0
      if (activeY.length) {
        let lo = 0, hi = activeY.length
        while (lo < hi) {
          const mid = (lo + hi) >> 1
          if (activeY[mid].y < yMin) lo = mid + 1
          else hi = mid
        }
        i = lo
      }
      for (; i < activeY.length && activeY[i].y <= yMax; i++) {
        const q = activeY[i]
        comps++
        const d = distance(p, q)
        if (d < bestD) {
          bestD = d
          bestPair = [p, q]
        }
      }
    } else {
      for (const q of activeY) {
        comps++
        const d = distance(p, q)
        if (d < bestD) {
          bestD = d
          bestPair = [p, q]
        }
      }
    }

    window.push(p)
    insertIntoActiveY(p)
  }

  return { pair: bestPair, distance: bestD, comparisons: comps }
}

/**
 * Build sweep-line comparison order for visualization.
 * Each item contains sweepX and delta (bestD before comparing the pair).
 * @param {Array<{id?: string, x:number, y:number}>} points
 * @returns {{ a: any, b: any, d: number, sweepX: number, delta: number }[]}
 */
export function buildSweepComparisons(points) {
  const out = []
  if (!Array.isArray(points) || points.length < 2) return out

  const pts = [...points].sort((a, b) => (a.x - b.x) || (a.y - b.y))
  const window = []
  const activeY = []

  let bestD = Infinity

  const removeFromActiveY = (p) => {
    const idx = activeY.findIndex((q) => q === p)
    if (idx >= 0) activeY.splice(idx, 1)
  }
  const insertIntoActiveY = (p) => {
    let lo = 0, hi = activeY.length
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (activeY[mid].y <= p.y) lo = mid + 1
      else hi = mid
    }
    activeY.splice(lo, 0, p)
  }

  for (const p of pts) {
    while (window.length && (p.x - window[0].x) > bestD) {
      const old = window.shift()
      removeFromActiveY(old)
    }

    const sweepX = p.x
    if (Number.isFinite(bestD)) {
      const yMin = p.y - bestD
      const yMax = p.y + bestD
      let i = 0
      if (activeY.length) {
        let lo = 0, hi = activeY.length
        while (lo < hi) {
          const mid = (lo + hi) >> 1
          if (activeY[mid].y < yMin) lo = mid + 1
          else hi = mid
        }
        i = lo
      }
      for (; i < activeY.length && activeY[i].y <= yMax; i++) {
        const q = activeY[i]
        const d = distance(p, q)
        out.push({ a: p, b: q, d, sweepX, delta: bestD })
        if (d < bestD) bestD = d
      }
    } else {
      for (const q of activeY) {
        const d = distance(p, q)
        out.push({ a: p, b: q, d, sweepX, delta: bestD })
        if (d < bestD) bestD = d
      }
    }

    window.push(p)
    insertIntoActiveY(p)
  }

  return out
}
