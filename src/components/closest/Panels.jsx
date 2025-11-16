import React from 'react'

export function ControlsPanel({
  pointCount,
  setPointCount,
  algorithm,
  setAlgorithm,
  onRandomize,
  onClear,
  showLines,
  setShowLines,
  manualPoint,
  setManualPoint,
  onAddPoint,
}) {
  return (
    <div className="rounded-2xl bg-slate-900/70 p-6 ring-1 ring-white/5">
      <h2 className="text-lg font-semibold">Controls</h2>
      <form className="mt-4 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <label className="flex flex-col gap-2 text-sm text-slate-300">
          Random points count
          <input
            type="number"
            min="2"
            max="40"
            value={pointCount}
            onChange={(e) => setPointCount(e.target.value)}
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-400"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-300">
          Algorithm
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-400"
          >
            <option value="brute">Brute Force (O(n^2))</option>
            <option value="divide">Divide & Conquer (O(n log n))</option>
            <option value="sweep">Sweep Line (O(n log n))</option>
          </select>
        </label>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="flex-1 rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-400" onClick={onRandomize}>
            Randomize
          </button>
          <button type="button" className="rounded-lg border border-slate-600 px-4 py-2 font-semibold hover:border-slate-400" onClick={onClear}>
            Clear
          </button>
        </div>
      </form>

      <hr className="my-6 border-slate-800" />

      <form className="space-y-3" onSubmit={onAddPoint}>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Add point manually</p>
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="x (0-100)"
            value={manualPoint.x}
            onChange={(e) => setManualPoint((prev) => ({ ...prev, x: e.target.value }))}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-400"
          />
          <input
            type="number"
            placeholder="y (0-100)"
            value={manualPoint.y}
            onChange={(e) => setManualPoint((prev) => ({ ...prev, y: e.target.value }))}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-400"
          />
        </div>
        <button type="submit" className="w-full rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-900 hover:bg-cyan-400">
          Add point
        </button>
      </form>

      <label className="mt-6 flex items-center gap-2 text-sm text-slate-300">
        <input type="checkbox" checked={showLines} onChange={() => setShowLines((prev) => !prev)} className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-emerald-500 focus:ring-emerald-400" />
        Show connecting line
      </label>
    </div>
  )
}

export function PlaybackPanel({
  playing,
  setPlaying,
  stepIndex,
  stepsLength,
  onStepOnce,
  onRestart,
  speed,
  setSpeed,
  bestDistance,
  currentDistance,
  finalDistance,
  algorithmLabel,
}) {
  return (
    <div className="rounded-xl bg-slate-950/70 p-4 text-sm text-slate-300">
      <p className="font-semibold text-slate-200">Playback</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" className={`rounded-lg px-4 py-2 font-semibold ${playing ? 'bg-amber-400 text-slate-900' : 'bg-emerald-500 text-slate-900 hover:bg-emerald-400'}`} onClick={() => setPlaying((p) => !p)}>
          {playing ? 'Pause' : 'Play'}
        </button>
        <button type="button" className="rounded-lg border border-slate-600 px-4 py-2 font-semibold hover:border-slate-400" onClick={onStepOnce} disabled={stepIndex >= stepsLength}>
          Step
        </button>
        <button type="button" className="rounded-lg border border-slate-600 px-4 py-2 font-semibold hover:border-slate-400" onClick={onRestart}>
          Restart
        </button>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <label className="text-xs text-slate-400">Speed</label>
        <select className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs" value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
          <option value={200}>Fast</option>
          <option value={600}>Normal</option>
          <option value={1000}>Slow</option>
        </select>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <p>Checked: {Math.min(stepIndex, stepsLength)} / {stepsLength}</p>
        <p>Current distance: {currentDistance}</p>
        <p>Best so far: {bestDistance}</p>
        <p>Final ({algorithmLabel}): {finalDistance}</p>
      </div>
    </div>
  )
}

export function PointsPanel({ points, bestPair, brutePairsCount, comparisonsCount }) {
  return (
    <div className="grid gap-4 rounded-2xl bg-slate-900/70 p-6 ring-1 ring-white/5 lg:grid-cols-2">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Best So Far</h3>
        {bestPair.length === 2 ? (
          <ul className="mt-3 space-y-2 text-sm">
            {bestPair.map((point) => (
              <li key={point.id} className="rounded-md bg-slate-950/60 px-4 py-2">({point.x}, {point.y})</li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-slate-500">Add at least two points to see the result.</p>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">All Points</h3>
        {points.length ? (
          <ul className="mt-3 max-h-40 space-y-2 overflow-y-auto rounded-md bg-slate-950/40 p-2 text-sm">
            {points.map((point, idx) => (
              <li key={point.id} className={`flex items-center justify-between rounded-md px-3 py-1 ${bestPair.some((selected) => selected?.id === point.id) ? 'bg-emerald-500/20 text-emerald-200' : ''}`}>
                <span className="font-semibold text-slate-300">P{idx + 1}</span>
                <span>({point.x}, {point.y})</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-slate-500">No points available.</p>
        )}
      </div>

      <div className="lg:col-span-2 mt-2 grid grid-cols-3 gap-2 text-sm text-slate-300">
        <p>Total points: {points.length}</p>
        <p>Brute-force pairs: {brutePairsCount}</p>
        <p>Algorithm comparisons: {comparisonsCount ?? 0}</p>
      </div>
    </div>
  )
}
