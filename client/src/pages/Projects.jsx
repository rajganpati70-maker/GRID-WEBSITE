import React, { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Brain, Cpu, GitBranch, Layers, FlaskConical, Network,
  Sparkles, ArrowRight, Zap, Lock, Globe, Code2,
  BarChart2, Database, Box, Rocket
} from 'lucide-react'

/* ─── Floating node positions for the neural net visual ─────────────── */
const NODES = [
  // Input layer
  { id:'i0', x:80,  y:160, r:9,  layer:0, color:'#00d4ff' },
  { id:'i1', x:80,  y:240, r:9,  layer:0, color:'#00d4ff' },
  { id:'i2', x:80,  y:320, r:9,  layer:0, color:'#00d4ff' },
  { id:'i3', x:80,  y:400, r:7,  layer:0, color:'#00d4ff' },
  { id:'i4', x:80,  y:480, r:7,  layer:0, color:'#00d4ff' },
  // Hidden 1
  { id:'h0', x:230, y:190, r:11, layer:1, color:'#7b2fff' },
  { id:'h1', x:230, y:290, r:11, layer:1, color:'#7b2fff' },
  { id:'h2', x:230, y:390, r:11, layer:1, color:'#7b2fff' },
  { id:'h3', x:230, y:480, r:9,  layer:1, color:'#7b2fff' },
  // Hidden 2
  { id:'h4', x:390, y:160, r:14, layer:2, color:'#0066ff' },
  { id:'h5', x:390, y:280, r:14, layer:2, color:'#0066ff' },
  { id:'h6', x:390, y:400, r:14, layer:2, color:'#0066ff' },
  // Hidden 3
  { id:'h7', x:550, y:200, r:11, layer:3, color:'#7b2fff' },
  { id:'h8', x:550, y:330, r:11, layer:3, color:'#7b2fff' },
  { id:'h9', x:550, y:450, r:9,  layer:3, color:'#7b2fff' },
  // Output
  { id:'o0', x:700, y:240, r:13, layer:4, color:'#4ade80' },
  { id:'o1', x:700, y:360, r:13, layer:4, color:'#4ade80' },
]

const EDGES = [
  // i→h1
  ...['i0','i1','i2','i3','i4'].flatMap(src => ['h0','h1','h2','h3'].map(dst => ({ src, dst }))),
  // h1→h2
  ...['h0','h1','h2','h3'].flatMap(src => ['h4','h5','h6'].map(dst => ({ src, dst }))),
  // h2→h3
  ...['h4','h5','h6'].flatMap(src => ['h7','h8','h9'].map(dst => ({ src, dst }))),
  // h3→o
  ...['h7','h8','h9'].flatMap(src => ['o0','o1'].map(dst => ({ src, dst }))),
]

/* ─── Animated pulse packet travelling along a line ─────────────────── */
function Packet({ x1, y1, x2, y2, delay, color }) {
  const len = Math.hypot(x2-x1, y2-y1)
  return (
    <motion.circle
      r={3}
      fill={color}
      filter={`drop-shadow(0 0 4px ${color})`}
      style={{ opacity: 0.9 }}
      initial={{ offsetDistance:'0%', opacity:0 }}
      animate={{ offsetDistance:'100%', opacity:[0,1,1,0] }}
      transition={{ duration:1.6, delay, repeat:Infinity, repeatDelay:Math.random()*3+1.5, ease:'linear' }}
      {...{ 'data-fake': true }}
    >
      <animateMotion
        dur="1.6s"
        begin={`${delay}s`}
        repeatCount="indefinite"
        path={`M${x1},${y1} L${x2},${y2}`}
      />
    </motion.circle>
  )
}

