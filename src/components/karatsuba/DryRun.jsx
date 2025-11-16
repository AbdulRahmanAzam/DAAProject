import React from 'react'

function Row({ label, value, sub, isFinal }) {
  return (
    <div className={`flex items-start justify-between gap-4 rounded-lg px-4 py-3 text-sm ${isFinal ? 'bg-emerald-500/10 text-emerald-200' : 'bg-slate-950/50'}`}>
      <p className="font-semibold text-slate-300">{label}</p>
      <div className="text-right">
        <p className="font-mono text-slate-100">{value}</p>
        {sub && <p className="text-xs text-slate-400">{sub}</p>}
      </div>
    </div>
  )
}

function KaratsubaStep({ step }) {
  if (!step) return null
  switch (step.type) {
    case 'split':
      return (
        <div className="space-y-3">
          <Row label="Split a" value={`${step.a1} | ${step.a0}`} sub={`m = ${step.m}`} />
          <Row label="Split b" value={`${step.b1} | ${step.b0}`} sub={`m = ${step.m}`} />
        </div>
      )
    case 'base':
      return <Row label="Base Case" value={`${step.a} × ${step.b} = ${step.val}`} isFinal />
    case 'combine':
      return (
        <div className="space-y-3">
          <Row label="z2 (a1×b1)" value={step.z2} />
          <Row label="z0 (a0×b0)" value={step.z0} />
          <Row label="z1 ((a1+a0)×(b1+b0))" value={step.z1} />
          <Row label="Mid Term (z1−z2−z0)" value={step.mid} />
          <Row label="Product" value={step.prod} sub={`z2 · 10^${2 * step.m} + mid · 10^${step.m} + z0`} isFinal />
        </div>
      )
    default:
      return <p className="text-slate-400">Recursing…</p>
  }
}

function GradeSchoolStep({ step, a, b }) {
  if (!step) return null
  switch (step.type) {
    case 'digit-mul':
      return <Row label="Digit Multiply" value={`${step.da} × ${step.db} = ${step.partial}`} sub={`a[${a.length - 1 - step.i}] × b[${b.length - 1 - step.j}]`} />
    case 'accumulate':
      return (
        <div className="space-y-3">
          <Row label="Accumulate" value={`${step.add} + ${step.prev} + carry ${step.carry}`} sub={`Result[${step.idx}]`} />
          <Row label="New Digit" value={String(step.newDigit)} />
          <Row label="New Carry" value={String(step.newCarry)} />
        </div>
      )
    case 'carry-prop':
      return <Row label="Propagate Carry" value={`${step.prev} + ${step.carry} = ${step.sum}`} sub={`Result[${step.idx}]`} />
    case 'result':
      return <Row label="Final Product" value={step.product} isFinal />
    default:
      return null
  }
}

export default function DryRun({ algorithm, steps, stepIndex, a, b }) {
  const currentStep = steps[stepIndex - 1] || null
  return (
    <div className="relative min-h-[420px] rounded-2xl bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 p-6 ring-1 ring-white/5">
      <div className="absolute inset-x-6 top-6 flex items-baseline justify-between border-b border-slate-700/50 pb-4">
        <h3 className="font-semibold text-slate-200">{algorithm === 'karatsuba' ? 'Karatsuba Dry Run' : 'Grade School Dry Run'}</h3>
        <p className="font-mono text-slate-400">{a} × {b}</p>
      </div>
      <div className="relative pt-20">
        {algorithm === 'karatsuba' && <KaratsubaStep step={currentStep} />}
        {algorithm === 'grade' && <GradeSchoolStep step={currentStep} a={a} b={b} />}
        {!currentStep && <p className="text-center text-slate-500">Press Play or Step to start.</p>}
      </div>
    </div>
  )
}
