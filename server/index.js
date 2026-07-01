require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const { initDB } = require('./db/schema')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const authRoutes = require('./routes/auth')
const communityRoutes = require('./routes/community')

app.use('/api/auth', authRoutes)
app.use('/api', communityRoutes)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'))
  })
}

app.get('/api/health', (req, res) => res.json({ status: 'online', service: 'GRID API v1' }))

const start = async () => {
  try {
    await initDB()
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[GRID API] Running on port ${PORT}`)
    })
  } catch (err) {
    console.error('Failed to start:', err)
    process.exit(1)
  }
}

start()