/* ─── Neural network SVG ─────────────────────────────────────────────── */
function NeuralNet() {
  const nodeMap = Object.fromEntries(NODES.map(n => [n.id, n]))
  const [lit, setLit] = useState(new Set())

  useEffect(() => {
    let i = 0
    const ids = NODES.map(n => n.id)
    const iv = setInterval(() => {
      setLit(new Set([ids[i % ids.length], ids[(i+3) % ids.length]]))
      i++
    }, 340)
    return () => clearInterval(iv)
  }, [])

  return (
    <svg viewBox="0 0 780 640" style={{ width:'100%', maxWidth:700, overflow:'visible' }}>
      <defs>
        <filter id="glow-b"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="glow-s"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <radialGradient id="bg-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(0,102,255,0.06)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
        </radialGradient>
      </defs>

      {/* background glow */}
      <ellipse cx="390" cy="320" rx="340" ry="280" fill="url(#bg-glow)"/>

      {/* Edges */}
      {EDGES.map(({ src, dst }, idx) => {
        const a = nodeMap[src], b = nodeMap[dst]
        if (!a || !b) return null
        return (
          <line key={`${src}-${dst}`}
            x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke={`rgba(255,255,255,0.04)`}
            strokeWidth={0.8}
          />
        )
      })}

      {/* Animated pulses on select edges */}
      {EDGES.filter((_,i) => i % 4 === 0).map(({ src, dst }, idx) => {
        const a = nodeMap[src], b = nodeMap[dst]
        if (!a || !b) return null
        return (
          <g key={`pkt-${src}-${dst}`}>
            <animateMotion
              dur={`${1.4 + (idx%4)*0.3}s`}
              begin={`${(idx%7)*0.4}s`}
              repeatCount="indefinite"
              path={`M${a.x},${a.y} L${b.x},${b.y}`}
            />
            <circle r={2.5} fill={a.color} opacity={0.85} filter="url(#glow-b)">
              <animateMotion
                dur={`${1.4 + (idx%4)*0.3}s`}
                begin={`${(idx%7)*0.4}s`}
                repeatCount="indefinite"
                path={`M${a.x},${a.y} L${b.x},${b.y}`}
              />
              <animate attributeName="opacity" values="0;0.9;0.9;0" dur={`${1.4+(idx%4)*0.3}s`} repeatCount="indefinite" begin={`${(idx%7)*0.4}s`}/>
            </circle>
          </g>
        )
      })}

      {/* Nodes */}
      {NODES.map((n, i) => (
        <g key={n.id}>
          {/* outer ring */}
          <circle cx={n.x} cy={n.y} r={n.r + 6} fill="none"
            stroke={n.color} strokeWidth={0.6}
            opacity={lit.has(n.id) ? 0.5 : 0.1}
            style={{ transition:'opacity 0.3s' }}
          />
          {/* halo */}
          <circle cx={n.x} cy={n.y} r={n.r + 3} fill={n.color}
            opacity={lit.has(n.id) ? 0.08 : 0.03}
            style={{ transition:'opacity 0.3s' }}
          />
          {/* core */}
          <circle cx={n.x} cy={n.y} r={n.r}
            fill={`rgba(${n.color === '#00d4ff' ? '0,212,255' : n.color === '#7b2fff' ? '123,47,255' : n.color === '#0066ff' ? '0,102,255' : '74,222,128'},${lit.has(n.id) ? 0.35 : 0.12})`}
            stroke={n.color} strokeWidth={lit.has(n.id) ? 1.8 : 1}
            filter={lit.has(n.id) ? 'url(#glow-s)' : undefined}
            style={{ transition:'all 0.3s' }}
          />
          {/* pulse ring */}
          {lit.has(n.id) && (
            <circle cx={n.x} cy={n.y} r={n.r} fill="none" stroke={n.color} strokeWidth={1.5} opacity={0.7}>
              <animate attributeName="r" values={`${n.r};${n.r+16}`} dur="1.2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.7;0" dur="1.2s" repeatCount="indefinite"/>
            </circle>
          )}
        </g>
      ))}

      {/* Layer labels */}
      {[
        { x:80,  label:'INPUT',   color:'rgba(0,212,255,0.35)' },
        { x:230, label:'HIDDEN',  color:'rgba(123,47,255,0.35)' },
        { x:390, label:'HIDDEN',  color:'rgba(0,102,255,0.35)' },
        { x:550, label:'HIDDEN',  color:'rgba(123,47,255,0.35)' },
        { x:700, label:'OUTPUT',  color:'rgba(74,222,128,0.35)' },
      ].map(({ x, label, color }) => (
        <text key={label+x} x={x} y={560} textAnchor="middle"
          fontSize={9} fill={color} fontFamily="Inter,sans-serif"
          letterSpacing="0.2em" fontWeight="700"
        >{label}</text>
      ))}
    </svg>
  )
}

