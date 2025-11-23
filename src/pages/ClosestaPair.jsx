import { useCallback, useEffect, useMemo, useState } from 'react'
import { buildComparisons, bruteForceClosestPair } from '../utils/bruteForce'
import { divideAndConquerClosestPair, buildDivideComparisons } from '../utils/divideAndConquer'
import { buildSweepComparisons, sweepLineClosestPair } from '../utils/sweepLine'
import { DEFAULT_POINT_COUNT, randomPoints } from '../utils/points'
import FieldCanvas from '../components/closest/FieldCanvas'
import { ControlsPanel, PlaybackPanel, PointsPanel } from '../components/closest/Panels'
import { SAMPLE_POINT_SETS } from '../utils/samplePointSets'
import { useSweepAnimation } from '../hooks/useSweepAnimation'

function ClosestaPair() {
  const [points, setPoints] = useState(() => randomPoints(DEFAULT_POINT_COUNT))
  const [pointCount, setPointCount] = useState(DEFAULT_POINT_COUNT)
  const [manualPoint, setManualPoint] = useState({ x: '', y: '' })
  const [showLines, setShowLines] = useState(true)
  const [algorithm, setAlgorithm] = useState('sweep')

  const [stepIndex, setStepIndex] = useState(0)
  const [best, setBest] = useState({ pair: [], distance: Infinity })
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(600)

  const { distance: finalDistance, comparisons: finalComparisons } = useMemo(() => {
	if (algorithm === 'brute') return bruteForceClosestPair(points)
	if (algorithm === 'divide') return divideAndConquerClosestPair(points)
	return sweepLineClosestPair(points)
  }, [algorithm, points])

  const steps = useMemo(() => {
	if (algorithm === 'sweep') return buildSweepComparisons(points)
	if (algorithm === 'divide') return buildDivideComparisons(points)
	return buildComparisons(points)
  }, [algorithm, points])

  const midX = useMemo(() => {
	if (points.length < 1) return null
	const xs = [...points].sort((a, b) => a.x - b.x)
	const mid = Math.floor(xs.length / 2)
	return xs[mid]?.x ?? null
  }, [points])

  const { sweepOverlay: sweepPos, setSweepXAnim } = useSweepAnimation({
	algorithm,
	steps,
	playing,
	stepIndex,
	speed,
	points,
  })

  const sweepOverlay = useMemo(() => {
	if (algorithm !== 'sweep' || !sweepPos) return null
	const delta = Number.isFinite(best.distance) ? best.distance : null
	const left = delta != null ? Math.max(0, sweepPos.sweepX - delta) : null
	const right = delta != null ? Math.min(100, sweepPos.sweepX) : null
	return { left, right, sweepX: sweepPos.sweepX, delta }
  }, [algorithm, sweepPos, best.distance])

  const stepOnce = useCallback(() => {
	if (stepIndex >= steps.length) return
	const current = steps[stepIndex]
	const nextIndex = stepIndex + 1
	setStepIndex(nextIndex)
	setBest((prev) => (current.d < prev.distance ? { pair: [current.a, current.b], distance: current.d } : prev))
  }, [stepIndex, steps])

  useEffect(() => {
	if (!playing) return
	if (stepIndex >= steps.length) {
	  const stopId = setTimeout(() => setPlaying(false), 0)
	  return () => clearTimeout(stopId)
	}
	const id = setTimeout(() => {
	  stepOnce()
	}, speed)
	return () => clearTimeout(id)
  }, [playing, stepIndex, steps, speed, stepOnce])

  const resetPoints = () => {
	setPoints(randomPoints(Number(pointCount) || DEFAULT_POINT_COUNT))
	setStepIndex(0)
	setBest({ pair: [], distance: Infinity })
	setPlaying(false)
	setSweepXAnim && setSweepXAnim(null)
  }

  const clearPoints = () => {
	setPoints([])
	setStepIndex(0)
	setBest({ pair: [], distance: Infinity })
	setPlaying(false)
	setSweepXAnim && setSweepXAnim(null)
  }

  const addPointManually = (event) => {
	event.preventDefault()
	const x = Number(manualPoint.x)
	const y = Number(manualPoint.y)
	if (Number.isNaN(x) || Number.isNaN(y) || x < 0 || x > 100 || y < 0 || y > 100) return
	setPoints((prev) => [...prev, { id: crypto.randomUUID?.() ?? `${Date.now()}-${prev.length}`, x, y }])
	setManualPoint({ x: '', y: '' })
	setStepIndex(0)
	setBest({ pair: [], distance: Infinity })
	setPlaying(false)
	setSweepXAnim && setSweepXAnim(null)
  }

  const restartAlgorithm = () => {
	setStepIndex(0)
	setBest({ pair: [], distance: Infinity })
	setPlaying(false)
	setSweepXAnim && setSweepXAnim(null)
  }

  return (
	<div className="min-h-screen bg-slate-950 text-slate-100">
	  <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
		<header className="space-y-3 text-center">
		  <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Visualization</p>
		  <h1 className="text-4xl font-black sm:text-5xl">Closest Pair of Points</h1>
		  <p className="text-slate-300">
			Explore how different strategies search for the closest points. Add points manually, randomize the plane, and step through comparisons.
		  </p>
		</header>

		<section className="grid gap-8 lg:grid-cols-[320px_1fr]">
		  <aside>
			<ControlsPanel
			  pointCount={pointCount}
			  setPointCount={setPointCount}
			  algorithm={algorithm}
			  setAlgorithm={setAlgorithm}
			  onRandomize={resetPoints}
			  onClear={clearPoints}
			  showLines={showLines}
			  setShowLines={setShowLines}
			  manualPoint={manualPoint}
			  setManualPoint={setManualPoint}
			  onAddPoint={addPointManually}
			  sampleSets={SAMPLE_POINT_SETS}
			  onSelectSample={(id) => {
				const sel = SAMPLE_POINT_SETS.find((s) => s.id === id)
				if (!sel) return
				setPoints(sel.points)
				restartAlgorithm()
			  }}
			/>

			<div className="mt-6 grid gap-4">
			  <PlaybackPanel
				playing={playing}
				setPlaying={setPlaying}
				stepIndex={stepIndex}
				stepsLength={steps.length}
				onStepOnce={stepOnce}
				onRestart={restartAlgorithm}
				speed={speed}
				setSpeed={setSpeed}
				bestDistance={Number.isFinite(best.distance) ? best.distance.toFixed(2) : 'N/A'}
				currentDistance={stepIndex > 0 && stepIndex <= steps.length ? steps[stepIndex - 1].d.toFixed(2) : 'N/A'}
				finalDistance={Number.isFinite(finalDistance) ? finalDistance.toFixed(2) : 'N/A'}
				algorithmLabel={algorithm === 'brute' ? 'Brute Force' : algorithm === 'divide' ? 'Divide & Conquer' : 'Sweep Line'}
			  />

			  <div className="rounded-xl bg-slate-950/70 p-4 text-sm text-slate-300">
				<p>Total points: {points.length}</p>
				<p>Brute-force pairs: {buildComparisons(points).length}</p>
				<p>Algorithm comparisons: {finalComparisons ?? 0}</p>
			  </div>
			</div>
		  </aside>

		  <div className="space-y-6">
			<FieldCanvas
			  algorithm={algorithm}
			  showLines={showLines}
			  points={points}
			  steps={steps}
			  stepIndex={stepIndex}
			  best={best}
			  midX={midX}
			  finalDistance={Number.isFinite(finalDistance) ? finalDistance : null}
			  sweepOverlay={sweepOverlay}
			/>

			<PointsPanel
			  points={points}
			  bestPair={best.pair}
			  brutePairsCount={buildComparisons(points).length}
			  comparisonsCount={finalComparisons}
			/>
		  </div>
		</section>
	  </div>
	</div>
  )
}

export default ClosestaPair
