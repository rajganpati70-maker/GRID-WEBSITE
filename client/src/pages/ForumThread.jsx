import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, ThumbsUp, ThumbsDown, MessageSquare, Eye, Clock, Pin, Flame,
  ChevronDown, ChevronUp
} from 'lucide-react'

const GRAD_COLORS = [
  'from-blue-600 to-cyan-400', 'from-purple-600 to-blue-400',
  'from-cyan-600 to-teal-400', 'from-indigo-600 to-purple-400',
  'from-yellow-600 to-orange-400', 'from-green-600 to-teal-400',
  'from-red-600 to-orange-400', 'from-pink-600 to-rose-400'
]

const CAT_COLORS = {
  'DevOps': 'text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/25',
  'Languages': 'text-[#fbbf24] bg-[#fbbf24]/10 border-[#fbbf24]/25',
  'Blockchain': 'text-[#0066ff] bg-[#0066ff]/10 border-[#0066ff]/25',
  'General': 'text-[rgba(140,160,190,0.75)] bg-[rgba(140,160,190,0.08)] border-[rgba(140,160,190,0.22)]',
  'AI/ML': 'text-[#7b2fff] bg-[#7b2fff]/10 border-[#7b2fff]/25',
  'Frontend': 'text-grid-cyan bg-grid-cyan/10 border-grid-cyan/25',
  'Security': 'text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/25',
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


function ReplyCard({ reply, threadId, onReplyPosted, depth = 0 }) {
  const [replying, setReplying] = useState(false)
  const [showChildren, setShowChildren] = useState(true)
  const [userVote, setUserVote] = useState(null)
  const [likes, setLikes] = useState(reply.likes || 0)
  const [dislikes, setDislikes] = useState(reply.dislikes || 0)

  const handleVote = (type) => {
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
              <Link to={`/profile/${reply.author}`} className="text-xs font-bold text-white hover:text-grid-cyan transition-colors">
                @{reply.author}
              </Link>
              {reply.author_role && (
                <div className="text-[10px] text-[rgba(140,160,190,0.6)] tracking-wide">{reply.author_role}</div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-[rgba(140,160,190,0.6)] tracking-wide">
            <Clock className="w-3 h-3" />
            {timeAgo(reply.created_at)}
          </div>
        </div>

        {/* Content */}
        <div className="text-sm text-[rgba(180,195,215,0.85)] font-inter leading-relaxed whitespace-pre-wrap mb-3 pl-10">
          {reply.content}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pl-10 flex-wrap">
          {/* Was this helpful? */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[rgba(140,160,190,0.6)] tracking-widest uppercase select-none">
              Helpful?
            </span>
            <button
              onClick={() => handleVote('up')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all duration-200 border ${
                userVote === 'up'
                  ? 'bg-grid-cyan/15 border-grid-cyan/40 text-grid-cyan'
                  : 'border-transparent text-[rgba(140,160,190,0.6)] hover:border-grid-cyan/25 hover:text-grid-cyan'
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${userVote === 'up' ? 'fill-grid-cyan' : ''}`} />
              {likes > 0 && <span className="font-bold text-[10px]">{likes}</span>}
            </button>
            <button
              onClick={() => handleVote('down')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all duration-200 border ${
                userVote === 'down'
                  ? 'bg-red-500/15 border-red-500/40 text-red-400'
                  : 'border-transparent text-[rgba(140,160,190,0.6)] hover:border-red-500/25 hover:text-red-400'
              }`}
            >
              <ThumbsDown className={`w-3.5 h-3.5 ${userVote === 'down' ? 'fill-red-400' : ''}`} />
              {dislikes > 0 && <span className="font-bold text-[10px]">{dislikes}</span>}
            </button>
          </div>

          </div>
      </div>

      {/* Children */}
      {reply.children?.length > 0 && (
        <div>
          <button
            onClick={() => setShowChildren(!showChildren)}
            className="flex items-center gap-1 text-[10px] text-[rgba(140,160,190,0.6)] hover:text-grid-cyan transition-colors mt-2 ml-4 tracking-widest uppercase"
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
  const navigate = useNavigate()

  const [thread, setThread] = useState(null)
  const [replies, setReplies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [threadLiked, setThreadLiked] = useState(false)
  const [threadLikes, setThreadLikes] = useState(0)
  const [newReplyCount, setNewReplyCount] = useState(0)

  useEffect(() => {
    fetchThread()
  }, [threadId])

  const fetchThread = async () => {
    setLoading(true)
    setError('')
    try {
      const { getThread, getReplies } = await import('../data/store')
      const t = getThread(threadId)
      if (!t) { setError('Thread not found'); return }
      setThread(t)
      setThreadLikes(t.likes || 0)
      setReplies(getReplies(threadId))
    } catch {
      setError('Failed to load thread')
    } finally {
      setLoading(false)
    }
  }


  // kept for legacy compatibility but voting is now handled inside ReplyCard directly

  const handleUpvoteThread = () => {
    if (threadLiked) return
    setThreadLiked(true)
    setThreadLikes(l => l + 1)
    import('../data/store').then(({ upvoteThread }) => upvoteThread(threadId)).catch(() => {})
  }

  const replyTree = buildTree(replies)

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-grid-cyan/30 border-t-grid-cyan rounded-full animate-spin" />
        <div className="text-grid-cyan text-xs tracking-widest animate-pulse">LOADING THREAD...</div>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center">
        <MessageSquare className="w-16 h-16 text-grid-cyan/20 mx-auto mb-4" />
        <p className="text-[rgba(160,180,210,0.78)] tracking-wide mb-6">{error}</p>
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
          className="flex items-center gap-2 text-[rgba(140,160,190,0.65)] hover:text-grid-cyan transition-colors mb-6 tracking-widest uppercase text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Forum
        </motion.button>

        {/* Thread */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 mb-6">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            {thread?.pinned && (
              <span className="flex items-center gap-1 text-[10px] text-yellow-400 bg-yellow-400/10 border border-yellow-400/25 px-2 py-0.5 rounded tracking-widest uppercase">
                <Pin className="w-2.5 h-2.5" /> Pinned
              </span>
            )}
            {thread?.hot && (
              <span className="flex items-center gap-1 text-[10px] text-orange-400 bg-orange-400/10 border border-orange-400/25 px-2 py-0.5 rounded tracking-widest uppercase">
                <Flame className="w-2.5 h-2.5" /> Hot
              </span>
            )}
            <span className={`text-[10px] px-2 py-0.5 rounded border tracking-widest uppercase ${CAT_COLORS[thread?.category] || 'text-[rgba(140,160,190,0.75)] bg-[rgba(140,160,190,0.08)] border-[rgba(140,160,190,0.22)]'}`}>
              {thread?.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-lg font-black text-white leading-snug mb-5">{thread?.title}</h1>

          {/* Author row */}
          <div className="flex items-center gap-3 mb-5">
            <Link to={`/profile/${thread?.author}`}>
              <Avatar username={thread?.author} avatarColor={thread?.author_avatar_color} size={10} />
            </Link>
            <div>
              <Link to={`/profile/${thread?.author}`} className="text-sm font-bold text-white hover:text-grid-cyan transition-colors">
                @{thread?.author}
              </Link>
              {thread?.author_role && <div className="text-[10px] text-[rgba(140,160,190,0.6)] tracking-wide">{thread?.author_role}</div>}
            </div>
            <div className="flex items-center gap-1 text-xs text-[rgba(140,160,190,0.6)] tracking-wide ml-auto">
              <Clock className="w-3 h-3" />
              {thread?.created_at ? timeAgo(thread.created_at) : thread?.created}
            </div>
          </div>

          {/* Body */}
          <div className="text-[rgba(180,195,215,0.85)] font-inter leading-relaxed text-sm whitespace-pre-wrap mb-6 pl-1 border-l-2 border-grid-cyan/10 pl-4">
            {thread?.content || thread?.excerpt || 'No content.'}
          </div>

          {/* Stats + Upvote */}
          <div className="flex items-center gap-5 pt-4 border-t border-grid-cyan/10">
            <button
              onClick={handleUpvoteThread}
              disabled={threadLiked}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 text-sm ${
                threadLiked
                  ? 'bg-grid-cyan/15 border border-grid-cyan/40 text-grid-cyan'
                  : 'glass-card hover:border-grid-cyan/40 hover:text-grid-cyan text-[rgba(140,160,190,0.65)] disabled:cursor-default'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${threadLiked ? 'fill-grid-cyan' : ''}`} />
              <span className="font-bold text-xs">{threadLikes}</span>
            </button>
            <div className="flex items-center gap-1.5 text-xs text-[rgba(140,160,190,0.65)] tracking-wide">
              <MessageSquare className="w-4 h-4 text-grid-cyan/50" />
              {(thread?.replies || 0) + newReplyCount} replies
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[rgba(140,160,190,0.65)] tracking-wide">
              <Eye className="w-4 h-4" />
              {(thread?.views || 0).toLocaleString()} views
            </div>
            {newReplyCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 text-[10px] text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-1 rounded-full tracking-widest uppercase ml-auto"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                {newReplyCount} new {newReplyCount === 1 ? 'reply' : 'replies'}
              </motion.span>
            )}
          </div>
        </motion.div>

        {/* Replies header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-grid-cyan" />
            {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
          </h2>
          <div className="flex items-center gap-1.5 text-[10px] text-green-400 tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Live
          </div>
        </div>

        {/* Reply tree */}
        {replyTree.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center mb-6">
            <MessageSquare className="w-10 h-10 text-grid-cyan/20 mx-auto mb-3" />
            <p className="text-[rgba(140,160,190,0.6)] tracking-widest text-xs uppercase">No replies yet. Be the first to respond!</p>
          </div>
        ) : (
          <div className="space-y-0 mb-6">
            {replyTree.map(reply => (
              <ReplyCard
                key={reply.id}
                reply={reply}
                threadId={threadId}
                depth={0}
              />
            ))}
          </div>
        )}


      </div>
    </div>
  )
}
