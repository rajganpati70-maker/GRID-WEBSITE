import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, ThumbsUp, ThumbsDown, MessageSquare, Eye, Clock, Pin, Flame,
  Send, CornerDownRight, Loader2, AlertCircle, ChevronDown, ChevronUp, Zap
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const GRAD_COLORS = [
  'from-blue-600 to-cyan-400', 'from-purple-600 to-blue-400',
  'from-cyan-600 to-teal-400', 'from-indigo-600 to-purple-400',
  'from-yellow-600 to-orange-400', 'from-green-600 to-teal-400',
  'from-red-600 to-orange-400', 'from-pink-600 to-rose-400'
]

const CAT_COLORS = {
  'DevOps': 'text-orange-400 bg-orange-400/10 border-orange-400/25',
  'Languages': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/25',
  'Blockchain': 'text-blue-400 bg-blue-400/10 border-blue-400/25',
  'General': 'text-gray-400 bg-gray-400/10 border-gray-400/25',
  'AI/ML': 'text-purple-400 bg-purple-400/10 border-purple-400/25',
  'Frontend': 'text-cyan-400 bg-cyan-400/10 border-cyan-400/25',
  'Security': 'text-red-400 bg-red-400/10 border-red-400/25',
}

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return new Date(iso).toLocaleDateString()
}

function Avatar({ username, avatarColor, size = 10 }) {
  const i = (username?.charCodeAt(0) || 0) % GRAD_COLORS.length
  return (
    <div
      className={`w-${size} h-${size} rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 ${!avatarColor ? `bg-gradient-to-br ${GRAD_COLORS[i]}` : ''}`}
      style={avatarColor ? { background: avatarColor, width: `${size * 4}px`, height: `${size * 4}px` } : { width: `${size * 4}px`, height: `${size * 4}px` }}
    >
      <span style={{ fontSize: `${size * 1.6}px` }}>{username?.[0]?.toUpperCase() || '?'}</span>
    </div>
  )
}

function ReplyBox({ threadId, parentId, parentAuthor, onCancel, onPosted, depth = 0 }) {
  const { user, token } = useAuth()
  const [content, setContent] = useState('')
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState('')
  const ref = useRef(null)

  useEffect(() => { ref.current?.focus() }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    setPosting(true)
    setError('')
    try {
      const res = await axios.post(`/api/forum/${threadId}/replies`, { content: content.trim(), parent_id: parentId || null }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setContent('')
      onPosted?.(res.data)
      onCancel?.()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post reply')
    } finally {
      setPosting(false)
    }
  }

  if (!user) return (
    <div className="mt-4 p-4 rounded-xl border border-grid-cyan/15 bg-grid-cyan/3 text-center">
      <Link to="/login" className="text-grid-cyan text-xs font-rajdhani tracking-widest uppercase hover:underline">Log in to reply</Link>
    </div>
  )

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`mt-3 ${depth > 0 ? 'ml-10' : ''}`}>
      {parentAuthor && (
        <div className="flex items-center gap-1.5 mb-2 text-xs text-gray-500 font-rajdhani tracking-wide">
          <CornerDownRight className="w-3 h-3" /> replying to <span className="text-grid-cyan">@{parentAuthor}</span>
        </div>
      )}
      <form onSubmit={submit}>
        <div className={`glass-card rounded-xl border-grid-cyan/20 focus-within:border-grid-cyan/50 transition-all duration-300 overflow-hidden`}>
          <textarea
            ref={ref}
            value={content}
            onChange={e => setContent(e.target.value.slice(0, 5000))}
            placeholder={parentAuthor ? `Reply to @${parentAuthor}...` : 'Write a thoughtful reply...'}
            rows={3}
            className="w-full bg-transparent px-4 pt-3 pb-2 text-sm text-white placeholder-gray-600 font-inter resize-none outline-none"
          />
          <div className="flex items-center justify-between px-4 pb-3">
            <span className="text-[10px] text-gray-700 font-rajdhani">{content.length}/5000</span>
            <div className="flex gap-2">
              {onCancel && (
                <button type="button" onClick={onCancel} className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-300 font-rajdhani tracking-widest uppercase transition-colors">Cancel</button>
              )}
              <button
                type="submit"
                disabled={!content.trim() || posting}
                className="flex items-center gap-1.5 px-4 py-1.5 btn-primary text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {posting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                {posting ? 'Posting...' : 'Post Reply'}
              </button>
            </div>
          </div>
        </div>
        {error && (
          <div className="mt-2 flex items-center gap-2 text-red-400 text-xs font-inter">
            <AlertCircle className="w-3.5 h-3.5" /> {error}
          </div>
        )}
      </form>
    </motion.div>
  )
}

