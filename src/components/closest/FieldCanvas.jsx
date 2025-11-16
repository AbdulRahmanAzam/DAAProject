import React from 'react'
import { DivideOverlay, SweepOverlay } from './Overlays'

export default function FieldCanvas({
  algorithm,
  showLines,
  points,
  steps,
  stepIndex,
  best,
  midX,
  finalDistance,
  sweepOverlay,
}) {
  const canvasPoints = points.map((point) => ({
    ...point,
    left: `${point.x}%`,
    top: `${100 - point.y}%`,
    isBest: best.pair.some((selected) => selected?.id === point.id),
    isCurrent:
      stepIndex > 0 && stepIndex <= steps.length
        ? [steps[stepIndex - 1]?.a?.id, steps[stepIndex - 1]?.b?.id].includes(point.id)
        : false,
  }))

  return (
    <div className="relative h-[420px] rounded-2xl bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 p-6 ring-1 ring-white/5">
      <div className="absolute inset-6 border border-dashed border-slate-700" />

      {algorithm === 'divide' && Number.isFinite(finalDistance) && midX != null && (
        <DivideOverlay midX={midX} delta={finalDistance} />
      )}

      {algorithm === 'sweep' && sweepOverlay && (
        <SweepOverlay sweepX={sweepOverlay.sweepX} delta={sweepOverlay.delta} />
      )}

      {showLines && stepIndex > 0 && stepIndex <= steps.length && (
        <svg className="pointer-events-none absolute inset-6 h-[calc(100%-48px)] w-[calc(100%-48px)]" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line
            x1={steps[stepIndex - 1].a.x}
            y1={100 - steps[stepIndex - 1].a.y}
            x2={steps[stepIndex - 1].b.x}
            y2={100 - steps[stepIndex - 1].b.y}
            stroke="rgb(34 211 238)"
            strokeWidth={1.25}
            strokeDasharray="4 4"
          />
        </svg>
      )}

      {showLines && best.pair.length === 2 && (
        <svg className="pointer-events-none absolute inset-6 h-[calc(100%-48px)] w-[calc(100%-48px)]" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line
            x1={best.pair[0].x}
            y1={100 - best.pair[0].y}
            x2={best.pair[1].x}
            y2={100 - best.pair[1].y}
            stroke="rgb(52 211 153)"
            strokeWidth={1.75}
          />
        </svg>
      )}

      <div className="relative h-full w-full">
        {canvasPoints.map((point) => (
          <div
            key={point.id}
            className={`absolute flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[10px] font-bold ${point.isBest ? 'bg-emerald-400 text-slate-900 ring-2 ring-emerald-200' : point.isCurrent ? 'bg-slate-200 text-slate-900 ring-2 ring-cyan-400' : 'bg-slate-200 text-slate-900'}`}
            style={{ left: point.left, top: point.top }}
          />
        ))}
      </div>
    </div>
  )
}
