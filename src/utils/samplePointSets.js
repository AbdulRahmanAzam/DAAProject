// Deterministic sample point sets (>100 points each) using LCG
function makePRNG(seed) {
  let s = seed >>> 0
  return () => {
    // LCG constants
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff
  }
}

function buildSet(seed, count = 105) {
  const rand = makePRNG(seed)
  const points = []
  for (let i = 0; i < count; i++) {
    const x = Math.round(rand() * 10000) / 100 // two decimals 0-100
    const y = Math.round(rand() * 10000) / 100
    points.push({ id: `${seed}-${i}`, x, y })
  }
  return points
}

const seeds = [123, 456, 789, 101112, 202122, 314159, 271828, 1618033, 907856, 424242]

export const SAMPLE_POINT_SETS = seeds.map((seed, idx) => ({
  id: `set-${idx + 1}`,
  name: `Sample Set ${idx + 1}`,
  points: buildSet(seed),
}))
