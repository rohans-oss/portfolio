import { motion, useScroll, useTransform } from 'framer-motion'

// Animated, project-specific illustrations (pure SVG, no image assets).

function GraphViz() {
  const nodes = [
    [60, 70, 'drug'], [150, 40, 'prot'], [240, 80, 'dis'], [110, 150, 'drug'], [200, 170, 'prot'],
    [290, 150, 'dis'], [60, 230, 'prot'], [170, 250, 'drug'], [270, 240, 'dis'],
  ]
  const edges = [[0, 1], [1, 2], [0, 3], [3, 4], [4, 2], [4, 5], [3, 6], [6, 7], [7, 4], [7, 8], [5, 8], [1, 4]]
  const color = { drug: 'var(--accent)', prot: 'var(--cream)', dis: 'var(--amber)' }
  return (
    <svg viewBox="0 0 340 300" className="pv-svg">
      {edges.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          stroke="var(--line-strong)" strokeWidth="1.5"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
          transition={{ duration: 1, delay: i * 0.06 }}
        />
      ))}
      <motion.line
        x1={nodes[0][0]} y1={nodes[0][1]} x2={nodes[8][0]} y2={nodes[8][1]}
        stroke="var(--accent)" strokeWidth="2" strokeDasharray="6 6"
        animate={{ strokeDashoffset: [0, -24] }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
      />
      {nodes.map(([x, y, t], i) => (
        <motion.circle
          key={i} cx={x} cy={y} r={t === 'drug' ? 11 : 8} fill={color[t]}
          initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
          transition={{ type: 'spring', delay: 0.3 + i * 0.05 }}
        />
      ))}
      <text x="170" y="292" textAnchor="middle" className="pv-label">predicted link · drug → disease</text>
    </svg>
  )
}

function BarsViz() {
  const bars = [
    ['Accuracy', 0.948], ['F1', 0.959], ['PR-AUC', 0.9954], ['Macro F1', 0.5906],
  ]
  return (
    <svg viewBox="0 0 340 300" className="pv-svg">
      {bars.map(([l, v], i) => {
        const w = 220 * v
        return (
          <g key={l} transform={`translate(20 ${40 + i * 60})`}>
            <text x="0" y="-8" className="pv-label" textAnchor="start">{l}</text>
            <rect x="0" y="0" width="220" height="18" rx="9" fill="var(--line)" />
            <motion.rect
              x="0" y="0" height="18" rx="9" fill={i === 3 ? 'var(--cream-dim)' : 'var(--accent)'}
              initial={{ width: 0 }} whileInView={{ width: w }} viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            />
            <text x="232" y="14" className="pv-num">{v < 1 && v > 0.99 ? v.toFixed(4) : `${(v * 100).toFixed(1)}%`}</text>
          </g>
        )
      })}
    </svg>
  )
}

function PipelineViz() {
  const steps = ['UPI txn', 'Intent risk', 'Causal router', 'Gateway']
  return (
    <svg viewBox="0 0 340 300" className="pv-svg">
      {steps.map((s, i) => {
        const y = 30 + i * 66
        return (
          <g key={s}>
            <motion.rect
              x="70" y={y} width="200" height="44" rx="12"
              fill={i === 1 || i === 2 ? 'var(--accent-soft)' : 'transparent'}
              stroke={i === 1 || i === 2 ? 'var(--accent)' : 'var(--line-strong)'} strokeWidth="1.5"
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            />
            <text x="170" y={y + 27} textAnchor="middle" className="pv-step">{s}</text>
            {i < steps.length - 1 && (
              <line x1="170" y1={y + 44} x2="170" y2={y + 66} stroke="var(--line-strong)" strokeWidth="1.5" />
            )}
          </g>
        )
      })}
      <motion.circle
        r="5" cx="170" fill="var(--accent)"
        animate={{ cy: [52, 118, 184, 250] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
      />
      <text x="300" y="118" className="pv-label" textAnchor="middle">9 feat.</text>
      <text x="300" y="184" className="pv-label" textAnchor="middle">DR · 5×</text>
    </svg>
  )
}

function GridViz() {
  const cells = Array.from({ length: 48 }, (_, i) => i)
  return (
    <svg viewBox="0 0 340 300" className="pv-svg">
      {cells.map((i) => {
        const x = 30 + (i % 8) * 36
        const y = 20 + Math.floor(i / 8) * 36
        const sick = [3, 10, 11, 19, 26, 27, 34, 41].includes(i)
        return (
          <motion.rect
            key={i} x={x} y={y} width="28" height="28" rx="6"
            fill={sick ? 'var(--accent)' : 'var(--line)'}
            initial={{ opacity: 0, scale: 0.4 }} whileInView={{ opacity: sick ? 1 : 0.9, scale: 1 }}
            viewport={{ once: true }} transition={{ delay: (i % 8) * 0.04 + Math.floor(i / 8) * 0.04 }}
          />
        )
      })}
      <text x="170" y="245" textAnchor="middle" className="pv-num">1,860 → 471</text>
      <text x="170" y="268" textAnchor="middle" className="pv-label">PCA components · 95.03% variance</text>
    </svg>
  )
}

const map = { durgos: GraphViz, nids: BarsViz, trustrail: PipelineViz, crop: GridViz }

export default function ProjectVisual({ id }) {
  const V = map[id]
  return (
    <div className="pv">
      <div className="pv-grid" />
      <V />
    </div>
  )
}

export function useCardScale(target, i, total) {
  const { scrollYProgress } = useScroll({ target, offset: ['start start', 'end end'] })
  const start = i / total
  return useTransform(scrollYProgress, [start, 1], [1, 1 - (total - i) * 0.04])
}
