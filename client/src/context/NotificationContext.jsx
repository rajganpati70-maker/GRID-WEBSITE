import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useAuth } from './AuthContext'
import { toast } from '../components/ToastContainer'

const NotificationContext = createContext(null)
export const useNotifications = () => useContext(NotificationContext)

export const NotificationProvider = ({ children }) => {
  const { user, token } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [unreadDms, setUnreadDms] = useState({})
  const [unreadRooms, setUnreadRooms] = useState({})
  const [activeRoom, setActiveRoom] = useState(null)
  const [isInChat, setIsInChat] = useState(false)
  const wsRef = useRef(null)
  const isInChatRef = useRef(false)
  const activeRoomRef = useRef(null)

  const addNotification = useCallback((n) => {
    const note = { ...n, id: `${Date.now()}-${Math.random()}`, timestamp: new Date().toISOString(), read: false }
    setNotifications(prev => [note, ...prev].slice(0, 50))
    setUnreadCount(c => c + 1)
    toast.show({ type: n.type, title: n.title, body: n.body, duration: 4500 })
    try {
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1)
      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.3)
      setTimeout(() => ctx.close(), 500)
    } catch {}
  }, [])

  useEffect(() => {
    isInChatRef.current = isInChat
    activeRoomRef.current = activeRoom
  }, [isInChat, activeRoom])

  useEffect(() => {
    if (!user || !token) {
      setNotifications([])
      setUnreadCount(0)
      setUnreadDms({})
      setUnreadRooms({})
      wsRef.current?.close()
      wsRef.current = null
      return
    }

    let destroyed = false
    let retryTimer = null

    const connect = () => {
      if (destroyed) return
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const ws = new WebSocket(`${protocol}//${window.location.host}/ws`)
      wsRef.current = ws

      ws.onopen = () => {
        if (!destroyed) ws.send(JSON.stringify({ type: 'auth', token }))
      }

      ws.onmessage = (e) => {
        if (destroyed) return
        let msg
        try { msg = JSON.parse(e.data) } catch { return }

        switch (msg.type) {
          case 'chat_message': {
            const inChat = isInChatRef.current
            const curRoom = activeRoomRef.current
            if (!inChat || msg.room !== curRoom) {
              if (msg.user?.id !== user.id) {
                setUnreadRooms(prev => ({ ...prev, [msg.room]: (prev[msg.room] || 0) + 1 }))
                addNotification({
                  type: 'chat',
                  title: `#${msg.room}`,
                  body: `${msg.user?.username}: ${msg.text}`,
                  room: msg.room,
                })
              }
            }
            break
          }
          case 'dm_message': {
            const fromId = msg.fromUser?.id
            if (fromId && fromId !== user.id) {
              setUnreadDms(prev => ({ ...prev, [fromId]: (prev[fromId] || 0) + 1 }))
              addNotification({
                type: 'dm',
                title: `DM from @${msg.fromUser?.username}`,
                body: msg.text,
                fromUser: msg.fromUser,
              })
            }
            break
          }
          case 'forum_reply_new': {
            if (msg.reply?.author_id && msg.reply.author_id !== user.id) {
              addNotification({
                type: 'forum',
                title: 'New forum reply',
                body: `@${msg.reply?.author}: "${msg.threadTitle?.slice(0, 50)}${msg.threadTitle?.length > 50 ? '...' : ''}"`,
              })
            }
            break
          }
          case 'forum_thread_new': {
            if (msg.thread?.author_id && msg.thread.author_id !== user.id) {
              addNotification({
                type: 'forum',
                title: `New thread: #${msg.thread?.category}`,
                body: `@${msg.thread?.author}: ${msg.thread?.title?.slice(0, 60)}`,
              })
            }
            break
          }
          case 'user_joined': {
            if (msg.user?.id && msg.user.id !== user.id) {
              addNotification({
                type: 'join',
                title: 'New member online',
                body: `@${msg.user?.username} joined the network`,
              })
            }
            break
          }
        }
      }

      ws.onclose = () => {
        if (!destroyed) retryTimer = setTimeout(connect, 5000)
      }
    }

    connect()

    return () => {
      destroyed = true
      clearTimeout(retryTimer)
      wsRef.current?.close()
      wsRef.current = null
    }
  }, [user?.id, token])

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const clearDmUnread = useCallback((userId) => {
    setUnreadDms(prev => { const n = { ...prev }; delete n[userId]; return n })
  }, [])

  const clearRoomUnread = useCallback((room) => {
    setUnreadRooms(prev => { const n = { ...prev }; delete n[room]; return n })
  }, [])

  const markChatActive = useCallback((room) => {
    setActiveRoom(room)
    setIsInChat(true)
    if (room) {
      setUnreadRooms(prev => { const n = { ...prev }; delete n[room]; return n })
    }
  }, [])

  const markChatInactive = useCallback(() => {
    setActiveRoom(null)
    setIsInChat(false)
  }, [])

  const chatBadge = isInChat ? 0 : Object.values(unreadRooms).reduce((a, b) => a + b, 0)
  const dmBadge = Object.values(unreadDms).reduce((a, b) => a + b, 0)
  const totalUnread = unreadCount + chatBadge + dmBadge

  const value = useMemo(() => ({
    notifications, unreadCount, totalUnread, chatBadge, dmBadge,
    unreadDms, unreadRooms, markAllRead, clearDmUnread, clearRoomUnread,
    markChatActive, markChatInactive, addNotification,
  }), [
    notifications, unreadCount, totalUnread, chatBadge, dmBadge,
    unreadDms, unreadRooms, markAllRead, clearDmUnread, clearRoomUnread,
    markChatActive, markChatInactive, addNotification,
  ])

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
