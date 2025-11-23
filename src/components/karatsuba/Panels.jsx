import React from 'react'

export function KaratsubaControls({ a, b, setA, setB, digits, setDigits, algorithm, setAlgorithm, visualizationType, setVisualizationType, onRandomize, onClear, sampleInputs = [], onSelectSample }) {
  return (
    <div className="rounded-2xl bg-slate-900/70 p-6 ring-1 ring-white/5">
      <h2 className="text-lg font-semibold">Controls</h2>
      <div className="mt-4 space-y-4">
        <label className="flex flex-col gap-2 text-sm text-slate-300">
          Number A
          <input value={a} onChange={(e) => setA(e.target.value.replace(/\D/g,''))} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-400" />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-300">
          Number B
          <input value={b} onChange={(e) => setB(e.target.value.replace(/\D/g,''))} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-400" />
        </label>
        {sampleInputs.length > 0 && (
          <label className="flex flex-col gap-2 text-sm text-slate-300">
            Sample input pair
            <select
              defaultValue=""
              onChange={(e) => {
                const id = e.target.value
                if (!id) return
                const sel = sampleInputs.find(s => s.id === id)
                if (!sel) return
                setA(sel.a)
                setB(sel.b)
                onSelectSample && onSelectSample(sel)
              }}
              className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-400"
            >
              <option value="">-- choose 100+ digit pair --</option>
              {sampleInputs.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </label>
        )}
        <label className="flex flex-col gap-2 text-sm text-slate-300">
          Random digits
          <input type="number" min="1" max="16" value={digits} onChange={(e)=>setDigits(e.target.value)} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-400" />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-300">
          Algorithm
          <select value={algorithm} onChange={(e)=>setAlgorithm(e.target.value)} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-400">
            <option value="grade">Grade School (O(n^2))</option>
            <option value="karatsuba">Karatsuba (O(n^1.585))</option>
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-300">
          View
          <select value={visualizationType} onChange={(e)=>setVisualizationType(e.target.value)} disabled={algorithm !== 'karatsuba'} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-400">
            <option value="dry-run">Dry Run</option>
            <option value="graph">Graph</option>
          </select>
        </label>
        <div className="flex gap-3">
          <button type="button" className="flex-1 rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-400" onClick={onRandomize}>Randomize</button>
          <button type="button" className="rounded-lg border border-slate-600 px-4 py-2 font-semibold hover:border-slate-400" onClick={onClear}>Clear</button>
        </div>
      </div>
    </div>
  )
}

export function KaratsubaPlayback({ playing, setPlaying, stepIndex, stepsLength, onStepOnce, onRestart, speed, setSpeed, product }) {
  return (
    <div className="rounded-xl bg-slate-950/70 p-4 text-sm text-slate-300">
      <p className="font-semibold text-slate-200">Playback</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" className={`rounded-lg px-4 py-2 font-semibold ${playing ? 'bg-amber-400 text-slate-900' : 'bg-emerald-500 text-slate-900 hover:bg-emerald-400'}`} onClick={() => setPlaying((p) => !p)}>
          {playing ? 'Pause' : 'Play'}
        </button>
        <button type="button" className="rounded-lg border border-slate-600 px-4 py-2 font-semibold hover:border-slate-400" onClick={onStepOnce} disabled={stepIndex >= stepsLength}>Step</button>
        <button type="button" className="rounded-lg border border-slate-600 px-4 py-2 font-semibold hover:border-slate-400" onClick={onRestart}>Restart</button>
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
        <p>Step: {Math.min(stepIndex, stepsLength)} / {stepsLength}</p>
        <p>Product: {product || 'N/A'}</p>
      </div>
    </div>
  )
}
