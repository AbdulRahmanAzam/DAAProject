export const DEFAULT_POINT_COUNT = 8

export function randomPoints(count) {
  const n = Number(count) || DEFAULT_POINT_COUNT
  return Array.from({ length: n }, (_, idx) => ({
    id: (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${idx}`),
    x: Math.round(Math.random() * 100),
    y: Math.round(Math.random() * 100),
  }))
}
