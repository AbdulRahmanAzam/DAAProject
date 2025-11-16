
export function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

/**
 * Build the full list of pairwise comparisons for visualization.
 * @param {Array<{id?: string, x:number, y:number}>} points
 * @returns {{ a: any, b: any, d: number }[]}
 */
export function buildComparisons(points) {
  const list = []
  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const a = points[i]
      const b = points[j]
      list.push({ a, b, d: distance(a, b) })
    }
  }
  return list
}

/**
 * Brute-force closest pair across all points.
 * @param {Array<{id?: string, x:number, y:number}>} points
 * @returns {{ pair: [any, any] | [], distance: number | null, comparisons: number }}
 */
export function bruteForceClosestPair(points) {
  if (!Array.isArray(points) || points.length < 2) {
    return { pair: [], distance: null, comparisons: 0 }
  }

  let minPair = [points[0], points[1]]
  let minDist = distance(points[0], points[1])
  let comparisons = 0

  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      comparisons += 1
      const d = distance(points[i], points[j])
      if (d < minDist) {
        minDist = d
        minPair = [points[i], points[j]]
      }
    }
  }

  return { pair: minPair, distance: minDist, comparisons }
}
