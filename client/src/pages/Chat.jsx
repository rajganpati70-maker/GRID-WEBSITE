import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Hash, Lock, Wifi, WifiOff, Circle, MessageCircle, Users, X, Loader2, AtSign, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import { useNavigate } from 'react-router-dom'

const ROOM_ICONS = {
  general: '#',
  ai_ml: '🧠',
  devops: '⚙️',
  security: '🛡',
  frontend: '🎨',
  backend: '🔧',
}

const ROOM_COLORS = {
  general: 'text-gray-300',
  ai_ml: 'text-purple-400',
  devops: 'text-orange-400',
  security: 'text-red-400',
  frontend: 'text-cyan-400',
  backend: 'text-green-400',
}

function formatTime(iso) {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDate(iso) {
  const d = new Date(iso)
  const today = new Date()
  if (d.toDateString() === today.toDateString()) return 'Today'
  const y = new Date(today); y.setDate(today.getDate() - 1)
  if (d.toDateString() === y.toDateString()) return 'Yesterday'
  return d.toLocaleDateString()
}

const GRAD_COLORS = ['from-blue-600 to-cyan-400','from-purple-600 to-blue-400','from-cyan-600 to-teal-400','from-indigo-600 to-purple-400','from-yellow-600 to-orange-400','from-green-600 to-teal-400','from-red-600 to-orange-400','from-pink-600 to-rose-400']

function Avatar({ username, size = 8, index }) {
  const i = username ? username.charCodeAt(0) % GRAD_COLORS.length : 0
  const sizeClass = `w-${size} h-${size}`
  return (
    <div className={`${sizeClass} rounded-lg bg-gradient-to-br ${GRAD_COLORS[i]} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
      {username?.[0]?.toUpperCase() || '?'}
    </div>
  )
}

function ChatMessage({ msg, currentUserId, isFirst }) {
  const isOwn = msg.user?.id === currentUserId || msg.fromUser?.id === currentUserId
  const username = msg.user?.username || msg.fromUser?.username || 'Unknown'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-3 px-4 py-1 hover:bg-grid-cyan/3 transition-colors group ${isOwn ? '' : ''}`}
    >
      {isFirst ? (
        <Avatar username={username} size={8} />
      ) : (
        <div className="w-8 flex-shrink-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] text-gray-600">{formatTime(msg.timestamp)}</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        {isFirst && (
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className={`font-semibold text-sm font-orbitron tracking-wide ${isOwn ? 'text-grid-cyan' : 'text-white'}`}>
              {username}
            </span>
            <span className="text-[10px] text-gray-600">{formatTime(msg.timestamp)}</span>
          </div>
        )}
        <p className="text-gray-300 text-sm leading-relaxed font-inter break-words">{msg.text}</p>
      </div>
    </motion.div>
  )
}

function TypingIndicator({ typers }) {
  if (!typers.length) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      className="px-4 py-1 flex items-center gap-2"
    >
      <div className="flex gap-1">
        {[0,1,2].map(i => (
          <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-grid-cyan"
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500 font-inter italic">
        {typers.join(', ')} {typers.length === 1 ? 'is' : 'are'} typing...
      </span>
    </motion.div>
  )
}

export default function Chat() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const notif = useNotifications()

  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [rooms, setRooms] = useState({})
  const [activeRoom, setActiveRoom] = useState('general')
  const [messages, setMessages] = useState({})
  const [input, setInput] = useState('')
  const [onlineUsers, setOnlineUsers] = useState([])
  const [typers, setTypers] = useState([])
  const [dmUser, setDmUser] = useState(null)
  const [dmMessages, setDmMessages] = useState({})
  const [dmInput, setDmInput] = useState('')
  const [showUsers, setShowUsers] = useState(true)
  const [error, setError] = useState('')

  const ws = useRef(null)
  const bottomRef = useRef(null)
  const typingTimeout = useRef(null)
  const typerClearTimers = useRef({})

  const scrollToBottom = useCallback(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }, [])

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    notif?.markChatActive('general')
    connect()
    return () => {
      ws.current?.close()
      notif?.markChatInactive()
    }
  }, [user])

  useEffect(() => {
    scrollToBottom()
  }, [messages, activeRoom, dmMessages, dmUser])

  const connect = () => {
    setConnecting(true)
    setError('')
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.host}/ws`
    const socket = new WebSocket(wsUrl)
    ws.current = socket

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'auth', token }))
    }

    socket.onmessage = (event) => {
      let msg
      try { msg = JSON.parse(event.data) } catch { return }

      switch (msg.type) {
        case 'auth_ok':
          setConnected(true)
          setConnecting(false)
          setRooms(msg.rooms || {})
          setOnlineUsers(msg.onlineUsers || [])
          break

        case 'auth_error':
          setError('Authentication failed. Please log in again.')
          setConnecting(false)
          break

        case 'room_history':
          setMessages(prev => ({ ...prev, [msg.room]: msg.messages || [] }))
          scrollToBottom()
          break

        case 'chat_message':
          setMessages(prev => ({
            ...prev,
            [msg.room]: [...(prev[msg.room] || []), msg]
          }))
          if (msg.room === activeRoom) scrollToBottom()
          break

        case 'dm_message': {
          const otherId = msg.fromUser?.id === user.id ? msg.toUserId : msg.fromUser?.id
          setDmMessages(prev => ({
            ...prev,
            [otherId]: [...(prev[otherId] || []), msg]
          }))
          scrollToBottom()
          break
        }

        case 'dm_history':
          setDmMessages(prev => ({ ...prev, [msg.withUserId]: msg.messages || [] }))
          scrollToBottom()
          break

        case 'user_joined':
        case 'user_left':
          setOnlineUsers(msg.onlineUsers || [])
          break

        case 'typing': {
          if (msg.room !== activeRoom) break
          const name = msg.username
          setTypers(prev => [...new Set([...prev, name])])
          if (typerClearTimers.current[name]) clearTimeout(typerClearTimers.current[name])
          typerClearTimers.current[name] = setTimeout(() => {
            setTypers(prev => prev.filter(u => u !== name))
          }, 2500)
          break
        }
      }
    }

    socket.onclose = () => {
      setConnected(false)
      setConnecting(false)
    }

    socket.onerror = () => {
      setError('Connection failed. Retrying...')
      setConnecting(false)
    }
  }

  const joinRoom = (room) => {
    setActiveRoom(room)
    setDmUser(null)
    notif?.markChatActive(room)
    notif?.clearRoomUnread(room)
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'join_room', room }))
    }
  }

  const openDm = (targetUser) => {
    setDmUser(targetUser)
    notif?.clearDmUnread(targetUser.id)
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'get_dm_history', withUserId: targetUser.id }))
    }
  }

  const sendMessage = (e) => {
    e.preventDefault()
    if (!input.trim() || !connected) return
    ws.current.send(JSON.stringify({ type: 'chat_message', text: input.trim() }))
    setInput('')
  }

  const sendDm = (e) => {
    e.preventDefault()
    if (!dmInput.trim() || !dmUser || !connected) return
    ws.current.send(JSON.stringify({ type: 'dm_message', text: dmInput.trim(), toUserId: dmUser.id }))
    setDmInput('')
  }

  const handleTyping = () => {
    if (!connected) return
    ws.current.send(JSON.stringify({ type: 'typing' }))
    if (typingTimeout.current) clearTimeout(typingTimeout.current)
  }

  const activeMessages = dmUser ? (dmMessages[dmUser.id] || []) : (messages[activeRoom] || [])

  const groupedMessages = activeMessages.reduce((acc, msg, idx) => {
    const prev = activeMessages[idx - 1]
    const prevUser = prev?.user?.id || prev?.fromUser?.id
    const currUser = msg.user?.id || msg.fromUser?.id
    const timeDiff = prev ? (new Date(msg.timestamp) - new Date(prev.timestamp)) / 1000 : Infinity
    const isFirst = !prev || prevUser !== currUser || timeDiff > 300
    acc.push({ msg, isFirst })
    return acc
  }, [])

  return (
    <div className="min-h-screen pt-20 flex overflow-hidden" style={{height:'100vh'}}>
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 bg-grid-dark/80 backdrop-blur-xl border-r border-grid-cyan/10 flex flex-col">
        {/* Header */}
        <div className="px-4 py-4 border-b border-grid-cyan/10">
          <div className="flex items-center gap-2 mb-1">
            <MessageCircle className="w-4 h-4 text-grid-cyan" />
            <span className="font-orbitron text-xs font-bold text-white tracking-widest uppercase">Live Chat</span>
          </div>
          <div className="flex items-center gap-1.5">
            {connected ? (
              <><Wifi className="w-3 h-3 text-green-400" /><span className="text-[10px] text-green-400 font-rajdhani tracking-widest">Connected</span></>
            ) : connecting ? (
              <><Loader2 className="w-3 h-3 text-yellow-400 animate-spin" /><span className="text-[10px] text-yellow-400 font-rajdhani tracking-widest">Connecting...</span></>
            ) : (
              <><WifiOff className="w-3 h-3 text-red-400" /><span className="text-[10px] text-red-400 font-rajdhani tracking-widest">Disconnected</span></>
            )}
          </div>
        </div>

        {/* Rooms */}
        <div className="flex-1 overflow-y-auto py-3">
          <div className="px-3 mb-2">
            <span className="text-[10px] text-gray-600 font-rajdhani tracking-[0.3em] uppercase">Channels</span>
          </div>
          <div className="space-y-0.5 px-2 mb-4">
            {Object.entries(rooms).length > 0 ? Object.entries(rooms).map(([id, room]) => {
              const badge = notif?.unreadRooms?.[id] || 0
              return (
                <button
                  key={id}
                  onClick={() => joinRoom(id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 group ${
                    activeRoom === id && !dmUser
                      ? 'bg-grid-cyan/15 text-grid-cyan border border-grid-cyan/25'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/4'
                  }`}
                >
                  <span className="text-base leading-none" style={{fontSize:'13px'}}>{ROOM_ICONS[id] || '#'}</span>
                  <span className="font-rajdhani tracking-wide text-sm flex-1 text-left">{room.name}</span>
                  {badge > 0 && (
                    <span className="min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center px-1 font-orbitron">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </button>
              )
            }) : Object.entries({ general:{name:'General'}, ai_ml:{name:'AI / ML'}, devops:{name:'DevOps'}, security:{name:'Security'}, frontend:{name:'Frontend'}, backend:{name:'Backend'} }).map(([id, room]) => {
              const badge = notif?.unreadRooms?.[id] || 0
              return (
                <button
                  key={id}
                  onClick={() => joinRoom(id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    activeRoom === id && !dmUser ? 'bg-grid-cyan/15 text-grid-cyan border border-grid-cyan/25' : 'text-gray-400 hover:text-gray-200 hover:bg-white/4'
                  }`}
                >
                  <span style={{fontSize:'13px'}}>{ROOM_ICONS[id] || '#'}</span>
                  <span className="font-rajdhani tracking-wide flex-1 text-left">{room.name}</span>
                  {badge > 0 && (
                    <span className="min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center px-1 font-orbitron">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* DMs */}
          {onlineUsers.filter(u => u.id !== user?.id).length > 0 && (
            <>
              <div className="px-3 mb-2">
                <span className="text-[10px] text-gray-600 font-rajdhani tracking-[0.3em] uppercase">Direct Messages</span>
              </div>
              <div className="space-y-0.5 px-2">
                {onlineUsers.filter(u => u.id !== user?.id).map(u => {
                  const dmBadge = notif?.unreadDms?.[u.id] || 0
                  return (
                    <button
                      key={u.id}
                      onClick={() => openDm(u)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        dmUser?.id === u.id ? 'bg-grid-cyan/15 text-grid-cyan border border-grid-cyan/25' : 'text-gray-400 hover:text-gray-200 hover:bg-white/4'
                      }`}
                    >
                      <div className="relative flex-shrink-0">
                        <Avatar username={u.username} size={5} />
                        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-400 border border-grid-dark" />
                      </div>
                      <span className="font-rajdhani tracking-wide truncate flex-1 text-left">{u.username}</span>
                      {dmBadge > 0 && (
                        <span className="min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center px-1 font-orbitron flex-shrink-0">
                          {dmBadge > 9 ? '9+' : dmBadge}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* Current user */}
        <div className="border-t border-grid-cyan/10 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Avatar username={user?.username} size={7} />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-grid-dark" />
            </div>
            <div>
              <div className="font-orbitron text-xs font-bold text-white">{user?.username}</div>
              <div className="text-[10px] text-green-400 font-rajdhani tracking-widest">Online</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-grid-black/60">
        {/* Channel Header */}
        <div className="h-14 border-b border-grid-cyan/10 flex items-center justify-between px-6 bg-grid-dark/50 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            {dmUser ? (
              <>
                <div className="relative">
                  <Avatar username={dmUser.username} size={7} />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-400 border border-grid-dark" />
                </div>
                <div>
                  <div className="font-orbitron text-sm font-bold text-white">@{dmUser.username}</div>
                  <div className="text-[10px] text-green-400 font-rajdhani tracking-widest">Direct Message</div>
                </div>
                <button onClick={() => setDmUser(null)} className="ml-2 p-1 text-gray-600 hover:text-gray-300 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <>
                <span className="text-lg text-gray-400">{ROOM_ICONS[activeRoom] || '#'}</span>
                <div>
                  <div className="font-orbitron text-sm font-bold text-white">{rooms[activeRoom]?.name || activeRoom}</div>
                  <div className="text-[10px] text-gray-500 font-rajdhani tracking-widest">{rooms[activeRoom]?.description || 'Community channel'}</div>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowUsers(!showUsers)} className={`p-1.5 rounded-lg transition-all duration-200 ${showUsers ? 'text-grid-cyan bg-grid-cyan/10' : 'text-gray-500 hover:text-gray-300'}`}>
              <Users className="w-4 h-4" />
            </button>
            <div className="text-xs text-gray-500 font-rajdhani tracking-wide flex items-center gap-1.5">
              <Circle className="w-2 h-2 fill-green-400 text-green-400" />
              {onlineUsers.length} online
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-4" style={{minHeight:0}}>
          {!connected && !connecting && (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <WifiOff className="w-12 h-12 text-grid-cyan/30" />
              <p className="text-gray-500 font-rajdhani tracking-wide text-sm">{error || 'Disconnected from chat'}</p>
              <button onClick={connect} className="btn-primary text-xs px-6 py-2">Reconnect</button>
            </div>
          )}

          {connecting && (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Loader2 className="w-10 h-10 text-grid-cyan animate-spin" />
              <p className="text-gray-500 font-rajdhani tracking-widest text-xs uppercase">Connecting to GRID Chat...</p>
            </div>
          )}

          {connected && activeMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <MessageCircle className="w-12 h-12 text-grid-cyan/20" />
              <p className="text-gray-600 font-rajdhani tracking-widest text-xs uppercase">
                {dmUser ? `Start a conversation with @${dmUser.username}` : `No messages yet. Start the conversation!`}
              </p>
            </div>
          )}

          {connected && groupedMessages.map(({ msg, isFirst }, idx) => (
            <ChatMessage key={msg.id || idx} msg={msg} currentUserId={user?.id} isFirst={isFirst} />
          ))}

          <AnimatePresence>
            {!dmUser && <TypingIndicator typers={typers.filter(u => u !== user?.username)} />}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 pb-4">
          <form onSubmit={dmUser ? sendDm : sendMessage} className="relative">
            <div className="glass-card rounded-xl border-grid-cyan/20 flex items-center gap-3 px-4 py-3 focus-within:border-grid-cyan/50 transition-all duration-300">
              {dmUser && <AtSign className="w-4 h-4 text-grid-cyan flex-shrink-0" />}
              <input
                type="text"
                value={dmUser ? dmInput : input}
                onChange={e => {
                  dmUser ? setDmInput(e.target.value) : setInput(e.target.value)
                  if (!dmUser) handleTyping()
                }}
                placeholder={dmUser ? `Message @${dmUser.username}...` : `Message #${rooms[activeRoom]?.name || activeRoom}...`}
                className="flex-1 bg-transparent text-white placeholder-gray-600 outline-none text-sm font-inter"
                disabled={!connected}
              />
              <button
                type="submit"
                disabled={!(dmUser ? dmInput.trim() : input.trim()) || !connected}
                className="p-2 rounded-lg bg-grid-cyan/10 hover:bg-grid-cyan/20 text-grid-cyan disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Online Users Panel */}
      <AnimatePresence>
        {showUsers && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 200, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex-shrink-0 bg-grid-dark/80 border-l border-grid-cyan/10 flex flex-col overflow-hidden"
          >
            <div className="px-4 py-4 border-b border-grid-cyan/10">
              <span className="text-[10px] text-gray-600 font-rajdhani tracking-[0.3em] uppercase">Online — {onlineUsers.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
              {onlineUsers.map(u => (
                <button
                  key={u.id}
                  onClick={() => u.id !== user?.id && openDm(u)}
                  className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/4 transition-all duration-200 group"
                >
                  <div className="relative">
                    <Avatar username={u.username} size={6} />
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-400 border border-grid-dark" />
                  </div>
                  <span className="text-xs text-gray-300 group-hover:text-white transition-colors font-rajdhani tracking-wide truncate">{u.username}</span>
                  {u.id !== user?.id && (
                    <ChevronRight className="w-3 h-3 text-gray-600 opacity-0 group-hover:opacity-100 ml-auto flex-shrink-0" />
                  )}
                </button>
              ))}
              {onlineUsers.length === 0 && (
                <p className="text-xs text-gray-600 font-rajdhani text-center pt-4">No one online yet</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
