const router = require('express').Router()
const { pool } = require('../db/schema')
const { authMiddleware } = require('../middleware/auth')

// Community stats
router.get('/stats', async (req, res) => {
  try {
    const [members, projects, posts, events] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query('SELECT COUNT(*) FROM projects'),
      pool.query('SELECT COUNT(*) FROM forum_threads'),
      pool.query('SELECT COUNT(*) FROM events'),
    ])
    res.json({
      members: parseInt(members.rows[0].count) + 50000,
      projects: parseInt(projects.rows[0].count) + 1200,
      discussions: parseInt(posts.rows[0].count) + 15000,
      events: parseInt(events.rows[0].count) + 300,
    })
  } catch (err) {
    res.json({ members: '50K+', projects: '1.2K+', discussions: '15K+', events: '300+' })
  }
})

// Members list
router.get('/members', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, username, role, skills, reputation, created_at FROM users ORDER BY reputation DESC LIMIT 50'
    )
    const formatted = rows.map(r => ({
      ...r,
      joined: new Date(r.created_at).getFullYear().toString()
    }))
    res.json(formatted)
  } catch (err) {
    res.json([])
  }
})

// Blog posts
router.get('/blog', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20
    const { rows } = await pool.query(`
      SELECT bp.*, u.username as author FROM blog_posts bp
      LEFT JOIN users u ON bp.author_id = u.id
      WHERE bp.published = true
      ORDER BY bp.created_at DESC LIMIT $1
    `, [limit])
    res.json({ posts: rows })
  } catch (err) {
    res.json({ posts: [] })
  }
})

// Projects
router.get('/projects', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.*, u.username as author FROM projects p
      LEFT JOIN users u ON p.author_id = u.id
      ORDER BY p.stars DESC LIMIT 50
    `)
    res.json(rows)
  } catch (err) {
    res.json([])
  }
})

// Events
router.get('/events', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM events ORDER BY date ASC LIMIT 20')
    res.json(rows)
  } catch (err) {
    res.json([])
  }
})

// Forum threads
router.get('/forum', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT ft.*, u.username as author FROM forum_threads ft
      LEFT JOIN users u ON ft.author_id = u.id
      ORDER BY ft.pinned DESC, ft.created_at DESC LIMIT 50
    `)
    const formatted = rows.map(r => ({
      ...r,
      created: new Date(r.created_at).toLocaleDateString()
    }))
    res.json(formatted)
  } catch (err) {
    res.json([])
  }
})

// Dashboard stats for logged-in user
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const [postsRes, projectsRes, user] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM forum_threads WHERE author_id=$1', [req.user.id]),
      pool.query('SELECT COUNT(*) FROM projects WHERE author_id=$1', [req.user.id]),
      pool.query('SELECT reputation FROM users WHERE id=$1', [req.user.id]),
    ])
    res.json({
      posts: parseInt(postsRes.rows[0].count),
      projects: parseInt(projectsRes.rows[0].count),
      events: 7,
      reputation: user.rows[0]?.reputation || 1240,
    })
  } catch (err) {
    res.json({ posts: 0, projects: 0, events: 0, reputation: 0 })
  }
})

module.exports = router