/* ─── Floating feature pill ─────────────────────────────────────────── */
function FloatingPill({ icon: Icon, label, color, delay, x, y, floatY = 12 }) {
  return (
    <motion.div
      initial={{ opacity:0, scale:0.8 }}
      animate={{ opacity:1, scale:1 }}
      transition={{ delay, duration:0.5, ease:'backOut' }}
      style={{ position:'absolute', left:x, top:y, zIndex:10 }}
    >
      <motion.div
        animate={{ y:[0, -floatY, 0] }}
        transition={{ duration:3 + delay, repeat:Infinity, ease:'easeInOut' }}
        style={{
          display:'flex', alignItems:'center', gap:8, padding:'8px 14px',
          borderRadius:100, backdropFilter:'blur(20px)',
          background:'rgba(6,6,22,0.85)',
          border:`1px solid ${color}28`,
          boxShadow:`0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px ${color}10 inset`,
          whiteSpace:'nowrap',
        }}
      >
        <div style={{ width:22, height:22, borderRadius:6, background:`${color}18`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon style={{ width:11, height:11, color }} />
        </div>
        <span style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:11.5, fontWeight:700, color:'rgba(200,215,235,0.85)' }}>{label}</span>
      </motion.div>
    </motion.div>
  )
}

/* ─── Coming soon category card ─────────────────────────────────────── */
function CategoryCard({ icon: Icon, title, desc, color, delay, count }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      initial={{ opacity:0, y:32 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true }}
      transition={{ delay, duration:0.55, ease:'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius:20, overflow:'hidden', cursor:'default',
        background:'linear-gradient(160deg,rgba(6,6,24,0.98),rgba(4,4,18,0.96))',
        border:`1px solid ${hovered ? color+'28' : color+'10'}`,
        boxShadow: hovered ? `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${color}08` : '0 8px 32px rgba(0,0,0,0.35)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        transition:'all 0.3s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <div style={{ height:2, background:`linear-gradient(90deg,${color},${color}00)` }} />
      <div style={{ padding:'24px' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:`${color}12`, border:`1px solid ${color}22`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon style={{ width:20, height:20, color }} />
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:22, color:'rgba(200,215,235,0.15)', letterSpacing:'-0.03em', lineHeight:1 }}>0</div>
            <div style={{ fontFamily:'Inter,sans-serif', fontSize:9, color:'rgba(140,160,190,0.3)', letterSpacing:'0.16em', textTransform:'uppercase', fontWeight:500 }}>projects</div>
          </div>
        </div>
        <h3 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:15.5, color:'#e8eef8', letterSpacing:'-0.02em', marginBottom:7 }}>{title}</h3>
        <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:12.5, color:'rgba(130,150,180,0.62)', lineHeight:1.65 }}>{desc}</p>
      </div>
    </motion.div>
  )
}

/* ─── Main page ──────────────────────────────────────────────────────── */
const CATEGORIES = [
  { icon:Brain,      title:'LLM & Foundation Models',  color:'#00d4ff', desc:'Fine-tuning rigs, inference optimisers, quantisation pipelines, and context-extension experiments.' },
  { icon:Cpu,        title:'Training Infrastructure',   color:'#7b2fff', desc:'Custom training loops, distributed strategies, mixed-precision utilities, and CUDA kernels.' },
  { icon:FlaskConical, title:'Research Reproductions', color:'#f472b6', desc:'Open re-implementations of landmark papers — verified, readable, and ready to fork.' },
  { icon:Layers,     title:'MLOps & Tooling',           color:'#4ade80', desc:'Experiment trackers, model registries, data versioning, monitoring dashboards, and CI pipelines.' },
  { icon:Network,    title:'Reinforcement Learning',    color:'#fbbf24', desc:'RL algorithms, multi-agent environments, reward-model trainers, and RLHF pipelines.' },
  { icon:Database,   title:'Datasets & Preprocessing',  color:'#60a5fa', desc:'Cleaning scripts, augmentation utilities, synthetic data generators, and evaluation harnesses.' },
]

