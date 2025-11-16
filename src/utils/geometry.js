/**
 * Geometry helpers
 * @typedef {{ id?: string, x: number, y: number }} Point
 */

/**
 * Euclidean distance between two points.
 * @param {Point} a
 * @param {Point} b
 */
export function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}
