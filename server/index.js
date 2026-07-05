require('dotenv').config()
const http = require('http')
const express = require('express')
const cors = require('cors')
const path = require('path')
const { initDB } = require('./db/schema')
const { initWss } = require('./ws')

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 3001

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : null
app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (server-to-server, curl, mobile apps)
    if (!origin) return cb(null, true)
    if (!ALLOWED_ORIGINS) return cb(null, true) // dev fallback: allow all
    const isAllowed = ALLOWED_ORIGINS.some(allowed => origin === allowed)
    cb(isAllowed ? null : new Error('CORS: origin not allowed'), isAllowed)
  },
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const authRoutes = require('./routes/auth')
const communityRoutes = require('./routes/community')

app.use('/api/auth', authRoutes)
app.use('/api', communityRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'online', service: 'GRID API v1', ws: 'enabled' }))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')))
  app.get('*', (req, res, next) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/ws')) {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'))
    } else {
      next()
    }
  })
}

const start = async () => {
  try {
    await initDB()
    initWss(server)
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`[GRID API] Running on port ${PORT}`)
      console.log(`[GRID WS]  WebSocket ready at ws://localhost:${PORT}/ws`)
    })
  } catch (err) {
    console.error('Failed to start:', err)
    process.exit(1)
  }
}

start()
