const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { pool } = require('../db/schema')
const { authMiddleware, JWT_SECRET } = require('../middleware/auth')

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body
    if (!username || !email || !password) return res.status(400).json({ message: 'All fields are required' })
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' })
    if (username.length < 3) return res.status(400).json({ message: 'Username must be at least 3 characters' })

    const exists = await pool.query('SELECT id FROM users WHERE email=$1 OR username=$2', [email, username])
    if (exists.rows.length > 0) {
      const row = exists.rows[0]
      const conflict = await pool.query('SELECT username, email FROM users WHERE id=$1', [row.id])
      if (conflict.rows[0].email === email) return res.status(409).json({ message: 'Email already registered' })
      return res.status(409).json({ message: 'Username already taken' })
    }

    const hash = await bcrypt.hash(password, 12)
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES ($1,$2,$3,$4) RETURNING id, username, email, role, reputation, created_at',
      [username, email, hash, role || 'Developer']
    )
    const user = result.rows[0]
    const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({ token, user })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' })

    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email])
    if (result.rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' })

    const user = result.rows[0]
    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' })

    const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
    const { password_hash, ...safeUser } = user
    res.json({ token, user: safeUser })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, username, email, role, bio, reputation, skills, avatar_color,
              location, github_url, twitter_url, linkedin_url, website_url, created_at
       FROM users WHERE id=$1`,
      [req.user.id]
    )
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' })
    res.json({ user: result.rows[0] })
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

module.exports = router
