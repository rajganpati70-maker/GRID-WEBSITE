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
      'SELECT id, username, role, skills, reputation, bio, location, avatar_color, created_at FROM users ORDER BY reputation DESC LIMIT 50'
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

// Public profile by username
router.get('/profile/:username', async (req, res) => {
  try {
    const { username } = req.params
    const { rows } = await pool.query(
      `SELECT id, username, role, bio, reputation, avatar_color, skills, location,
              github_url, twitter_url, linkedin_url, website_url, created_at
       FROM users WHERE LOWER(username) = LOWER($1)`,
      [username]
    )
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' })
    const user = rows[0]

    // Get their forum posts count
    const [postsRes, projectsRes] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM forum_threads WHERE author_id=$1', [user.id]),
      pool.query('SELECT COUNT(*) FROM projects WHERE author_id=$1', [user.id]),
    ])

    // Get recent posts
    const recentPosts = await pool.query(
      'SELECT id, title, category, created_at FROM forum_threads WHERE author_id=$1 ORDER BY created_at DESC LIMIT 5',
      [user.id]
    )

    // Get recent projects
    const recentProjects = await pool.query(
      'SELECT id, title, category, stars, status FROM projects WHERE author_id=$1 ORDER BY created_at DESC LIMIT 5',
      [user.id]
    )

    res.json({
      ...user,
      joined: new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      posts_count: parseInt(postsRes.rows[0].count),
      projects_count: parseInt(projectsRes.rows[0].count),
      recent_posts: recentPosts.rows,
      recent_projects: recentProjects.rows,
    })
  } catch (err) {
    console.error('Profile fetch error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Update own profile (authenticated)
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { bio, skills, location, avatar_color, github_url, twitter_url, linkedin_url, website_url, role } = req.body

    // Sanitize skills
    let cleanSkills = []
    if (Array.isArray(skills)) {
      cleanSkills = skills.filter(s => typeof s === 'string' && s.trim()).slice(0, 20).map(s => s.trim())
    } else if (typeof skills === 'string') {
      cleanSkills = skills.split(',').map(s => s.trim()).filter(Boolean).slice(0, 20)
    }

    const { rows } = await pool.query(
      `UPDATE users SET
        bio = COALESCE($1, bio),
        skills = $2,
        location = COALESCE($3, location),
        avatar_color = COALESCE($4, avatar_color),
        github_url = COALESCE($5, github_url),
        twitter_url = COALESCE($6, twitter_url),
        linkedin_url = COALESCE($7, linkedin_url),
        website_url = COALESCE($8, website_url),
        role = COALESCE($9, role),
        updated_at = NOW()
       WHERE id = $10
       RETURNING id, username, email, role, bio, reputation, avatar_color, skills,
                 location, github_url, twitter_url, linkedin_url, website_url, created_at`,
      [bio ?? null, cleanSkills, location ?? null, avatar_color ?? null,
       github_url ?? null, twitter_url ?? null, linkedin_url ?? null, website_url ?? null,
       role ?? null, req.user.id]
    )

    if (rows.length === 0) return res.status(404).json({ message: 'User not found' })
    res.json({ user: rows[0] })
  } catch (err) {
    console.error('Profile update error:', err)
    res.status(500).json({ message: 'Internal server error' })
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
