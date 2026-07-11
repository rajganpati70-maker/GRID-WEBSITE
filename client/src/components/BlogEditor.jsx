import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Bold, Italic, Heading2, Heading3, Quote, Code2,
  List, ListOrdered, Minus, Link2, Image, Eye, EyeOff,
  Loader2, CheckCircle, Tag, ChevronDown, AlertCircle
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const CATS = ['LLMs', 'Research Papers', 'MLOps', 'Training', 'Fine-tuning', 'Computer Vision', 'RL', 'General']
const CAT_COLORS = {
  'LLMs':            { color:'#00d4ff', bg:'rgba(0,212,255,0.12)', border:'rgba(0,212,255,0.35)' },
  'Research Papers': { color:'#a78bfa', bg:'rgba(167,139,250,0.12)', border:'rgba(167,139,250,0.35)' },
  'MLOps':           { color:'#4ade80', bg:'rgba(74,222,128,0.12)', border:'rgba(74,222,128,0.35)' },
  'Training':        { color:'#fbbf24', bg:'rgba(251,191,36,0.12)', border:'rgba(251,191,36,0.35)' },
  'Fine-tuning':     { color:'#f97316', bg:'rgba(249,115,22,0.12)', border:'rgba(249,115,22,0.35)' },
  'Computer Vision': { color:'#f472b6', bg:'rgba(244,114,182,0.12)', border:'rgba(244,114,182,0.35)' },
  'RL':              { color:'#60a5fa', bg:'rgba(96,165,250,0.12)', border:'rgba(96,165,250,0.35)' },
  'General':         { color:'#94a3b8', bg:'rgba(148,163,184,0.12)', border:'rgba(148,163,184,0.35)' },
}
function catMeta(c) { return CAT_COLORS[c] || CAT_COLORS['General'] }

function getReadTime(html) {
  const text = (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const words = text.split(' ').filter(Boolean).length
  return { words, mins: Math.max(1, Math.ceil(words / 200)) }
}

/* ── Toolbar button ── */
function ToolBtn({ title, onClick, children, active }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={e => { e.preventDefault(); onClick() }}
      style={{
        display:'flex', alignItems:'center', justifyContent:'center',
        width:32, height:32, borderRadius:6, border:'none', cursor:'pointer',
        background: active ? 'rgba(0,212,255,0.15)' : 'transparent',
        color: active ? '#00d4ff' : 'rgba(160,180,210,0.7)',
        transition:'all 0.15s ease',
        flexShrink:0,
      }}
      onMouseEnter={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.color='#e8eef8' }}
      onMouseLeave={e=>{ e.currentTarget.style.background=active?'rgba(0,212,255,0.15)':'transparent'; e.currentTarget.style.color=active?'#00d4ff':'rgba(160,180,210,0.7)' }}
    >
      {children}
    </button>
  )
}

function ToolDivider() {
  return <div style={{ width:1, height:20, background:'rgba(255,255,255,0.07)', margin:'0 4px', flexShrink:0 }} />
}

