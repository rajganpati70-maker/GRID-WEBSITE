import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Send, Loader2, AlertCircle, MessageSquare,
  Bold, Italic, Code2, Quote, List, Link2, Eye, EyeOff
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const CATS = ['LLMs', 'Research Papers', 'Training', 'Fine-tuning', 'RL', 'Computer Vision', 'MLOps', 'General']
const CAT_COLORS = {
  'LLMs':            { color:'#00d4ff', bg:'rgba(0,212,255,0.12)', border:'rgba(0,212,255,0.35)' },
  'Research Papers': { color:'#a78bfa', bg:'rgba(167,139,250,0.12)', border:'rgba(167,139,250,0.35)' },
  'Training':        { color:'#4ade80', bg:'rgba(74,222,128,0.12)', border:'rgba(74,222,128,0.35)' },
  'Fine-tuning':     { color:'#fbbf24', bg:'rgba(251,191,36,0.12)', border:'rgba(251,191,36,0.35)' },
  'RL':              { color:'#60a5fa', bg:'rgba(96,165,250,0.12)', border:'rgba(96,165,250,0.35)' },
  'Computer Vision': { color:'#f472b6', bg:'rgba(244,114,182,0.12)', border:'rgba(244,114,182,0.35)' },
  'MLOps':           { color:'#f97316', bg:'rgba(249,115,22,0.12)', border:'rgba(249,115,22,0.35)' },
  'General':         { color:'#94a3b8', bg:'rgba(148,163,184,0.12)', border:'rgba(148,163,184,0.35)' },
}
function catMeta(c) { return CAT_COLORS[c] || CAT_COLORS['General'] }

/* ── Toolbar insert helpers ── */
function insertAtCursor(textarea, before, after = '') {
  const start = textarea.selectionStart
  const end   = textarea.selectionEnd
  const sel   = textarea.value.slice(start, end)
  const val   = textarea.value.slice(0, start) + before + sel + after + textarea.value.slice(end)
  return { val, cursor: start + before.length + sel.length + after.length }
}

