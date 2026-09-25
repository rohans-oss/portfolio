import { useEffect, useMemo, useRef, useState } from 'react'
import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY } from 'd3-force'
import { otherWork, projects } from '../data/profile'

// Stack names are written differently across projects; fold them together.
const ALIAS = {
  'React.js': 'React',
  'Graph Transformer': 'Graph Transformers',
  'Machine Learning': null,
  Pandas: null,
  TypeScript: null,
}
const SHORT = { 'Crop Disease & Yield Loss': 'Crop Disease', 'Network Intrusion Detection': 'NIDS' }

// Approximate half the rendered label width, so collisions keep labels apart.
const halfWidth = (n) => (n.kind === 'project' ? n.label.length * 4.5 + 8 : n.label.length * 3.5 + 4)

function buildGraph() {
  const all = [...projects, ...otherWork]
  const nodes = []
  const links = []
  const skillIndex = new Map()
  for (const p of all) {
    nodes.push({ id: p.id, label: SHORT[p.name] || p.name, kind: 'project' })
    for (const raw of p.stack) {
      const s = raw in ALIAS ? ALIAS[raw] : raw
      if (!s) continue
      if (!skillIndex.has(s)) {
        skillIndex.set(s, { id: `s:${s}`, label: s, kind: 'skill', uses: 0 })
        nodes.push(skillIndex.get(s))
      }
      skillIndex.get(s).uses++
      links.push({ source: p.id, target: `s:${s}` })
    }
  }
  return { nodes, links }
}

// A dot that travels along an edge from a tool into the project that uses it.
function Pulse({ x1, y1, x2, y2, loop }) {
  const start = (el) => el && el.beginElement?.()
  const dur = loop ? '1.1s' : '1.5s'
  return (
    <circle className="pulse" r={3.2} opacity={0}>
      <animateMotion ref={start} begin="indefinite" dur={dur} repeatCount={loop ? 'indefinite' : 1} path={`M${x2},${y2} L${x1},${y1}`} />
      <animate ref={start} attributeName="opacity" begin="indefinite" dur={dur} repeatCount={loop ? 'indefinite' : 1} values="0;1;1;0" keyTimes="0;0.15;0.8;1" />
    </circle>
  )
}