/* ── Main editor ── */
export default function BlogEditor({ onClose, onPublished }) {
  const { token, user } = useAuth()
  const editorRef = useRef(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('LLMs')
  const [coverUrl, setCoverUrl] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState([])
  const [preview, setPreview] = useState(false)
  const [htmlContent, setHtmlContent] = useState('')
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [imgUrl, setImgUrl] = useState('')
  const [showImgInput, setShowImgInput] = useState(false)
  const savedRange = useRef(null)

  /* Sync HTML from editor */
  const syncHtml = useCallback(() => {
    if (editorRef.current) setHtmlContent(editorRef.current.innerHTML)
  }, [])

  /* Save cursor position before toolbar button click */
  const saveRange = () => {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) savedRange.current = sel.getRangeAt(0).cloneRange()
  }

  /* Restore cursor */
  const restoreRange = () => {
    const sel = window.getSelection()
    if (savedRange.current && sel) {
      sel.removeAllRanges()
      sel.addRange(savedRange.current)
    }
  }

  const exec = (cmd, val = null) => {
    restoreRange()
    document.execCommand(cmd, false, val)
    editorRef.current?.focus()
    syncHtml()
  }

  const insertBlock = (tag) => {
    restoreRange()
    document.execCommand('formatBlock', false, tag)
    editorRef.current?.focus()
    syncHtml()
  }

  const insertHr = () => {
    restoreRange()
    const hr = document.createElement('hr')
    hr.style.cssText = 'border:none;border-top:1px solid rgba(255,255,255,0.1);margin:28px 0;'
    const sel = window.getSelection()
    if (sel?.rangeCount) {
      const r = sel.getRangeAt(0)
      r.collapse(false)
      r.insertNode(hr)
      r.setStartAfter(hr); r.collapse(true)
      sel.removeAllRanges(); sel.addRange(r)
    }
    editorRef.current?.focus()
    syncHtml()
  }

  const insertCodeBlock = () => {
    restoreRange()
    const sel = window.getSelection()
    const selected = sel?.toString() || ''
    const pre = document.createElement('pre')
    pre.style.cssText = 'background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:18px 20px;font-family:"Fira Code",monospace;font-size:13px;color:#a5f3fc;overflow-x:auto;margin:16px 0;white-space:pre-wrap;'
    pre.setAttribute('contenteditable', 'false')
    const code = document.createElement('code')
    code.textContent = selected || 'paste your code here'
    pre.appendChild(code)
    if (sel?.rangeCount) {
      const r = sel.getRangeAt(0)
      r.deleteContents()
      r.insertNode(pre)
      r.setStartAfter(pre); r.collapse(true)
      sel.removeAllRanges(); sel.addRange(r)
    }
    editorRef.current?.focus()
    syncHtml()
  }

  const insertLink = () => {
    if (!linkUrl.trim()) return
    exec('createLink', linkUrl.trim())
    setLinkUrl(''); setShowLinkInput(false)
  }

  const insertImage = () => {
    if (!imgUrl.trim()) return
    restoreRange()
    const fig = document.createElement('figure')
    fig.style.cssText = 'margin:24px 0;text-align:center;'
    const img = document.createElement('img')
    img.src = imgUrl.trim()
    img.alt = 'Article image'
    img.style.cssText = 'max-width:100%;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.5);'
    fig.appendChild(img)
    const sel = window.getSelection()
    if (sel?.rangeCount) {
      const r = sel.getRangeAt(0); r.collapse(false)
      r.insertNode(fig); r.setStartAfter(fig); r.collapse(true)
      sel.removeAllRanges(); sel.addRange(r)
    }
    editorRef.current?.focus()
    setImgUrl(''); setShowImgInput(false)
    syncHtml()
  }

  const addTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault()
      const t = tagInput.trim().replace(/,$/, '')
      if (t && !tags.includes(t) && tags.length < 8) setTags(prev => [...prev, t])
      setTagInput('')
    }
    if (e.key === 'Backspace' && !tagInput && tags.length) setTags(prev => prev.slice(0, -1))
  }

  const publish = async () => {
    if (!title.trim()) { setError('Title is required'); return }
    const body = editorRef.current?.innerHTML || ''
    if (!body.trim() || body === '<br>') { setError('Write something first'); return }
    if (!user) { setError('You must be logged in to publish'); return }
    setPublishing(true); setError('')
    try {
      const { createBlogPost } = await import('../data/store')
      const post = createBlogPost({
        title: title.trim(), content: body, category, tags, cover_image: coverUrl,
        author: user.username, read_time: `${Math.max(1, Math.ceil(body.replace(/<[^>]*>/g,' ').split(' ').filter(Boolean).length / 200))} min`,
      })
      setSuccess(true)
      setTimeout(() => { onPublished?.(post); onClose?.() }, 1200)
    } catch (err) {
      setError(err.message || 'Failed to publish. Try again.')
    } finally { setPublishing(false) }
  }

  const { words, mins } = getReadTime(htmlContent)
  const cm = catMeta(category)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
        style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.88)', backdropFilter:'blur(8px)', display:'flex', flexDirection:'column' }}
      >
        {/* ── Top bar ── */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 24px', borderBottom:'1px solid rgba(255,255,255,0.06)', background:'rgba(2,2,14,0.95)', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={onClose} style={{ display:'flex', alignItems:'center', justifyContent:'center', width:34, height:34, borderRadius:8, border:'1px solid rgba(255,255,255,0.08)', background:'transparent', cursor:'pointer', color:'rgba(160,180,210,0.6)' }}>
              <X style={{ width:16, height:16 }} />
            </button>
            <span style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700, fontSize:14, color:'rgba(160,180,210,0.7)', letterSpacing:'-0.01em' }}>
              Write for GRID
            </span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ fontSize:11, color:'rgba(140,160,190,0.4)', fontFamily:'"Plus Jakarta Sans",sans-serif' }}>
              {words > 0 && `${words.toLocaleString()} words · ~${mins} min read`}
            </div>
            <button
              onClick={() => setPreview(p => !p)}
              style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:9, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', cursor:'pointer', color:'rgba(160,180,210,0.7)', fontSize:12, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:600 }}
            >
              {preview ? <EyeOff style={{ width:13, height:13 }} /> : <Eye style={{ width:13, height:13 }} />}
              {preview ? 'Edit' : 'Preview'}
            </button>
            {success ? (
              <div style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 20px', borderRadius:10, background:'rgba(74,222,128,0.15)', border:'1px solid rgba(74,222,128,0.3)', color:'#4ade80', fontSize:13, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700 }}>
                <CheckCircle style={{ width:14, height:14 }} /> Published!
              </div>
            ) : (
              <button
                onClick={publish}
                disabled={publishing}
                style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 22px', borderRadius:10, border:'none', cursor: publishing ? 'not-allowed' : 'pointer', background:'linear-gradient(135deg,#0052cc,#00d4ff)', color:'#fff', fontSize:13, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700, opacity: publishing ? 0.7 : 1 }}
              >
                {publishing ? <><Loader2 style={{ width:13, height:13, animation:'spin 1s linear infinite' }} /> Publishing…</> : 'Publish →'}
              </button>
            )}
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ flex:1, overflow:'auto', display:'flex', justifyContent:'center', padding:'0 16px 60px' }}>
          <div style={{ width:'100%', maxWidth:740, paddingTop:40 }}>

            {/* Meta row */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:28, alignItems:'center' }}>
              {/* Category */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {CATS.map(c => {
                  const m = catMeta(c); const active = c === category
                  return (
                    <button key={c} onClick={() => setCategory(c)} type="button" style={{
                      padding:'5px 13px', borderRadius:100, border:`1px solid ${active ? m.border : 'rgba(255,255,255,0.07)'}`,
                      background: active ? m.bg : 'transparent', color: active ? m.color : 'rgba(120,140,170,0.6)',
                      fontSize:10.5, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase',
                      fontFamily:'"Plus Jakarta Sans",sans-serif', cursor:'pointer', transition:'all 0.18s'
                    }}>{c}</button>
                  )
                })}
              </div>
            </div>

            {/* Cover image */}
            <div style={{ marginBottom:22 }}>
              <input
                type="url"
                value={coverUrl}
                onChange={e => setCoverUrl(e.target.value)}
                placeholder="Cover image URL (optional) — paste a direct image link"
                style={{ width:'100%', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'10px 16px', color:'rgba(160,180,210,0.8)', fontSize:13, fontFamily:'"Plus Jakarta Sans",sans-serif', outline:'none', boxSizing:'border-box' }}
              />
              {coverUrl && (
                <img src={coverUrl} alt="cover" onError={e=>e.target.style.display='none'} style={{ marginTop:12, width:'100%', maxHeight:280, objectFit:'cover', borderRadius:14, border:'1px solid rgba(255,255,255,0.06)' }} />
              )}
            </div>

            {/* Title */}
            <textarea
              value={title}
              onChange={e => setTitle(e.target.value.slice(0, 255))}
              placeholder="Tell your story…"
              maxLength={255}
              rows={2}
              style={{
                width:'100%', background:'transparent', border:'none', outline:'none', resize:'none',
                fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:'clamp(1.8rem,4vw,2.6rem)',
                color:'#f0f6ff', letterSpacing:'-0.04em', lineHeight:1.2, marginBottom:6,
                boxSizing:'border-box', overflow:'hidden',
              }}
            />
            <div style={{ height:1, background:'linear-gradient(90deg,rgba(0,212,255,0.18),transparent)', marginBottom:24 }} />

            {/* Error */}
            {error && (
              <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', borderRadius:10, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171', fontSize:13, fontFamily:'"Plus Jakarta Sans",sans-serif', marginBottom:16 }}>
                <AlertCircle style={{ width:14, height:14, flexShrink:0 }} /> {error}
              </div>
            )}

            {preview ? (
              /* ── Preview ── */
              <div
                dangerouslySetInnerHTML={{ __html: htmlContent || '<p style="color:rgba(140,160,190,0.4)">Nothing to preview yet…</p>' }}
                style={{
                  fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:17, lineHeight:1.8, color:'rgba(220,230,245,0.88)',
                  minHeight:320,
                }}
                className="blog-reader-content"
              />
            ) : (
              /* ── Editor ── */
              <div>
                {/* Toolbar */}
                <div style={{
                  display:'flex', alignItems:'center', gap:2, padding:'6px 8px', borderRadius:10, marginBottom:12,
                  background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)',
                  flexWrap:'wrap', position:'sticky', top:12, zIndex:10, backdropFilter:'blur(12px)',
                }}>
                  <ToolBtn title="Bold (Ctrl+B)" onClick={() => exec('bold')}><Bold style={{ width:14, height:14 }} /></ToolBtn>
                  <ToolBtn title="Italic (Ctrl+I)" onClick={() => exec('italic')}><Italic style={{ width:14, height:14 }} /></ToolBtn>
                  <ToolDivider />
                  <ToolBtn title="Heading 2" onClick={() => insertBlock('H2')}><Heading2 style={{ width:15, height:15 }} /></ToolBtn>
                  <ToolBtn title="Heading 3" onClick={() => insertBlock('H3')}><Heading3 style={{ width:15, height:15 }} /></ToolBtn>
                  <ToolDivider />
                  <ToolBtn title="Blockquote" onClick={() => insertBlock('BLOCKQUOTE')}><Quote style={{ width:14, height:14 }} /></ToolBtn>
                  <ToolBtn title="Code block" onClick={insertCodeBlock}><Code2 style={{ width:14, height:14 }} /></ToolBtn>
                  <ToolDivider />
                  <ToolBtn title="Bulleted list" onClick={() => exec('insertUnorderedList')}><List style={{ width:14, height:14 }} /></ToolBtn>
                  <ToolBtn title="Numbered list" onClick={() => exec('insertOrderedList')}><ListOrdered style={{ width:14, height:14 }} /></ToolBtn>
                  <ToolDivider />
                  <ToolBtn title="Divider" onClick={insertHr}><Minus style={{ width:14, height:14 }} /></ToolBtn>
                  <ToolDivider />
                  <ToolBtn title="Link" onClick={() => { saveRange(); setShowLinkInput(s => !s); setShowImgInput(false) }}><Link2 style={{ width:14, height:14 }} /></ToolBtn>
                  <ToolBtn title="Image" onClick={() => { saveRange(); setShowImgInput(s => !s); setShowLinkInput(false) }}><Image style={{ width:14, height:14 }} /></ToolBtn>
                </div>

                {/* Link input */}
                {showLinkInput && (
                  <div style={{ display:'flex', gap:8, marginBottom:10 }}>
                    <input value={linkUrl} onChange={e=>setLinkUrl(e.target.value)} onKeyDown={e=>e.key==='Enter'&&insertLink()} placeholder="https://example.com" style={{ flex:1, background:'rgba(0,0,0,0.3)', border:'1px solid rgba(0,212,255,0.25)', borderRadius:8, padding:'7px 12px', color:'#e8eef8', fontSize:13, fontFamily:'"Plus Jakarta Sans",sans-serif', outline:'none' }} />
                    <button onMouseDown={e=>{e.preventDefault();insertLink()}} style={{ padding:'7px 14px', borderRadius:8, border:'none', background:'rgba(0,212,255,0.15)', color:'#00d4ff', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'"Plus Jakarta Sans",sans-serif' }}>Insert</button>
                  </div>
                )}

                {/* Image input */}
                {showImgInput && (
                  <div style={{ display:'flex', gap:8, marginBottom:10 }}>
                    <input value={imgUrl} onChange={e=>setImgUrl(e.target.value)} onKeyDown={e=>e.key==='Enter'&&insertImage()} placeholder="Direct image URL (https://...)" style={{ flex:1, background:'rgba(0,0,0,0.3)', border:'1px solid rgba(0,212,255,0.25)', borderRadius:8, padding:'7px 12px', color:'#e8eef8', fontSize:13, fontFamily:'"Plus Jakarta Sans",sans-serif', outline:'none' }} />
                    <button onMouseDown={e=>{e.preventDefault();insertImage()}} style={{ padding:'7px 14px', borderRadius:8, border:'none', background:'rgba(0,212,255,0.15)', color:'#00d4ff', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'"Plus Jakarta Sans",sans-serif' }}>Insert</button>
                  </div>
                )}

                {/* Content editable */}
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={syncHtml}
                  onMouseUp={saveRange}
                  onKeyUp={saveRange}
                  data-placeholder="Start writing your article… Use the toolbar above to format text, add code blocks, images, and more."
                  style={{
                    minHeight:420, outline:'none', fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:17,
                    lineHeight:1.8, color:'rgba(220,230,245,0.88)', caretColor:'#00d4ff',
                  }}
                  className="blog-editor-body"
                />
              </div>
            )}

            {/* Tags */}
            <div style={{ marginTop:36, paddingTop:24, borderTop:'1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                <Tag style={{ width:13, height:13, color:'rgba(140,160,190,0.5)' }} />
                <span style={{ fontSize:11, color:'rgba(140,160,190,0.5)', fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase' }}>Tags</span>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8, padding:'10px 14px', borderRadius:10, border:'1px solid rgba(255,255,255,0.07)', background:'rgba(255,255,255,0.02)', minHeight:44, alignItems:'center' }}>
                {tags.map(t => (
                  <span key={t} style={{ display:'flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:100, background:'rgba(0,212,255,0.1)', border:'1px solid rgba(0,212,255,0.22)', color:'#00d4ff', fontSize:11.5, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:600 }}>
                    {t}
                    <button onClick={()=>setTags(prev=>prev.filter(x=>x!==t))} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(0,212,255,0.6)', padding:0, lineHeight:1, fontSize:14, display:'flex' }}>×</button>
                  </span>
                ))}
                <input
                  value={tagInput}
                  onChange={e=>setTagInput(e.target.value)}
                  onKeyDown={addTag}
                  placeholder={tags.length < 8 ? 'Add tag, press Enter…' : ''}
                  disabled={tags.length >= 8}
                  style={{ border:'none', background:'transparent', outline:'none', color:'rgba(160,180,210,0.8)', fontSize:13, fontFamily:'"Plus Jakarta Sans",sans-serif', flex:1, minWidth:120 }}
                />
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
