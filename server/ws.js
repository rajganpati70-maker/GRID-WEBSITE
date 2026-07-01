const { WebSocketServer, WebSocket } = require('ws')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('./middleware/auth')

const ROOMS = {
  general: { name: 'General', description: 'General tech discussion' },
  ai_ml: { name: 'AI / ML', description: 'Artificial intelligence and machine learning' },
  devops: { name: 'DevOps', description: 'Infrastructure, CI/CD, cloud' },
  security: { name: 'Security', description: 'Cybersecurity and ethical hacking' },
  frontend: { name: 'Frontend', description: 'React, Vue, CSS, and web dev' },
  backend: { name: 'Backend', description: 'APIs, databases, server-side' },
}

const messageHistory = {}
Object.keys(ROOMS).forEach(r => { messageHistory[r] = [] })

const dmHistory = {}
const clients = new Map()

const getOnlineUsers = () => {
  const users = []
  clients.forEach(client => {
    if (client.user) users.push({ id: client.user.id, username: client.user.username })
  })
  return [...new Map(users.map(u => [u.id, u])).values()]
}

const broadcast = (data, excludeWs = null) => {
  const msg = JSON.stringify(data)
  clients.forEach((meta, ws) => {
    if (ws !== excludeWs && ws.readyState === WebSocket.OPEN) {
      ws.send(msg)
    }
  })
}

const broadcastForumEvent = (data) => {
  const msg = JSON.stringify(data)
  clients.forEach((meta, ws) => {
    if (meta.user && ws.readyState === WebSocket.OPEN) {
      ws.send(msg)
    }
  })
}

const sendToUser = (userId, data) => {
  const msg = JSON.stringify(data)
  clients.forEach((meta, ws) => {
    if (meta.user?.id === userId && ws.readyState === WebSocket.OPEN) {
      ws.send(msg)
    }
  })
}

const initWss = (server) => {
  const wss = new WebSocketServer({ server, path: '/ws' })

  wss.on('connection', (ws, req) => {
    const meta = { user: null, room: 'general', watchingThread: null }
    clients.set(ws, meta)

    ws.on('message', (raw) => {
      let msg
      try { msg = JSON.parse(raw.toString()) } catch { return }

      switch (msg.type) {
        case 'auth': {
          try {
            const decoded = jwt.verify(msg.token, JWT_SECRET)
            meta.user = decoded
            clients.set(ws, meta)

            ws.send(JSON.stringify({
              type: 'auth_ok',
              user: decoded,
              rooms: ROOMS,
              onlineUsers: getOnlineUsers(),
            }))

            ws.send(JSON.stringify({
              type: 'room_history',
              room: meta.room,
              messages: messageHistory[meta.room] || [],
            }))

            broadcast({ type: 'user_joined', user: { id: decoded.id, username: decoded.username }, onlineUsers: getOnlineUsers() }, ws)
          } catch {
            ws.send(JSON.stringify({ type: 'auth_error', message: 'Invalid token' }))
          }
          break
        }

        case 'join_room': {
          if (!meta.user) return
          const room = msg.room
          if (!ROOMS[room]) return
          meta.room = room
          clients.set(ws, meta)
          ws.send(JSON.stringify({
            type: 'room_history',
            room,
            messages: messageHistory[room] || [],
          }))
          break
        }

        case 'watch_thread': {
          if (!meta.user) return
          meta.watchingThread = msg.threadId || null
          clients.set(ws, meta)
          break
        }

        case 'unwatch_thread': {
          if (!meta.user) return
          meta.watchingThread = null
          clients.set(ws, meta)
          break
        }

        case 'chat_message': {
          if (!meta.user || !msg.text?.trim()) return
          const text = msg.text.trim().slice(0, 1000)
          const room = meta.room || 'general'
          const chatMsg = {
            id: `${Date.now()}-${meta.user.id}`,
            type: 'chat_message',
            room,
            user: { id: meta.user.id, username: meta.user.username },
            text,
            timestamp: new Date().toISOString(),
          }
          if (!messageHistory[room]) messageHistory[room] = []
          messageHistory[room].push(chatMsg)
          if (messageHistory[room].length > 100) messageHistory[room].shift()

          clients.forEach((m, c) => {
            if (m.room === room && c.readyState === WebSocket.OPEN) {
              c.send(JSON.stringify(chatMsg))
            }
          })
          break
        }

        case 'dm_message': {
          if (!meta.user || !msg.text?.trim() || !msg.toUserId) return
          const text = msg.text.trim().slice(0, 1000)
          const dmKey = [meta.user.id, msg.toUserId].sort().join('-')
          const dmMsg = {
            id: `${Date.now()}-dm`,
            type: 'dm_message',
            fromUser: { id: meta.user.id, username: meta.user.username },
            toUserId: msg.toUserId,
            text,
            timestamp: new Date().toISOString(),
          }
          if (!dmHistory[dmKey]) dmHistory[dmKey] = []
          dmHistory[dmKey].push(dmMsg)
          if (dmHistory[dmKey].length > 100) dmHistory[dmKey].shift()

          ws.send(JSON.stringify(dmMsg))
          sendToUser(msg.toUserId, dmMsg)
          break
        }

        case 'get_dm_history': {
          if (!meta.user || !msg.withUserId) return
          const dmKey = [meta.user.id, msg.withUserId].sort().join('-')
          ws.send(JSON.stringify({
            type: 'dm_history',
            withUserId: msg.withUserId,
            messages: dmHistory[dmKey] || [],
          }))
          break
        }

        case 'typing': {
          if (!meta.user) return
          clients.forEach((m, c) => {
            if (m.room === meta.room && c !== ws && c.readyState === WebSocket.OPEN) {
              c.send(JSON.stringify({ type: 'typing', username: meta.user.username, room: meta.room }))
            }
          })
          break
        }
      }
    })

    ws.on('close', () => {
      const user = meta.user
      clients.delete(ws)
      if (user) {
        broadcast({ type: 'user_left', user: { id: user.id, username: user.username }, onlineUsers: getOnlineUsers() })
      }
    })

    ws.on('error', () => clients.delete(ws))
  })

  console.log('[WS] WebSocket server initialized at /ws')
  return wss
}

module.exports = { initWss, ROOMS, broadcastForumEvent }
