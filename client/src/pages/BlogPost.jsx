import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Eye, Heart, Share2, BookOpen, Calendar, User, Tag, Copy, Check } from 'lucide-react'

const CAT_COLORS = {
  'LLMs':            { color:'#00d4ff', bg:'rgba(0,212,255,0.10)', border:'rgba(0,212,255,0.28)' },
  'Research Papers': { color:'#a78bfa', bg:'rgba(167,139,250,0.10)', border:'rgba(167,139,250,0.28)' },
  'MLOps':           { color:'#4ade80', bg:'rgba(74,222,128,0.10)', border:'rgba(74,222,128,0.28)' },
  'Training':        { color:'#fbbf24', bg:'rgba(251,191,36,0.10)', border:'rgba(251,191,36,0.28)' },
  'Fine-tuning':     { color:'#f97316', bg:'rgba(249,115,22,0.10)', border:'rgba(249,115,22,0.28)' },
  'Computer Vision': { color:'#f472b6', bg:'rgba(244,114,182,0.10)', border:'rgba(244,114,182,0.28)' },
  'RL':              { color:'#60a5fa', bg:'rgba(96,165,250,0.10)', border:'rgba(96,165,250,0.28)' },
  'General':         { color:'#94a3b8', bg:'rgba(148,163,184,0.10)', border:'rgba(148,163,184,0.28)' },
}
function catMeta(c) { return CAT_COLORS[c] || CAT_COLORS['General'] }

const GRAD = [
  'linear-gradient(135deg,#0052cc,#00d4ff)',
  'linear-gradient(135deg,#7b2fff,#00d4ff)',
  'linear-gradient(135deg,#ec4899,#7b2fff)',
  'linear-gradient(135deg,#4ade80,#00d4ff)',
  'linear-gradient(135deg,#f59e0b,#ec4899)',
]

function Avatar({ name, color, size = 44 }) {
  const idx = (name?.charCodeAt(0) || 0) % GRAD.length
  return (
    <div style={{ width:size, height:size, borderRadius:size/3, background:color || GRAD[idx], display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:size*0.38, flexShrink:0 }}>
      {name?.[0]?.toUpperCase() || '?'}
    </div>
  )
}

function timeAgo(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })
}

