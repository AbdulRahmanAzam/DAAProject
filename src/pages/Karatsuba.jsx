import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { KaratsubaControls, KaratsubaPlayback } from '../components/karatsuba/Panels'
import { SAMPLE_INTEGER_INPUTS } from '../utils/karatsuba/sampleInputs'
import DryRun from '../components/karatsuba/DryRun'
import TreeCanvas from '../components/karatsuba/TreeCanvas'
import { buildKaratsubaSteps, buildKaratsubaTreeAndSteps } from '../utils/karatsuba/karatsuba'
import { buildGradeSteps } from '../utils/karatsuba/gradeSchool'

function randomNDigits(n) {
  const digits = Array.from({ length: n }, (_, i) => (i === 0 ? (Math.floor(Math.random()*9)+1) : Math.floor(Math.random()*10))).join('')
  return digits
}

export default function Karatsuba() {
  const [a, setA] = useState('123456')
  const [b, setB] = useState('789012')
  const [digits, setDigits] = useState(6)
  const [algorithm, setAlgorithm] = useState('karatsuba') // 'grade' | 'karatsuba'
  const [visualizationType, setVisualizationType] = useState('dry-run') // 'dry-run' | 'graph'

  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(600)
  const [stepIndex, setStepIndex] = useState(0)

  const { root, steps, product } = useMemo(() => {
    if (algorithm === 'karatsuba') {
      const { root, steps, product } = buildKaratsubaTreeAndSteps(a, b)
      return { root, steps, product }
    }
    const { steps, product } = buildGradeSteps(a, b)
    return { root: null, steps, product }
  }, [a, b, algorithm])

  useEffect(() => {
    if (algorithm !== 'karatsuba') setVisualizationType('dry-run')
  }, [algorithm])

  const stepOnce = useCallback(() => {
    if (stepIndex >= steps.length) return
    setStepIndex((s) => s + 1)
  }, [stepIndex, steps.length])

  useEffect(() => {
    if (!playing) return
    if (stepIndex >= steps.length) {
      const id = setTimeout(() => setPlaying(false), 0)
      return () => clearTimeout(id)
    }
    const id = setTimeout(() => stepOnce(), speed)
    return () => clearTimeout(id)
  }, [playing, stepIndex, steps.length, speed, stepOnce])

  const onRandomize = () => {
    const n = Number(digits) || 6
    setA(randomNDigits(n))
    setB(randomNDigits(n))
    setStepIndex(0)
    setPlaying(false)
  }

  const onClear = () => {
    setA('')
    setB('')
    setStepIndex(0)
    setPlaying(false)
  }

  const onRestart = () => {
    setStepIndex(0)
    setPlaying(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
        <header className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Visualization</p>
          <h1 className="text-4xl font-black sm:text-5xl">Integer Multiplication</h1>
          <p className="text-slate-300">Compare Grade-School vs Karatsuba with a step-by-step dry run.</p>
        </header>

        <section className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-6">
            <KaratsubaControls
              a={a}
              b={b}
              setA={setA}
              setB={setB}
              digits={digits}
              setDigits={setDigits}
              algorithm={algorithm}
              setAlgorithm={setAlgorithm}
              visualizationType={visualizationType}
              setVisualizationType={setVisualizationType}
              onRandomize={onRandomize}
              onClear={onClear}
              sampleInputs={SAMPLE_INTEGER_INPUTS}
              onSelectSample={() => {
                setStepIndex(0)
                setPlaying(false)
              }}
            />
            <KaratsubaPlayback playing={playing} setPlaying={setPlaying} stepIndex={stepIndex} stepsLength={steps.length} onStepOnce={stepOnce} onRestart={onRestart} speed={speed} setSpeed={setSpeed} product={stepIndex >= steps.length ? product : null} />
          </aside>
          <div className="space-y-6">
            {visualizationType === 'graph' && algorithm === 'karatsuba' ? (
              <div className="relative h-[420px] rounded-2xl bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 p-3 ring-1 ring-white/5">
                <div className="absolute inset-x-6 top-6 flex items-baseline justify-between border-b border-slate-700/50 pb-4">
                  <h3 className="font-semibold text-slate-200">Karatsuba Recursion Tree</h3>
                  <p className="font-mono text-slate-400">{a} × {b}</p>
                </div>
                <TreeCanvas root={root} steps={steps} stepIndex={stepIndex} />
              </div>
            ) : (
              <DryRun algorithm={algorithm} steps={steps} stepIndex={stepIndex} a={a} b={b} />
            )}
            <div className="rounded-2xl bg-slate-900/70 p-6 ring-1 ring-white/5 text-sm text-slate-300">
              <p>Input A: {a || '—'}</p>
              <p>Input B: {b || '—'}</p>
              <p>Steps: {steps.length}</p>
              <p>Product: {stepIndex >= steps.length ? product : '…'}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
