import React from 'react'

export function DivideOverlay({ midX, delta, showLegend = true }) {
  if (midX == null || !Number.isFinite(delta)) return null
  const left = Math.max(0, midX - delta)
  const right = Math.min(100, midX + delta)
  return (
    <>
      <svg className="pointer-events-none absolute inset-6 h-[calc(100%-48px)] w-[calc(100%-48px)]" viewBox="0 0 100 100" preserveAspectRatio="none">
        <rect x={left} y={0} width={Math.max(0, right - left)} height={100} fill="rgb(59 130 246 / 0.12)">
          <title>{`Strip: delta ≈ ${delta.toFixed(2)}`}</title>
        </rect>
        <line x1={midX} y1={0} x2={midX} y2={100} stroke="rgb(251 191 36)" strokeWidth={1} strokeDasharray="3 3">
          <title>{`Midline: x ≈ ${midX.toFixed(2)}`}</title>
        </line>
      </svg>
      {showLegend && (
        <div className="pointer-events-none absolute left-8 top-8 flex gap-2">
          <span className="rounded-full bg-slate-900/80 px-2 py-1 text-xs text-slate-200 ring-1 ring-white/10">
            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-amber-400 align-middle" />
            Midline x≈{midX.toFixed(2)}
          </span>
          <span className="rounded-full bg-slate-900/80 px-2 py-1 text-xs text-slate-200 ring-1 ring-white/10">
            <span className="mr-1 inline-block h-2 w-2 rounded-sm bg-blue-500/60 align-middle" />
            Strip Δ≈{delta.toFixed(2)}
          </span>
        </div>
      )}
    </>
  )
}

export function SweepOverlay({ sweepX, delta, showLegend = true }) {
  if (sweepX == null) return null
  const hasDelta = Number.isFinite(delta)
  const left = hasDelta ? Math.max(0, sweepX - delta) : null
  const right = hasDelta ? Math.min(100, sweepX) : null
  return (
    <>
      <svg className="pointer-events-none absolute inset-6 h-[calc(100%-48px)] w-[calc(100%-48px)]" viewBox="0 0 100 100" preserveAspectRatio="none">
        {hasDelta && (
          <>
            <rect x={left} y={0} width={Math.max(0, right - left)} height={100} fill="rgb(59 130 246 / 0.12)">
              <title>{`Active strip: Δ ≈ ${delta.toFixed(2)}`}</title>
            </rect>
            <line x1={left} y1={0} x2={left} y2={100} stroke="rgb(59 130 246)" strokeWidth={1} strokeDasharray="3 3">
              <title>{`Left boundary: x ≈ ${left.toFixed(2)}`}</title>
            </line>
          </>
        )}
        <line x1={sweepX} y1={0} x2={sweepX} y2={100} stroke="rgb(251 191 36)" strokeWidth={1.25}>
          <title>{`Sweep line: x ≈ ${sweepX.toFixed(2)}`}</title>
        </line>
      </svg>
      {showLegend && (
        <div className="pointer-events-none absolute left-8 top-8 flex gap-2">
          <span className="rounded-full bg-slate-900/80 px-2 py-1 text-xs text-slate-200 ring-1 ring-white/10">
            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-amber-400 align-middle" />
            Sweep x≈{sweepX.toFixed(2)}
          </span>
          {hasDelta && (
            <span className="rounded-full bg-slate-900/80 px-2 py-1 text-xs text-slate-200 ring-1 ring-white/10">
              <span className="mr-1 inline-block h-2 w-2 rounded-sm bg-blue-500/60 align-middle" />
              Active Δ≈{delta.toFixed(2)}
            </span>
          )}
        </div>
      )}
    </>
  )
}