export default function BlogPost() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(0)
  const [copied, setCopied] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    import('../data/store').then(({ getBlogPost }) => {
      const p = getBlogPost(postId)
      if (p) { setPost(p); setLikes(p.likes || 0) }
      else setNotFound(true)
    }).catch(() => setNotFound(true)).finally(() => setLoading(false))
  }, [postId])

  const handleLike = () => {
    if (liked) return
    setLiked(true)
    setLikes(l => l + 1)
    import('../data/store').then(({ likeBlogPost }) => {
      setLikes(likeBlogPost(postId))
    }).catch(() => {})
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div style={{ background:'#02020e', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
        <div style={{ width:40, height:40, border:'2px solid rgba(0,212,255,0.2)', borderTopColor:'#00d4ff', borderRadius:'50%', animation:'spin 0.9s linear infinite' }} />
        <span style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:12, color:'rgba(140,160,190,0.5)', letterSpacing:'0.2em', textTransform:'uppercase' }}>Loading article…</span>
      </div>
    </div>
  )

  if (notFound || !post) return (
    <div style={{ background:'#02020e', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20 }}>
      <BookOpen style={{ width:48, height:48, color:'rgba(0,212,255,0.25)' }} />
      <h2 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:24, color:'#f0f6ff', margin:0 }}>Article not found</h2>
      <button onClick={() => navigate('/blog')} style={{ padding:'10px 24px', borderRadius:10, border:'1px solid rgba(0,212,255,0.25)', background:'transparent', color:'#00d4ff', cursor:'pointer', fontSize:13, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:600 }}>← Back to Blog</button>
    </div>
  )

  const cm = catMeta(post.category)

  return (
    <div style={{ background:'#02020e', minHeight:'100vh' }}>

      {/* Cover image */}
      {post.cover_image && (
        <div style={{ width:'100%', height:420, position:'relative', overflow:'hidden' }}>
          <img src={post.cover_image} alt={post.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>e.target.parentElement.style.display='none'} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, transparent 40%, #02020e 100%)' }} />
        </div>
      )}

      <div style={{ maxWidth:740, margin:'0 auto', padding: post.cover_image ? '0 20px 80px' : '40px 20px 80px' }}>

        {/* Back */}
        <motion.div initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.4 }}>
          <button onClick={() => navigate('/blog')} style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 0', background:'none', border:'none', cursor:'pointer', color:'rgba(140,160,190,0.55)', fontSize:13, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:600, marginBottom:32 }}>
            <ArrowLeft style={{ width:15, height:15 }} /> Back to Blog
          </button>
        </motion.div>

        {/* Article head */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>

          {/* Category + meta badges */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:20 }}>
            <span style={{ background:cm.bg, border:`1px solid ${cm.border}`, color:cm.color, fontSize:10.5, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', padding:'4px 13px', borderRadius:100, fontFamily:'"Plus Jakarta Sans",sans-serif' }}>
              {post.category}
            </span>
            {(post.tags || []).slice(0, 4).map(t => (
              <span key={t} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(140,160,190,0.65)', fontSize:10.5, fontWeight:600, letterSpacing:'0.06em', padding:'4px 12px', borderRadius:100, fontFamily:'"Plus Jakarta Sans",sans-serif' }}>
                #{t}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:'clamp(1.8rem,4.5vw,2.8rem)', letterSpacing:'-0.04em', color:'#f0f6ff', lineHeight:1.15, marginBottom:20, marginTop:0 }}>
            {post.title}
          </h1>

          {/* Author + stats row */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16, paddingBottom:24, borderBottom:'1px solid rgba(255,255,255,0.07)', marginBottom:40 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <Avatar name={post.author} color={post.author_avatar_color} size={44} />
              <div>
                <Link to={`/profile/${post.author}`} style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700, fontSize:14, color:'#e8eef8', textDecoration:'none' }}>
                  @{post.author}
                </Link>
                {post.author_role && (
                  <div style={{ fontSize:11.5, color:'rgba(140,160,190,0.5)', fontFamily:'"Plus Jakarta Sans",sans-serif', marginTop:1 }}>{post.author_role}</div>
                )}
              </div>
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:18, flexWrap:'wrap' }}>
              {[
                { Icon: Calendar, text: timeAgo(post.created_at) },
                { Icon: Clock,    text: `${post.read_time} read` },
                { Icon: Eye,      text: `${(post.views || 0).toLocaleString()} views` },
              ].map(({ Icon, text }) => (
                <div key={text} style={{ display:'flex', alignItems:'center', gap:5, fontSize:12.5, color:'rgba(140,160,190,0.5)', fontFamily:'"Plus Jakarta Sans",sans-serif' }}>
                  <Icon style={{ width:13, height:13 }} /> {text}
                </div>
              ))}
            </div>
          </div>

          {/* Excerpt / intro */}
          {post.excerpt && (
            <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:19, lineHeight:1.7, color:'rgba(200,215,235,0.85)', fontWeight:500, marginBottom:36, letterSpacing:'-0.01em', borderLeft:`3px solid ${cm.color}`, paddingLeft:20 }}>
              {post.excerpt}
            </p>
          )}
        </motion.div>

        {/* ── Article body ── */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2, duration:0.6 }}>
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            className="blog-reader-content"
          />
        </motion.div>

        {/* ── Bottom actions ── */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35, duration:0.5 }}>
          <div style={{ marginTop:56, paddingTop:32, borderTop:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>

            {/* Like */}
            <button
              onClick={handleLike}
              style={{
                display:'flex', alignItems:'center', gap:9, padding:'12px 24px', borderRadius:14,
                border: liked ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.1)',
                background: liked ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.03)',
                color: liked ? '#f87171' : 'rgba(160,180,210,0.7)',
                cursor: 'pointer',
                fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700, fontSize:14,
                transition:'all 0.2s ease',
              }}
            >
              <Heart style={{ width:17, height:17, fill: liked ? '#f87171' : 'none', transition:'all 0.2s' }} />
              {likes} {liked ? 'Liked!' : 'Like this article'}
            </button>

            {/* Share */}
            <button
              onClick={handleCopy}
              style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 20px', borderRadius:14, border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.03)', color:'rgba(140,160,190,0.65)', cursor:'pointer', fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:600, fontSize:13 }}
            >
              {copied ? <Check style={{ width:14, height:14, color:'#4ade80' }} /> : <Copy style={{ width:14, height:14 }} />}
              {copied ? 'Copied!' : 'Copy link'}
            </button>
          </div>

          {/* Author bio card */}
          {(post.author_bio || post.author) && (
            <div style={{ marginTop:40, padding:'24px', borderRadius:18, background:'linear-gradient(160deg,rgba(6,6,24,0.98),rgba(4,4,18,0.96))', border:`1px solid rgba(255,255,255,0.07)` }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:16 }}>
                <Avatar name={post.author} color={post.author_avatar_color} size={52} />
                <div>
                  <Link to={`/profile/${post.author}`} style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:16, color:'#f0f6ff', textDecoration:'none', display:'block', marginBottom:4 }}>
                    @{post.author}
                  </Link>
                  {post.author_role && (
                    <div style={{ fontSize:12, color:cm.color, fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:600, marginBottom:8 }}>{post.author_role}</div>
                  )}
                  {post.author_bio && (
                    <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:13.5, color:'rgba(160,180,210,0.7)', lineHeight:1.65, margin:0, maxWidth:560 }}>{post.author_bio}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  )
}