const STATS = [
  { value:'900+', label:'Researchers Ready', sub:'waiting to publish' },
  { value:'∞',    label:'Projects Possible',  sub:'the grid is open' },
  { value:'0→∞',  label:'Stars Incoming',     sub:'be the first star' },
]

export default function Projects() {
  const navigate = useNavigate()

  return (
    <div style={{ background:'#02020e', overflowX:'hidden' }}>

      {/* ══════════════════ HERO ══════════════════ */}
      <section style={{ position:'relative', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', overflow:'hidden', padding:'120px 24px 80px' }}>

        {/* bg layers */}
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 70% 60% at 50% 30%, rgba(0,52,204,0.18) 0%, transparent 65%)' }} />
        <motion.div animate={{ scale:[1,1.08,1], opacity:[0.5,0.8,0.5] }} transition={{ duration:8, repeat:Infinity, ease:'easeInOut' }}
          style={{ position:'absolute', top:'-10%', left:'15%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(0,82,204,0.12) 0%,transparent 70%)', filter:'blur(90px)', pointerEvents:'none' }} />
        <motion.div animate={{ scale:[1,1.12,1], opacity:[0.4,0.7,0.4] }} transition={{ duration:11, repeat:Infinity, ease:'easeInOut', delay:3 }}
          style={{ position:'absolute', bottom:'-5%', right:'10%', width:440, height:440, borderRadius:'50%', background:'radial-gradient(circle,rgba(123,47,255,0.12) 0%,transparent 70%)', filter:'blur(80px)', pointerEvents:'none' }} />

        {/* Neural net visual */}
        <motion.div
          initial={{ opacity:0, scale:0.9 }}
          animate={{ opacity:1, scale:1 }}
          transition={{ duration:1.2, ease:'easeOut' }}
          style={{ position:'relative', width:'100%', maxWidth:700, marginBottom:8 }}
        >
          <NeuralNet />

          {/* Floating pills around the net */}
          <FloatingPill icon={Zap}       label="GPU Accelerated"   color="#fbbf24" delay={0.6} x="-10%"  y="5%"  floatY={10} />
          <FloatingPill icon={Lock}      label="Open Source"        color="#4ade80" delay={0.9} x="78%"  y="3%"  floatY={14} />
          <FloatingPill icon={Code2}     label="Peer Reviewed"      color="#7b2fff" delay={1.1} x="-8%"  y="72%" floatY={8}  />
          <FloatingPill icon={Globe}     label="Community Built"    color="#00d4ff" delay={1.3} x="74%"  y="75%" floatY={12} />
          <FloatingPill icon={Sparkles}  label="Coming Soon"        color="#f472b6" delay={1.5} x="30%"  y="-6%" floatY={9}  />
        </motion.div>

        {/* Main text */}
        <div style={{ textAlign:'center', maxWidth:720, position:'relative', zIndex:2 }}>
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3, duration:0.7 }}>
            <span className="tag mb-6 inline-flex items-center gap-2">
              <Rocket style={{ width:11, height:11 }} /> Projects — Launching Soon
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity:0, y:28 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.45, duration:0.8 }}
            style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:'clamp(2.4rem,5.5vw,4rem)', letterSpacing:'-0.05em', lineHeight:1.06, color:'#f0f6ff', marginBottom:10 }}
          >
            No projects yet.
          </motion.h1>
          <motion.h2
            initial={{ opacity:0, y:24 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.58, duration:0.75 }}
            style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:'clamp(2.4rem,5.5vw,4rem)', letterSpacing:'-0.05em', lineHeight:1.06, marginBottom:28 }}
          >
            <span className="text-gradient">Be the one who starts.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity:0, y:18 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.72, duration:0.7 }}
            style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:18, color:'rgba(170,186,210,0.78)', lineHeight:1.75, marginBottom:44, maxWidth:560, margin:'0 auto 44px' }}
          >
            The GRID Projects space is waiting for its first breakthrough. Every great open-source ML project started with one person who decided to share their work. 
            That person could be you.
          </motion.p>

          <motion.div
            initial={{ opacity:0, y:14 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.86, duration:0.6 }}
            style={{ display:'flex', flexWrap:'wrap', gap:12, justifyContent:'center' }}
          >
            <motion.button
              onClick={() => navigate('/register')}
              whileHover={{ scale:1.04 }}
              whileTap={{ scale:0.97 }}
              style={{ display:'flex', alignItems:'center', gap:9, padding:'15px 32px', borderRadius:14, border:'none', cursor:'pointer', background:'linear-gradient(135deg,#0052cc,#00d4ff)', color:'#fff', fontSize:15, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700, boxShadow:'0 6px 32px rgba(0,102,255,0.4)' }}
            >
              Submit a Project <ArrowRight style={{ width:16, height:16 }} />
            </motion.button>
            <motion.button
              onClick={() => navigate('/forum')}
              whileHover={{ scale:1.04 }}
              whileTap={{ scale:0.97 }}
              style={{ display:'flex', alignItems:'center', gap:9, padding:'15px 32px', borderRadius:14, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.04)', cursor:'pointer', color:'rgba(200,215,235,0.8)', fontSize:15, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700, backdropFilter:'blur(10px)' }}
            >
              Discuss on Forum
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ STATS ROW ══════════════════ */}
      <section style={{ padding:'0 24px 80px' }}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
            {STATS.map(({ value, label, sub }, i) => (
              <motion.div
                key={label}
                initial={{ opacity:0, y:24 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }}
                transition={{ delay:i*0.12, duration:0.55 }}
                style={{
                  textAlign:'center', padding:'28px 20px', borderRadius:20,
                  background:'linear-gradient(160deg,rgba(6,6,24,0.98),rgba(4,4,18,0.96))',
                  border:'1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:900, fontSize:'clamp(2rem,4vw,3rem)', letterSpacing:'-0.05em', lineHeight:1, marginBottom:6 }} className="text-gradient">{value}</div>
                <div style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700, fontSize:13, color:'rgba(200,215,235,0.7)', marginBottom:3 }}>{label}</div>
                <div style={{ fontFamily:'Inter,sans-serif', fontSize:10.5, color:'rgba(140,160,190,0.38)', letterSpacing:'0.06em' }}>{sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ WHAT'S COMING ══════════════════ */}
      <section style={{ padding:'0 24px 100px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>

          <motion.div
            initial={{ opacity:0, y:24 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.65 }}
            style={{ textAlign:'center', marginBottom:52 }}
          >
            <span style={{ fontFamily:'Inter,sans-serif', fontSize:9.5, fontWeight:700, letterSpacing:'0.28em', textTransform:'uppercase', color:'rgba(0,212,255,0.55)', display:'block', marginBottom:14 }}>What GRID Projects will cover</span>
            <h2 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:'clamp(1.6rem,3.5vw,2.4rem)', letterSpacing:'-0.04em', color:'#f0f6ff', marginBottom:14, lineHeight:1.15 }}>
              Every layer of the ML stack,<br />
              <span className="text-gradient">built in the open.</span>
            </h2>
            <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:15.5, color:'rgba(160,180,210,0.65)', maxWidth:540, margin:'0 auto', lineHeight:1.72 }}>
              From research reproductions to production-grade tooling — the categories that define where the community is building.
            </p>
          </motion.div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:16 }}>
            {CATEGORIES.map((cat, i) => (
              <CategoryCard key={cat.title} {...cat} delay={i * 0.09} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ BOTTOM CTA ══════════════════ */}
      <section style={{ position:'relative', padding:'80px 24px 120px', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,52,204,0.13) 0%, transparent 65%), #02020e' }} />

        {/* animated corner orbs */}
        <motion.div animate={{ x:[-20,20,-20], y:[-15,15,-15] }} transition={{ duration:9, repeat:Infinity, ease:'easeInOut' }}
          style={{ position:'absolute', top:'10%', left:'5%', width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle,rgba(0,102,255,0.12) 0%,transparent 70%)', filter:'blur(70px)', pointerEvents:'none' }} />
        <motion.div animate={{ x:[20,-20,20], y:[15,-15,15] }} transition={{ duration:12, repeat:Infinity, ease:'easeInOut', delay:3 }}
          style={{ position:'absolute', bottom:'10%', right:'5%', width:360, height:360, borderRadius:'50%', background:'radial-gradient(circle,rgba(123,47,255,0.12) 0%,transparent 70%)', filter:'blur(80px)', pointerEvents:'none' }} />

        <div className="grid-line-bg absolute inset-0 opacity-10" />

        <motion.div
          initial={{ opacity:0, scale:0.95 }}
          whileInView={{ opacity:1, scale:1 }}
          viewport={{ once:true }}
          transition={{ duration:0.7, ease:'easeOut' }}
          style={{ maxWidth:680, margin:'0 auto', textAlign:'center', position:'relative', zIndex:1 }}
        >
          {/* animated icon cluster */}
          <div style={{ position:'relative', width:80, height:80, margin:'0 auto 28px' }}>
            <motion.div
              animate={{ rotate:360 }}
              transition={{ duration:18, repeat:Infinity, ease:'linear' }}
              style={{ position:'absolute', inset:0, borderRadius:'50%', border:'1px solid rgba(0,212,255,0.15)', borderTopColor:'rgba(0,212,255,0.5)' }}
            />
            <motion.div
              animate={{ rotate:-360 }}
              transition={{ duration:10, repeat:Infinity, ease:'linear' }}
              style={{ position:'absolute', inset:8, borderRadius:'50%', border:'1px dashed rgba(123,47,255,0.2)', borderRightColor:'rgba(123,47,255,0.5)' }}
            />
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <GitBranch style={{ width:28, height:28, color:'#00d4ff' }} />
            </div>
          </div>

          <h2 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:'clamp(1.8rem,4vw,2.8rem)', letterSpacing:'-0.04em', lineHeight:1.1, color:'#f0f6ff', marginBottom:16 }}>
            The first project here<br/>
            <span className="text-gradient">will set the standard.</span>
          </h2>
          <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:16, color:'rgba(170,186,210,0.72)', lineHeight:1.72, marginBottom:40, maxWidth:500, margin:'0 auto 40px' }}>
            Join GRID and publish your ML project to 12,000 researchers, engineers, and builders who are ready to use it, star it, and contribute.
          </p>

          <div style={{ display:'flex', flexWrap:'wrap', gap:12, justifyContent:'center' }}>
            <motion.button
              onClick={() => navigate('/register')}
              whileHover={{ scale:1.04, boxShadow:'0 8px 40px rgba(0,102,255,0.5)' }}
              whileTap={{ scale:0.97 }}
              style={{ display:'flex', alignItems:'center', gap:9, padding:'16px 36px', borderRadius:14, border:'none', cursor:'pointer', background:'linear-gradient(135deg,#0052cc,#00d4ff)', color:'#fff', fontSize:15, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, boxShadow:'0 6px 32px rgba(0,102,255,0.38)', letterSpacing:'-0.01em' }}
            >
              <Rocket style={{ width:16, height:16 }} /> Publish Your Work
            </motion.button>
            <motion.button
              onClick={() => navigate('/about')}
              whileHover={{ scale:1.04 }}
              whileTap={{ scale:0.97 }}
              style={{ display:'flex', alignItems:'center', gap:9, padding:'16px 32px', borderRadius:14, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.04)', cursor:'pointer', color:'rgba(200,215,235,0.75)', fontSize:15, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700, backdropFilter:'blur(12px)' }}
            >
              Learn about GRID <ArrowRight style={{ width:15, height:15 }} />
            </motion.button>
          </div>
        </motion.div>
      </section>

    </div>
  )
}
