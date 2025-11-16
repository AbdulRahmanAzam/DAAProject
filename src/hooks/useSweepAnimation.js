import { useEffect, useMemo, useRef, useState } from 'react'

export function useSweepAnimation({ algorithm, steps, playing, stepIndex, speed, points }) {
  const [sweepXAnim, setSweepXAnim] = useState(null)
  const rafIdRef = useRef(null)

  const { minX, maxX } = useMemo(() => {
    if (!points?.length) return { minX: 0, maxX: 100 }
    let min = 100, max = 0
    for (const p of points) {
      if (p.x < min) min = p.x
      if (p.x > max) max = p.x
    }
    return { minX: min, maxX: max }
  }, [points])

  useEffect(() => {
    if (algorithm !== 'sweep') return
    if (playing) return
    if (stepIndex === 0) {
      setSweepXAnim(minX)
      return
    }
    const idx = Math.max(0, Math.min(stepIndex - 1, steps.length - 1))
    const sx = steps[idx]?.sweepX
    setSweepXAnim(sx != null ? sx : minX)
  }, [algorithm, playing, stepIndex, steps, minX])

  useEffect(() => {
    if (algorithm !== 'sweep') return () => {}
    if (!playing) return () => { if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current) }
    if (stepIndex >= steps.length) return () => { if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current) }

    const fromX = stepIndex > 0 && steps[stepIndex - 1]?.sweepX != null ? steps[stepIndex - 1].sweepX : minX
    const toX = steps[stepIndex]?.sweepX != null ? steps[stepIndex].sweepX : maxX
    let startTime = null
    const duration = Math.max(50, Number(speed) || 600)

    const tick = (ts) => {
      if (startTime == null) startTime = ts
      const elapsed = ts - startTime
      const t = Math.min(1, elapsed / duration)
      const curr = fromX + (toX - fromX) * t
      setSweepXAnim(curr)
      if (t < 1 && playing) {
        rafIdRef.current = requestAnimationFrame(tick)
      }
    }
    rafIdRef.current = requestAnimationFrame(tick)
    return () => { if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current) }
  }, [algorithm, playing, stepIndex, steps, minX, maxX, speed])

  const sweepOverlay = useMemo(() => {
    if (algorithm !== 'sweep' || steps.length === 0) return null
    let sweepX = sweepXAnim
    if (sweepX == null) {
      if (stepIndex > 0 && steps[stepIndex - 1]?.sweepX != null) {
        sweepX = steps[stepIndex - 1].sweepX
      } else {
        sweepX = minX
      }
    }
    return { sweepX }
  }, [algorithm, steps, stepIndex, sweepXAnim, minX])

  return { sweepOverlay, sweepXAnim, setSweepXAnim, minX, maxX }
}