export default function WorkGraph({ onOpen }) {
  const wrap = useRef(null)
  const [size, setSize] = useState({ w: 640, h: 520 })
  const [snap, setSnap] = useState(null)
  const [focus, setFocus] = useState(null)
  const [beat, setBeat] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setBeat((b) => b + 1), 1700)
    return () => clearInterval(t)
  }, [])
  const sim = useRef(null)
  const drag = useRef(null)

  const compact = size.w < 520
  const graph = useMemo(() => {
    const g = buildGraph()
    if (!compact) return g
    // On small screens keep only tools shared by two or more projects.
    const keep = new Set(g.nodes.filter((n) => n.kind === 'project' || n.uses > 1).map((n) => n.id))
    return { nodes: g.nodes.filter((n) => keep.has(n.id)), links: g.links.filter((l) => keep.has(l.target)) }
  }, [compact])

  useEffect(() => {
    const el = wrap.current
    const ro = new ResizeObserver(([e]) => {
      const w = Math.round(e.contentRect.width)
      setSize({ w, h: w < 520 ? Math.max(340, Math.round(w * 0.95)) : Math.min(560, Math.round(w * 0.78)) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const { w, h } = size
    // Projects are anchored around an ellipse so they spread across the panel;
    // tools settle between the projects that use them.
    const projectIds = graph.nodes.filter((n) => n.kind === 'project').map((n) => n.id)
    const anchor = new Map(
      projectIds.map((id, i) => {
        const a = -Math.PI / 2 + (i / projectIds.length) * Math.PI * 2 + 0.35
        return [id, { x: w / 2 + Math.cos(a) * w * 0.3, y: h / 2 + Math.sin(a) * h * 0.3 }]
      }),
    )
    // Each tool starts at (and is gently held near) the midpoint of the projects
    // that use it; a tool used by one project sits just outside that project.
    const owners = new Map()
    for (const l of graph.links) owners.set(l.target, [...(owners.get(l.target) || []), anchor.get(l.source)])
    const nodes = graph.nodes.map((n, i) => {
      const a = anchor.get(n.id)
      let tx = a?.x
      let ty = a?.y
      if (!a) {
        const ps = owners.get(n.id)
        tx = ps.reduce((m, q) => m + q.x, 0) / ps.length
        ty = ps.reduce((m, q) => m + q.y, 0) / ps.length
        if (ps.length === 1) {
          tx += (tx - w / 2) * 0.45
          ty += (ty - h / 2) * 0.45
        }
      }
      const jitter = ((i * 37) % 11) - 5
      return { ...n, half: halfWidth(n), tx, ty, x: tx + jitter * 3, y: ty + jitter * 2 }
    })
    const links = graph.links.map((l) => ({ ...l }))
    const s = forceSimulation(nodes)
      .force('link', forceLink(links).id((d) => d.id).distance((l) => (l.target.uses > 2 ? 110 : 78)).strength(0.4))
      .force('charge', forceManyBody().strength((d) => (d.kind === 'project' ? -420 : -120)).distanceMax(240))
      .force('collide', forceCollide((d) => d.half + 6).strength(1).iterations(3))
      .force('x', forceX((d) => d.tx).strength((d) => (d.kind === 'project' ? 0.2 : 0.06)))
      .force('y', forceY((d) => d.ty).strength((d) => (d.kind === 'project' ? 0.2 : 0.06)))
      .on('tick', () => {
        for (const n of nodes) {
          n.x = Math.max(n.half + 10, Math.min(w - n.half - 10, n.x))
          n.y = Math.max(30, Math.min(h - 26, n.y))
        }
        publish()
      })
    function publish() {
      setSnap({ nodes: nodes.map((n) => ({ ...n })), links: links.map((l) => ({ s: l.source.id, t: l.target.id, x1: l.source.x, y1: l.source.y, x2: l.target.x, y2: l.target.y })) })
    }
    sim.current = { s, byId: new Map(nodes.map((n) => [n.id, n])) }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      s.stop()
      s.tick(300)
      requestAnimationFrame(publish)
    }
    return () => s.stop()
  }, [graph, size, compact])

  if (!snap) return <div ref={wrap} className="graph" style={{ aspectRatio: '640 / 500' }} />

  const neighbours = new Set()
  if (focus) {
    neighbours.add(focus)
    for (const l of snap.links) {
      if (l.s === focus) neighbours.add(l.t)
      if (l.t === focus) neighbours.add(l.s)
    }
  }
  const lit = (id) => !focus || neighbours.has(id)

  const toLocal = (e) => {
    const r = e.currentTarget.ownerSVGElement.getBoundingClientRect()
    return { x: ((e.clientX - r.left) / r.width) * size.w, y: ((e.clientY - r.top) / r.height) * size.h }
  }
  const down = (e, id) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    const p = toLocal(e)
    const n = sim.current.byId.get(id)
    drag.current = { n, sx: p.x, sy: p.y, moved: false }
    n.fx = n.x
    n.fy = n.y
    sim.current.s.alphaTarget(0.25).restart()
  }
  const move = (e) => {
    const d = drag.current
    if (!d) return
    const p = toLocal(e)
    if (Math.hypot(p.x - d.sx, p.y - d.sy) > 4) d.moved = true
    d.n.fx = p.x
    d.n.fy = p.y
  }
  const up = () => {
    const d = drag.current
    if (!d) return
    d.n.fx = null
    d.n.fy = null
    sim.current.s.alphaTarget(0)
    drag.current = null
    if (!d.moved && d.n.kind === 'project') onOpen(d.n.id)
  }

  return (
    <div ref={wrap} className="graph">
      <svg
        viewBox={`0 0 ${size.w} ${size.h}`}
        width={size.w}
        height={size.h}
        role="img"
        aria-label="Graph of Rohan's projects connected to the tools each one uses"
      >
        <g className="graph-links">
          {snap.links.map((l, i) => {
            const on = focus && (l.s === focus || l.t === focus)
            return (
              <line
                key={i}
                x1={l.x1}
                y1={l.y1}
                x2={l.x2}
                y2={l.y2}
                className={on ? 'is-on' : focus ? 'is-dim' : ''}
              />
            )
          })}
        </g>
        <g className="graph-pulses" aria-hidden="true">
          {focus
            ? snap.links
                .filter((l) => l.s === focus || l.t === focus)
                .map((l, i) => <Pulse key={`f-${focus}-${i}`} {...l} loop />)
            : beat > 0 &&
              [0, 1, 2].map((k) => {
                const l = snap.links[(beat * 7 + k * 13) % snap.links.length]
                return <Pulse key={`b-${beat}-${k}`} {...l} />
              })}
        </g>
        {snap.nodes.map((n) => {
          const isProject = n.kind === 'project'
          return (
            <g
              key={n.id}
              className={`node node-${n.kind} ${lit(n.id) ? '' : 'is-dim'} ${focus === n.id ? 'is-focus' : ''}`}
              transform={`translate(${n.x},${n.y})`}
              onPointerEnter={() => setFocus(n.id)}
              onPointerLeave={(e) => !e.currentTarget.hasPointerCapture(e.pointerId) && setFocus(null)}
              onPointerDown={(e) => down(e, n.id)}
              onPointerMove={move}
              onPointerUp={up}
              onFocus={() => setFocus(n.id)}
              onBlur={() => setFocus(null)}
              onKeyDown={(e) => {
                if (isProject && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault()
                  onOpen(n.id)
                }
              }}
              tabIndex={isProject ? 0 : -1}
              role={isProject ? 'button' : undefined}
              aria-label={isProject ? `Open ${n.label}` : undefined}
            >
              <circle className="node-hit" r={isProject ? 22 : 13} />
              <circle className="node-dot" r={isProject ? 9 : 4.5} />
              {isProject && <circle className="node-halo" r={16} />}
              <text y={isProject ? -16 : 18} textAnchor="middle">
                {n.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