export default function NewThreadModal({ onClose, onCreated }) {
  const { token } = useAuth()
  const navigate  = useNavigate()
  const textareaRef = useRef(null)
  const [title,    setTitle]    = useState('')
  const [content,  setContent]  = useState('')
  const [category, setCategory] = useState('LLMs')
  const [posting,  setPosting]  = useState(false)
  const [error,    setError]    = useState('')
  const [preview,  setPreview]  = useState(false)

  const cm = catMeta(category)

  /* Markdown toolbar */
  const applyFormat = (before, after = '') => {
    const ta = textareaRef.current
    if (!ta) return
    const { val, cursor } = insertAtCursor(ta, before, after)
    setContent(val)
    setTimeout(() => { ta.focus(); ta.setSelectionRange(cursor, cursor) }, 0)
  }

  /* Simple markdown → HTML renderer for preview */
  const renderMd = (md) => {
    let h = md
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/```([\s\S]*?)```/g, (_,c) => `<pre style="background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:16px;font-family:monospace;font-size:13px;color:#a5f3fc;overflow-x:auto;margin:12px 0;white-space:pre-wrap;">${c.trim()}</pre>`)
      .replace(/`([^`]+)`/g,'<code style="background:rgba(0,0,0,0.35);padding:2px 6px;border-radius:4px;font-family:monospace;font-size:0.88em;color:#7dd3fc;">$1</code>')
      .replace(/^&gt; (.+)$/gm,'<blockquote style="border-left:3px solid rgba(0,212,255,0.5);margin:12px 0;padding:10px 18px;background:rgba(0,212,255,0.04);border-radius:0 8px 8px 0;color:rgba(200,215,235,0.75);font-style:italic;">$1</blockquote>')
      .replace(/\*\*(.+?)\*\*/g,'<strong style="color:#e8eef8;font-weight:700;">$1</strong>')
      .replace(/\*(.+?)\*/g,'<em>$1</em>')
      .replace(/\n/g,'<br/>')
    return h
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) { setError('Title and content are required'); return }
    if (title.length < 10) { setError('Title must be at least 10 characters'); return }
    setPosting(true); setError('')
    try {
      const res = await axios.post('/api/forum', { title: title.trim(), content: content.trim(), category }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      onCreated?.(res.data)
      onClose?.()
      navigate(`/forum/${res.data.id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post thread')
    } finally { setPosting(false) }
  }

  const remaining = 5000 - content.length
  const pct = Math.min(100, (content.length / 5000) * 100)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
        style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.82)', backdropFilter:'blur(10px)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}
        onClick={e => e.target === e.currentTarget && onClose?.()}
      >
        <motion.div
          initial={{ scale:0.93, opacity:0, y:24 }}
          animate={{ scale:1, opacity:1, y:0 }}
          exit={{ scale:0.93, opacity:0, y:24 }}
          transition={{ type:'spring', damping:28, stiffness:320 }}
          style={{
            width:'100%', maxWidth:700, maxHeight:'92vh', overflowY:'auto',
            background:'linear-gradient(160deg,rgba(6,6,22,0.99),rgba(3,3,14,0.98))',
            border:'1px solid rgba(255,255,255,0.07)',
            borderRadius:22, boxShadow:'0 0 80px rgba(0,102,255,0.12), 0 40px 100px rgba(0,0,0,0.7)',
          }}
        >
          {/* ── Header ── */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 24px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:'rgba(0,212,255,0.1)', border:'1px solid rgba(0,212,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <MessageSquare style={{ width:16, height:16, color:'#00d4ff' }} />
              </div>
              <div>
                <div style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:15, color:'#f0f6ff', letterSpacing:'-0.02em' }}>Start a Discussion</div>
                <div style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:11, color:'rgba(140,160,190,0.5)', marginTop:1 }}>Share your thoughts with the GRID ML community</div>
              </div>
            </div>
            <button onClick={onClose} style={{ width:32, height:32, borderRadius:8, border:'1px solid rgba(255,255,255,0.07)', background:'transparent', cursor:'pointer', color:'rgba(140,160,190,0.5)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <X style={{ width:15, height:15 }} />
            </button>
          </div>

          <form onSubmit={submit} style={{ padding:'22px 24px 24px', display:'flex', flexDirection:'column', gap:20 }}>

            {/* ── Category ── */}
            <div>
              <label style={{ display:'block', fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:10.5, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(140,160,190,0.5)', marginBottom:10 }}>Category</label>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {CATS.map(c => {
                  const m = catMeta(c); const active = c === category
                  return (
                    <button key={c} type="button" onClick={() => setCategory(c)} style={{
                      padding:'6px 14px', borderRadius:100, border:`1px solid ${active ? m.border : 'rgba(255,255,255,0.07)'}`,
                      background: active ? m.bg : 'transparent', color: active ? m.color : 'rgba(120,140,170,0.55)',
                      fontSize:11, fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase',
                      fontFamily:'"Plus Jakarta Sans",sans-serif', cursor:'pointer', transition:'all 0.18s',
                    }}>{c}</button>
                  )
                })}
              </div>
            </div>

            {/* ── Title ── */}
            <div>
              <label style={{ display:'block', fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:10.5, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(140,160,190,0.5)', marginBottom:8 }}>
                Title <span style={{ color:'rgba(100,120,150,0.5)', textTransform:'none', letterSpacing:0 }}>({title.length}/500)</span>
              </label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value.slice(0, 500))}
                placeholder="What's your question, insight, or discussion topic?"
                style={{
                  width:'100%', boxSizing:'border-box', padding:'12px 16px', borderRadius:12,
                  background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)',
                  color:'#e8eef8', fontSize:14.5, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:600,
                  outline:'none', transition:'border-color 0.2s',
                  letterSpacing:'-0.01em',
                }}
                onFocus={e=>e.target.style.borderColor='rgba(0,212,255,0.35)'}
                onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.08)'}
              />
            </div>

            {/* ── Content ── */}
            <div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                <label style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:10.5, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(140,160,190,0.5)' }}>
                  Content
                </label>
                <button type="button" onClick={() => setPreview(p => !p)} style={{ display:'flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:7, border:'1px solid rgba(255,255,255,0.07)', background:'transparent', cursor:'pointer', color:'rgba(140,160,190,0.55)', fontSize:11, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:600 }}>
                  {preview ? <><EyeOff style={{ width:11, height:11 }} /> Edit</> : <><Eye style={{ width:11, height:11 }} /> Preview</>}
                </button>
              </div>

              {/* Markdown toolbar */}
              {!preview && (
                <div style={{ display:'flex', gap:2, padding:'6px 8px', borderRadius:'10px 10px 0 0', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderBottom:'none', flexWrap:'wrap' }}>
                  {[
                    { label:<Bold style={{width:13,height:13}}/>, title:'Bold', action: ()=>applyFormat('**','**') },
                    { label:<Italic style={{width:13,height:13}}/>, title:'Italic', action: ()=>applyFormat('*','*') },
                    { label:<Code2 style={{width:13,height:13}}/>, title:'Inline code', action: ()=>applyFormat('`','`') },
                    { label:<span style={{fontSize:11,fontWeight:800}}>```</span>, title:'Code block', action: ()=>applyFormat('```\n','\n```') },
                    { label:<Quote style={{width:13,height:13}}/>, title:'Blockquote', action: ()=>applyFormat('> ') },
                    { label:<List style={{width:13,height:13}}/>, title:'Bullet list', action: ()=>applyFormat('- ') },
                    { label:<Link2 style={{width:13,height:13}}/>, title:'Link', action: ()=>applyFormat('[','](url)') },
                  ].map(({ label, title, action }, i) => (
                    <button key={i} type="button" title={title} onClick={action}
                      style={{ display:'flex', alignItems:'center', justifyContent:'center', width:30, height:28, borderRadius:6, border:'none', background:'transparent', cursor:'pointer', color:'rgba(140,160,190,0.65)', transition:'all 0.15s' }}
                      onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.07)';e.currentTarget.style.color='#e8eef8'}}
                      onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='rgba(140,160,190,0.65)'}}
                    >{label}</button>
                  ))}
                  <div style={{ marginLeft:'auto', fontSize:10, color:'rgba(100,120,150,0.55)', fontFamily:'"Plus Jakarta Sans",sans-serif', display:'flex', alignItems:'center', paddingRight:4 }}>
                    Markdown supported
                  </div>
                </div>
              )}

              {preview ? (
                <div
                  style={{ padding:'16px', borderRadius:12, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', minHeight:180, fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:14.5, lineHeight:1.75, color:'rgba(200,215,235,0.82)' }}
                  dangerouslySetInnerHTML={{ __html: content ? renderMd(content) : '<span style="color:rgba(120,140,170,0.4)">Nothing to preview…</span>' }}
                />
              ) : (
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={e => setContent(e.target.value.slice(0, 5000))}
                  placeholder="Share your thoughts, experiments, questions, or findings. Markdown is supported — use **bold**, *italic*, ```code blocks```, and > quotes."
                  rows={10}
                  style={{
                    width:'100%', boxSizing:'border-box', padding:'14px 16px',
                    borderRadius: '0 0 12px 12px',
                    background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
                    color:'rgba(210,225,240,0.88)', fontSize:14, fontFamily:'"Plus Jakarta Sans",sans-serif',
                    lineHeight:1.7, outline:'none', resize:'vertical', minHeight:180,
                  }}
                  onFocus={e=>e.target.style.borderColor='rgba(0,212,255,0.25)'}
                  onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.07)'}
                />
              )}

              {/* Character counter */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:8, marginTop:6 }}>
                <div style={{ flex:1, height:2, borderRadius:2, background:'rgba(255,255,255,0.05)', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${pct}%`, borderRadius:2, background: pct > 90 ? '#f87171' : pct > 70 ? '#fbbf24' : 'rgba(0,212,255,0.5)', transition:'width 0.3s, background 0.3s' }} />
                </div>
                <span style={{ fontSize:10.5, color: remaining < 500 ? '#fbbf24' : 'rgba(120,140,170,0.5)', fontFamily:'"Plus Jakarta Sans",sans-serif' }}>
                  {remaining.toLocaleString()} left
                </span>
              </div>
            </div>

            {/* ── Error ── */}
            {error && (
              <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', borderRadius:10, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171', fontSize:13, fontFamily:'"Plus Jakarta Sans",sans-serif' }}>
                <AlertCircle style={{ width:14, height:14, flexShrink:0 }} /> {error}
              </div>
            )}

            {/* ── Footer ── */}
            <div style={{ display:'flex', gap:10, paddingTop:4 }}>
              <button type="button" onClick={onClose} style={{ flex:1, padding:'12px', borderRadius:12, border:'1px solid rgba(255,255,255,0.08)', background:'transparent', cursor:'pointer', color:'rgba(140,160,190,0.65)', fontSize:13, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:600 }}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={posting || !title.trim() || !content.trim()}
                style={{
                  flex:2, padding:'12px', borderRadius:12, border:'none', cursor: posting ? 'not-allowed' : 'pointer',
                  background: `linear-gradient(135deg,${cm.color}cc,${cm.color})`,
                  color:'#fff', fontSize:13, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700,
                  display:'flex', alignItems:'center', justifyContent:'center', gap:7,
                  opacity: (posting || !title.trim() || !content.trim()) ? 0.55 : 1,
                  transition:'opacity 0.2s',
                  boxShadow:`0 4px 24px ${cm.color}25`,
                }}
              >
                {posting
                  ? <><Loader2 style={{ width:14, height:14, animation:'spin 1s linear infinite' }} /> Posting…</>
                  : <><Send style={{ width:14, height:14 }} /> Post to Forum</>
                }
              </button>
            </div>

            <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:11, color:'rgba(100,120,150,0.45)', textAlign:'center', margin:0 }}>
              Be respectful. Share knowledge. Cite your sources.
            </p>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
