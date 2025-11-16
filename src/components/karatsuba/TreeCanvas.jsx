import React, { useMemo } from 'react'

const NODE_W = 120
const NODE_H = 54
const H_SP = 32
const V_SP = 80
const OVERLAP_X = 10 // pixels to let sibling subtrees overlap slightly

function layout(root) {
  function dfs(node, y) {
    if (!node.children || node.children.length === 0) {
      const n = { id: node.id, data: node.data, x: 0, y, children: [] }
      return { width: NODE_W, height: y + NODE_H, nodes: [n], edges: [] }
    }
    const kids = node.children.map((c) => dfs(c, y + NODE_H + V_SP))
    const childrenSpan = kids.reduce((acc, l) => acc + l.width, 0)
    const overlapTotal = OVERLAP_X * Math.max(0, kids.length - 1)
    const totalWidth = Math.max(
      NODE_W,
      // Place children side-by-side with base spacing, then pull them closer by overlap amount
      childrenSpan + H_SP * (kids.length - 1) - overlapTotal,
    )
    const nX = totalWidth / 2 - NODE_W / 2
    const nodes = [{ id: node.id, data: node.data, x: nX, y, children: [] }]
    const edges = []
    let curX = 0
    for (const k of kids) {
      const childRoot = k.nodes.find((nn) => nn.y === y + NODE_H + V_SP)
      if (childRoot) edges.push({ from: { x: nX + NODE_W / 2, y: y + NODE_H }, to: { x: childRoot.x + curX + NODE_W / 2, y: childRoot.y } })
      k.nodes.forEach((nn) => nodes.push({ ...nn, x: nn.x + curX }))
      k.edges.forEach((e) => edges.push({ from: { x: e.from.x + curX, y: e.from.y }, to: { x: e.to.x + curX, y: e.to.y } }))
      // Shift next subtree left a bit to create slight overlap
      curX += k.width + H_SP - OVERLAP_X
    }
    const height = kids.reduce((h, l) => Math.max(h, l.height), y + NODE_H)
    return { width: totalWidth, height, nodes, edges }
  }
  return dfs(root, 0)
}

function Node({ n, highlight, done }) {
  const { a, b, prod, type } = n.data || {}
  const label = type === 'base' ? `Base: ${a}×${b}` : `${a}×${b}`
  const result = prod ? `= ${prod}` : '…'
  const border = highlight ? 'border-emerald-400' : done ? 'border-slate-600' : 'border-slate-500'
  return (
    <div className={`absolute rounded-lg ${border} border bg-slate-900/90 px-3 py-2 text-center shadow`} style={{ left: n.x, top: n.y, width: NODE_W, height: NODE_H }}>
      <p className="text-xs font-medium text-slate-300">{label}</p>
      <p className="mt-1 font-mono text-base text-slate-100">{result}</p>
    </div>
  )
}

export default function TreeCanvas({ root, steps, stepIndex }) {
  const lay = useMemo(() => (root ? layout(root) : null), [root])
  const current = steps?.[stepIndex - 1]
  const done = new Set((steps || []).slice(0, stepIndex).map((s) => s.nodeId))

  if (!lay) return <div className="flex h-full min-h-[420px] items-center justify-center text-slate-500">Enter numbers to build the recursion tree.</div>

  return (
    <div className="relative h-full pt-20 overflow-hidden">
      <svg className="absolute left-0 top-0 h-full w-full" viewBox={`0 0 ${lay.width} ${lay.height}`} preserveAspectRatio="xMidYMin meet">
        {lay.edges.map((e, i) => (
          <line key={i} x1={e.from.x} y1={e.from.y} x2={e.to.x} y2={e.to.y} stroke="#475569" strokeWidth="1.5" />
        ))}
        {lay.nodes.map((n) => {
          const { a, b, prod, type } = n.data || {}
          const label = type === 'base' ? `Base: ${a}×${b}` : `${a}×${b}`
          const result = prod ? `= ${prod}` : '…'
          const border = current?.nodeId === n.id ? '#34d399' : done.has(n.id) ? '#475569' : '#64748b'
          return (
            <g key={n.id}>
              <rect x={n.x} y={n.y} width={NODE_W} height={NODE_H} rx={8} ry={8} fill="rgba(15,23,42,0.9)" stroke={border} strokeWidth={1.5} />
              <text x={n.x + NODE_W / 2} y={n.y + 20} textAnchor="middle" fontSize={12} fill="#cbd5e1" fontWeight={600}>
                {label}
              </text>
              <text x={n.x + NODE_W / 2} y={n.y + 38} textAnchor="middle" fontSize={13} fill="#e2e8f0" fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace">
                {result}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