function ReplyCard({ reply, threadId, onVote, onReplyPosted, depth = 0 }) {
  const { user, token } = useAuth()
  const [replying, setReplying] = useState(false)
  const [showChildren, setShowChildren] = useState(true)
  const [userVote, setUserVote] = useState(null) // null | 'up' | 'down'
  const [likes, setLikes] = useState(reply.likes || 0)
  const [dislikes, setDislikes] = useState(reply.dislikes || 0)
  const [voting, setVoting] = useState(false)

  const handleVote = async (type) => {
    if (!user || voting) return
    setVoting(true)
    const prev = { userVote, likes, dislikes }
    // Optimistic update
    if (userVote === type) {
      setUserVote(null)
      type === 'up' ? setLikes(l => Math.max(0, l - 1)) : setDislikes(d => Math.max(0, d - 1))
    } else {
      if (userVote) {
        userVote === 'up' ? setLikes(l => Math.max(0, l - 1)) : setDislikes(d => Math.max(0, d - 1))
      }
      setUserVote(type)
      type === 'up' ? setLikes(l => l + 1) : setDislikes(d => d + 1)
    }
    try {
      const res = await axios.post(`/api/forum/replies/${reply.id}/vote`, { type }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setLikes(res.data.likes)
      setDislikes(res.data.dislikes)
      setUserVote(res.data.userVote)
    } catch {
      setUserVote(prev.userVote); setLikes(prev.likes); setDislikes(prev.dislikes)
    } finally {
      setVoting(false)
    }
  }

  const maxDepth = 3

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${depth > 0 ? 'ml-8 mt-3 border-l-2 border-grid-cyan/10 pl-4' : 'mt-4'}`}
    >
      <div className="glass-card rounded-xl p-4 hover:border-grid-cyan/20 transition-colors duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <Link to={`/profile/${reply.author}`}>
              <Avatar username={reply.author} avatarColor={reply.author_avatar_color} size={8} />
            </Link>
            <div>
              <Link to={`/profile/${reply.author}`} className="font-orbitron text-xs font-bold text-white hover:text-grid-cyan transition-colors">
                @{reply.author}
              </Link>
              {reply.author_role && (
                <div className="text-[10px] text-gray-600 font-rajdhani tracking-wide">{reply.author_role}</div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-600 font-rajdhani tracking-wide">
            <Clock className="w-3 h-3" />
            {timeAgo(reply.created_at)}
          </div>
        </div>

        {/* Content */}
        <div className="text-sm text-gray-300 font-inter leading-relaxed whitespace-pre-wrap mb-3 pl-10">
          {reply.content}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pl-10 flex-wrap">
          {/* Was this helpful? */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-600 font-rajdhani tracking-widest uppercase select-none">
              Helpful?
            </span>
            <button
              onClick={() => handleVote('up')}
              disabled={!user || voting}
              title={user ? 'Mark as helpful' : 'Log in to vote'}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all duration-200 border ${
                userVote === 'up'
                  ? 'bg-grid-cyan/15 border-grid-cyan/40 text-grid-cyan'
                  : 'border-transparent text-gray-600 hover:border-grid-cyan/25 hover:text-grid-cyan'
              } disabled:cursor-default`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${userVote === 'up' ? 'fill-grid-cyan' : ''}`} />
              {likes > 0 && <span className="font-orbitron font-bold text-[10px]">{likes}</span>}
            </button>
            <button
              onClick={() => handleVote('down')}
              disabled={!user || voting}
              title={user ? 'Mark as not helpful' : 'Log in to vote'}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all duration-200 border ${
                userVote === 'down'
                  ? 'bg-red-500/15 border-red-500/40 text-red-400'
                  : 'border-transparent text-gray-600 hover:border-red-500/25 hover:text-red-400'
              } disabled:cursor-default`}
            >
              <ThumbsDown className={`w-3.5 h-3.5 ${userVote === 'down' ? 'fill-red-400' : ''}`} />
              {dislikes > 0 && <span className="font-orbitron font-bold text-[10px]">{dislikes}</span>}
            </button>
          </div>

          {depth < maxDepth && (
            <button
              onClick={() => setReplying(!replying)}
              className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-grid-cyan transition-colors font-rajdhani tracking-widest uppercase"
            >
              <CornerDownRight className="w-3.5 h-3.5" /> Reply
            </button>
          )}
        </div>

        {/* Inline reply box */}
        <AnimatePresence>
          {replying && (
            <ReplyBox
              threadId={threadId}
              parentId={reply.id}
              parentAuthor={reply.author}
              depth={depth}
              onCancel={() => setReplying(false)}
              onPosted={(r) => { onReplyPosted?.(r); setReplying(false) }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Children */}
      {reply.children?.length > 0 && (
        <div>
          <button
            onClick={() => setShowChildren(!showChildren)}
            className="flex items-center gap-1 text-[10px] text-gray-600 hover:text-grid-cyan transition-colors mt-2 ml-4 font-rajdhani tracking-widest uppercase"
          >
            {showChildren ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {reply.children.length} {reply.children.length === 1 ? 'reply' : 'replies'}
          </button>
          <AnimatePresence>
            {showChildren && reply.children.map(child => (
              <ReplyCard
                key={child.id}
                reply={child}
                threadId={threadId}
                onReplyPosted={onReplyPosted}
                depth={depth + 1}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}

function buildTree(replies) {
  const map = {}
  const roots = []
  replies.forEach(r => { map[r.id] = { ...r, children: [] } })
  replies.forEach(r => {
    if (r.parent_id && map[r.parent_id]) {
      map[r.parent_id].children.push(map[r.id])
    } else {
      roots.push(map[r.id])
    }
  })
  return roots
}

export default function ForumThread() {
  const { threadId } = useParams()
  const { user, token } = useAuth()
  const navigate = useNavigate()

  const [thread, setThread] = useState(null)
  const [replies, setReplies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [threadLiked, setThreadLiked] = useState(false)
  const [threadLikes, setThreadLikes] = useState(0)
  const [newReplyCount, setNewReplyCount] = useState(0)
  const wsRef = useRef(null)

  useEffect(() => {
    fetchThread()
    setupWs()
    return () => { wsRef.current?.close(); wsRef.current = null }
  }, [threadId])

  const fetchThread = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get(`/api/forum/${threadId}`)
      setThread(res.data.thread)
      setThreadLikes(res.data.thread.likes || 0)
      setReplies(res.data.replies || [])
    } catch (err) {
      setError(err.response?.status === 404 ? 'Thread not found' : 'Failed to load thread')
    } finally {
      setLoading(false)
    }
  }

  const setupWs = () => {
    const token = localStorage.getItem('grid_token')
    if (!token) return
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws`)
    wsRef.current = ws

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'auth', token }))
    }

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data)
        if (msg.type === 'auth_ok') {
          ws.send(JSON.stringify({ type: 'watch_thread', threadId: parseInt(threadId) }))
        }
        if (msg.type === 'forum_reply_new' && msg.threadId === parseInt(threadId)) {
          setReplies(prev => {
            if (prev.find(r => r.id === msg.reply.id)) return prev
            return [...prev, msg.reply]
          })
          setNewReplyCount(c => c + 1)
        }
        if (msg.type === 'forum_thread_upvote' && msg.threadId === parseInt(threadId)) {
          setThreadLikes(msg.likes)
        }
      } catch {}
    }

    ws.onclose = () => {}
  }

  const handleReplyPosted = useCallback((newReply) => {
    setReplies(prev => {
      if (prev.find(r => r.id === newReply.id)) return prev
      return [...prev, newReply]
    })
    setThread(t => t ? { ...t, replies: (t.replies || 0) + 1 } : t)
  }, [])

  // kept for legacy compatibility but voting is now handled inside ReplyCard directly

  const handleUpvoteThread = async () => {
    if (!user || threadLiked) return
    setThreadLiked(true)
    setThreadLikes(l => l + 1)
    try {
      await axios.post(`/api/forum/${threadId}/upvote`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch {
      setThreadLiked(false)
      setThreadLikes(l => l - 1)
    }
  }

  const replyTree = buildTree(replies)

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-grid-cyan/30 border-t-grid-cyan rounded-full animate-spin" />
        <div className="text-grid-cyan font-orbitron text-xs tracking-widest animate-pulse">LOADING THREAD...</div>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center">
        <MessageSquare className="w-16 h-16 text-grid-cyan/20 mx-auto mb-4" />
        <p className="text-gray-400 font-rajdhani tracking-wide mb-6">{error}</p>
        <Link to="/forum" className="btn-outline text-xs">Back to Forum</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/forum')}
          className="flex items-center gap-2 text-gray-500 hover:text-grid-cyan transition-colors mb-6 font-rajdhani tracking-widest uppercase text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Forum
        </motion.button>

        {/* Thread */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 mb-6">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            {thread?.pinned && (
              <span className="flex items-center gap-1 text-[10px] text-yellow-400 bg-yellow-400/10 border border-yellow-400/25 px-2 py-0.5 rounded font-rajdhani tracking-widest uppercase">
                <Pin className="w-2.5 h-2.5" /> Pinned
              </span>
            )}
            {thread?.hot && (
              <span className="flex items-center gap-1 text-[10px] text-orange-400 bg-orange-400/10 border border-orange-400/25 px-2 py-0.5 rounded font-rajdhani tracking-widest uppercase">
                <Flame className="w-2.5 h-2.5" /> Hot
              </span>
            )}
            <span className={`text-[10px] px-2 py-0.5 rounded border font-rajdhani tracking-widest uppercase ${CAT_COLORS[thread?.category] || 'text-gray-400 bg-gray-400/10 border-gray-400/25'}`}>
              {thread?.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-orbitron text-lg font-black text-white leading-snug mb-5">{thread?.title}</h1>

          {/* Author row */}
          <div className="flex items-center gap-3 mb-5">
            <Link to={`/profile/${thread?.author}`}>
              <Avatar username={thread?.author} avatarColor={thread?.author_avatar_color} size={10} />
            </Link>
            <div>
              <Link to={`/profile/${thread?.author}`} className="font-orbitron text-sm font-bold text-white hover:text-grid-cyan transition-colors">
                @{thread?.author}
              </Link>
              {thread?.author_role && <div className="text-[10px] text-gray-600 font-rajdhani tracking-wide">{thread?.author_role}</div>}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600 font-rajdhani tracking-wide ml-auto">
              <Clock className="w-3 h-3" />
              {thread?.created_at ? timeAgo(thread.created_at) : thread?.created}
            </div>
          </div>

          {/* Body */}
          <div className="text-gray-300 font-inter leading-relaxed text-sm whitespace-pre-wrap mb-6 pl-1 border-l-2 border-grid-cyan/10 pl-4">
            {thread?.content || thread?.excerpt || 'No content.'}
          </div>

          {/* Stats + Upvote */}
          <div className="flex items-center gap-5 pt-4 border-t border-grid-cyan/10">
            <button
              onClick={handleUpvoteThread}
              disabled={!user || threadLiked}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 text-sm ${
                threadLiked
                  ? 'bg-grid-cyan/15 border border-grid-cyan/40 text-grid-cyan'
                  : 'glass-card hover:border-grid-cyan/40 hover:text-grid-cyan text-gray-500 disabled:cursor-default'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${threadLiked ? 'fill-grid-cyan' : ''}`} />
              <span className="font-orbitron font-bold text-xs">{threadLikes}</span>
            </button>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-rajdhani tracking-wide">
              <MessageSquare className="w-4 h-4 text-grid-cyan/50" />
              {(thread?.replies || 0) + newReplyCount} replies
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-rajdhani tracking-wide">
              <Eye className="w-4 h-4" />
              {(thread?.views || 0).toLocaleString()} views
            </div>
            {newReplyCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 text-[10px] text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-1 rounded-full font-rajdhani tracking-widest uppercase ml-auto"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                {newReplyCount} new {newReplyCount === 1 ? 'reply' : 'replies'}
              </motion.span>
            )}
          </div>
        </motion.div>

        {/* Replies header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-orbitron text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-grid-cyan" />
            {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
          </h2>
          <div className="flex items-center gap-1.5 text-[10px] text-green-400 font-rajdhani tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Live
          </div>
        </div>

        {/* Reply tree */}
        {replyTree.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center mb-6">
            <MessageSquare className="w-10 h-10 text-grid-cyan/20 mx-auto mb-3" />
            <p className="text-gray-600 font-rajdhani tracking-widest text-xs uppercase">No replies yet. Be the first to respond!</p>
          </div>
        ) : (
          <div className="space-y-0 mb-6">
            {replyTree.map(reply => (
              <ReplyCard
                key={reply.id}
                reply={reply}
                threadId={threadId}
                onReplyPosted={handleReplyPosted}
                depth={0}
              />
            ))}
          </div>
        )}

        {/* Main reply box */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-6">
          <h3 className="font-orbitron text-xs font-bold text-white tracking-widest uppercase mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-grid-cyan" /> Post a Reply
          </h3>
          <ReplyBox
            threadId={threadId}
            onPosted={handleReplyPosted}
          />
        </motion.div>

      </div>
    </div>
  )
}
