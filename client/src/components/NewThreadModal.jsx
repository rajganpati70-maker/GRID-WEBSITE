import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Loader2, AlertCircle, MessageSquare, Bold, Italic, Code2, Quote, List, Link2, Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createThread } from '../data/store'

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

function insertAtCursor(textarea, before, after = '') {
  const start = textarea.selectionStart
  const end   = textarea.selectionEnd
  const sel   = textarea.value.slice(start, end)
  const val   = textarea.value.slice(0, start) + before + sel + after + textarea.value.slice(end)
  return { val, cursor: start + before.length + sel.length + after.length }
}

export default function NewThreadModal({ onClose, onCreated }) {
  const { user } = useAuth()
  const navigate  = useNavigate()
  const textareaRef = useRef(null)
  const [title,    setTitle]    = useState('')
  const [content,  setContent]  = useState('')
  const [category, setCategory] = useState('LLMs')
  const [posting,  setPosting]  = useState(false)
  const [error,    setError]    = useState('')
  const [preview,  setPreview]  = useState(false)

  const cm = catMeta(category)

  const applyFormat = (before, after = '') => {
    const ta = textareaRef.current
    if (!ta) return
    const { val, cursor } = insertAtCursor(ta, before, after)
    setContent(val)
    setTimeout(() => { ta.focus(); ta.setSelectionRange(cursor, cursor) }, 0)
  }

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

  const submit = (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) { setError('Title and content are required'); return }
    if (title.length < 10) { setError('Title must be at least 10 characters'); return }
    if (!user) { setError('You must be logged in to post'); return }
    setPosting(true); setError('')
    try {
      const thread = createThread({
        title: title.trim(),
        content: content.trim(),
        excerpt: content.trim().replace(/[#*`>]/g, '').slice(0, 160),
        category,
        author: user.username,
      })
      onCreated?.(thread)
      onClose?.()
      navigate(`/forum/${thread.id}`)
    } catch (err) {
      setError(err.message || 'Failed to post thread')
    } finally {
      setPosting(false)
    }
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
          initial={{ scale:0.93, opacity:0, y:24 }} animate={{ scale:1, opacity:1, y:0 }} exit={{ scale:0.93, opacity:0, y:24 }}
          transition={{ type:'spring', damping:28, stiffness:320 }}
          style={{ width:'100%', maxWidth:700, maxHeight:'92vh', overflowY:'auto', background:'linear-gradient(160deg,rgba(6,6,22,0.99),rgba(3,3,14,0.98))', border:'1px solid rgba(255,255,255,0.07)', borderRadius:22, boxShadow:'0 0 80px rgba(0,102,255,0.12), 0 40px 100px rgba(0,0,0,0.7)' }}
        >
          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px 0', marginBottom:20 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:'rgba(0,212,255,0.1)', border:'1px solid rgba(0,212,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <MessageSquare style={{ width:16, height:16, color:'#00d4ff' }} />
              </div>
              <div>
                <div style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:15, color:'#f0f6ff', letterSpacing:'-0.01em' }}>Start a Discussion</div>
                <div style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:11, color:'rgba(140,160,190,0.5)', marginTop:1 }}>Share ideas, ask questions, spark debate</div>
              </div>
            </div>
            <button onClick={onClose} style={{ width:32, height:32, borderRadius:9, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'rgba(160,180,210,0.6)' }}>
              <X style={{ width:14, height:14 }} />
            </button>
          </div>

          <form onSubmit={submit} style={{ padding:'0 24px 24px' }}>
            {/* Category */}
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:10, fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(140,160,190,0.45)', marginBottom:8, fontFamily:'"Plus Jakarta Sans",sans-serif' }}>Category</label>
              <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
                {CATS.map(c => {
                  const active = category === c; const m = catMeta(c)
                  return (
                    <button key={c} type="button" onClick={() => setCategory(c)} style={{
                      padding:'6px 13px', borderRadius:9, fontSize:10.5, fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase', fontFamily:'"Plus Jakarta Sans",sans-serif', cursor:'pointer', transition:'all 0.18s',
                      background: active ? m.bg : 'rgba(255,255,255,0.04)',
                      border: active ? `1px solid ${m.border}` : '1px solid rgba(255,255,255,0.07)',
                      color: active ? m.color : 'rgba(140,160,190,0.5)',
                    }}>{c}</button>
                  )
                })}
              </div>
            </div>

            {/* Title */}
            <div style={{ marginBottom:14 }}>
              <input type="text" value={title} onChange={e => setTitle(e.target.value.slice(0, 200))} placeholder="What's your question or topic?" maxLength={200}
                style={{ width:'100%', boxSizing:'border-box', padding:'13px 16px', borderRadius:12, background:'rgba(255,255,255,0.04)', border:`1px solid ${cm.border}`, color:'#f0f6ff', fontSize:15, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:600, outline:'none' }}
                onFocus={e=>e.target.style.borderColor=cm.color+'66'} onBlur={e=>e.target.style.borderColor=cm.border}
              />
              <div style={{ display:'flex', justifyContent:'flex-end', marginTop:4, fontSize:10.5, color:'rgba(140,160,190,0.35)', fontFamily:'"Plus Jakarta Sans",sans-serif' }}>{title.length}/200</div>
            </div>

            {/* Toolbar */}
            <div style={{ display:'flex', alignItems:'center', gap:2, padding:'8px 10px', background:'rgba(255,255,255,0.03)', borderRadius:'12px 12px 0 0', border:'1px solid rgba(255,255,255,0.07)', borderBottom:'none', flexWrap:'wrap' }}>
              {[
                { Icon:Bold,   fn:() => applyFormat('**','**'), title:'Bold' },
                { Icon:Italic, fn:() => applyFormat('*','*'),   title:'Italic' },
                { Icon:Code2,  fn:() => applyFormat('`','`'),   title:'Inline code' },
              ].map(({ Icon, fn, title }) => (
                <button key={title} type="button" title={title} onClick={fn}
                  style={{ width:30, height:30, borderRadius:7, background:'transparent', border:'none', cursor:'pointer', color:'rgba(160,180,210,0.6)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon style={{ width:13, height:13 }} />
                </button>
              ))}
              <div style={{ width:1, height:16, background:'rgba(255,255,255,0.08)', margin:'0 3px' }} />
              {[
                { Icon:Quote,  fn:() => applyFormat('\n> '),                         title:'Quote' },
                { Icon:List,   fn:() => applyFormat('\n- '),                         title:'List' },
                { Icon:Code2,  fn:() => applyFormat('\n```\n','\n```'),              title:'Code block', label:'{ }' },
                { Icon:Link2,  fn:() => applyFormat('[link text](','https://)'),     title:'Link' },
              ].map(({ Icon, fn, title, label }) => (
                <button key={title} type="button" title={title} onClick={fn}
                  style={{ width:30, height:30, borderRadius:7, background:'transparent', border:'none', cursor:'pointer', color:'rgba(160,180,210,0.6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:label?10:undefined }}>
                  {label ? label : <Icon style={{ width:13, height:13 }} />}
                </button>
              ))}
              <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:6 }}>
                <button type="button" onClick={() => setPreview(p => !p)}
                  style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 11px', borderRadius:8, background: preview?`${cm.color}15`:'rgba(255,255,255,0.05)', border:`1px solid ${preview?cm.border:'rgba(255,255,255,0.08)'}`, color:preview?cm.color:'rgba(140,160,190,0.6)', cursor:'pointer', fontSize:10.5, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase' }}>
                  {preview ? <EyeOff style={{ width:11, height:11 }} /> : <Eye style={{ width:11, height:11 }} />}
                  {preview ? 'Edit' : 'Preview'}
                </button>
              </div>
            </div>

            {/* Content area */}
            {preview ? (
              <div style={{ minHeight:160, padding:'16px 18px', background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'0 0 12px 12px', color:'rgba(200,215,235,0.88)', fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:14, lineHeight:1.75 }}
                dangerouslySetInnerHTML={{ __html: renderMd(content) }} />
            ) : (
              <textarea ref={textareaRef} value={content} onChange={e => setContent(e.target.value.slice(0,5000))} placeholder="Write your post… markdown is supported" rows={8}
                style={{ width:'100%', boxSizing:'border-box', padding:'14px 16px', background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'0 0 12px 12px', color:'rgba(200,215,235,0.9)', fontSize:14, fontFamily:'"Plus Jakarta Sans",sans-serif', outline:'none', resize:'vertical', lineHeight:1.7 }}
                onFocus={e=>e.target.style.borderColor='rgba(0,212,255,0.2)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.07)'}
              />
            )}

            {/* Character count bar */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', marginTop:5, gap:10 }}>
              <div style={{ flex:1, height:2, background:'rgba(255,255,255,0.06)', borderRadius:1 }}>
                <div style={{ height:'100%', borderRadius:1, background:pct > 90 ? '#f97316' : cm.color, width:`${pct}%`, transition:'width 0.2s' }} />
              </div>
              <span style={{ fontSize:10.5, color: remaining < 200 ? '#f97316' : 'rgba(140,160,190,0.4)', fontFamily:'"Plus Jakarta Sans",sans-serif' }}>{remaining} left</span>
            </div>

            {error && (
              <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', borderRadius:10, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', marginTop:14 }}>
                <AlertCircle style={{ width:14, height:14, color:'#f87171', flexShrink:0 }} />
                <span style={{ fontSize:12.5, color:'#f87171', fontFamily:'"Plus Jakarta Sans",sans-serif' }}>{error}</span>
              </div>
            )}

            <div style={{ display:'flex', gap:10, marginTop:18 }}>
              <button type="button" onClick={onClose} style={{ flex:1, padding:'11px', borderRadius:12, border:'1px solid rgba(255,255,255,0.09)', background:'rgba(255,255,255,0.04)', cursor:'pointer', color:'rgba(160,180,210,0.7)', fontSize:13, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700 }}>
                Cancel
              </button>
              <button type="submit" disabled={posting || !title.trim() || !content.trim()} style={{ flex:2, display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'11px', borderRadius:12, border:'none', cursor:'pointer', background:`linear-gradient(135deg,#0052cc,${cm.color})`, color:'#fff', fontSize:13, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, opacity:(posting||!title.trim()||!content.trim())?0.5:1 }}>
                {posting ? <Loader2 style={{ width:15, height:15, animation:'spin 0.9s linear infinite' }} /> : <Send style={{ width:15, height:15 }} />}
                {posting ? 'Posting…' : 'Post Discussion'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
