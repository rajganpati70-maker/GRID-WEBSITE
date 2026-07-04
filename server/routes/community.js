const router = require('express').Router()
const { pool } = require('../db/schema')
const { authMiddleware } = require('../middleware/auth')
const { broadcastForumEvent } = require('../ws')

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

    const [postsRes, projectsRes, recentPosts, recentProjects] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM forum_threads WHERE author_id=$1', [user.id]),
      pool.query('SELECT COUNT(*) FROM projects WHERE author_id=$1', [user.id]),
      pool.query('SELECT id, title, category, created_at FROM forum_threads WHERE author_id=$1 ORDER BY created_at DESC LIMIT 5', [user.id]),
      pool.query('SELECT id, title, category, stars, status FROM projects WHERE author_id=$1 ORDER BY created_at DESC LIMIT 5', [user.id]),
    ])

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

// Update own profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { bio, skills, location, avatar_color, github_url, twitter_url, linkedin_url, website_url } = req.body
    let cleanSkills = []
    if (Array.isArray(skills)) {
      cleanSkills = skills.filter(s => typeof s === 'string' && s.trim()).slice(0, 20).map(s => s.trim())
    } else if (typeof skills === 'string') {
      cleanSkills = skills.split(',').map(s => s.trim()).filter(Boolean).slice(0, 20)
    }

    const { rows } = await pool.query(
      `UPDATE users SET bio=$1, skills=$2, location=$3, avatar_color=$4,
        github_url=$5, twitter_url=$6, linkedin_url=$7, website_url=$8, updated_at=NOW()
       WHERE id=$9
       RETURNING id, username, email, role, bio, reputation, avatar_color, skills,
                 location, github_url, twitter_url, linkedin_url, website_url, created_at`,
      [bio ?? '', cleanSkills, location ?? '', avatar_color ?? '',
       github_url ?? '', twitter_url ?? '', linkedin_url ?? '', website_url ?? '',
       req.user.id]
    )
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' })
    res.json({ user: rows[0] })
  } catch (err) {
    console.error('Profile update error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Blog posts list
router.get('/blog', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20
    const { rows } = await pool.query(`
      SELECT bp.id, bp.title, bp.excerpt, bp.category, bp.tags,
             bp.views, bp.likes, bp.read_time, bp.cover_image, bp.created_at,
             u.username as author, u.avatar_color as author_avatar_color, u.role as author_role
      FROM blog_posts bp
      LEFT JOIN users u ON bp.author_id = u.id
      WHERE bp.published = true
      ORDER BY bp.created_at DESC LIMIT $1
    `, [limit])
    res.json({ posts: rows })
  } catch (err) {
    res.json({ posts: [] })
  }
})

// Single blog post
router.get('/blog/:postId', async (req, res) => {
  try {
    const { postId } = req.params
    const { rows } = await pool.query(`
      SELECT bp.*, u.username as author, u.avatar_color as author_avatar_color,
             u.role as author_role, u.bio as author_bio
      FROM blog_posts bp
      LEFT JOIN users u ON bp.author_id = u.id
      WHERE bp.id = $1 AND bp.published = true
    `, [postId])
    if (rows.length === 0) return res.status(404).json({ message: 'Post not found' })
    await pool.query('UPDATE blog_posts SET views = views + 1 WHERE id = $1', [postId])
    res.json({ post: { ...rows[0], views: rows[0].views + 1 } })
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Create blog post
router.post('/blog', authMiddleware, async (req, res) => {
  try {
    const { title, content, category, tags, cover_image } = req.body
    if (!title?.trim() || !content?.trim()) return res.status(400).json({ message: 'Title and content are required' })
    const stripped = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    const words = stripped.split(' ').filter(Boolean).length
    const readTime = `${Math.max(1, Math.ceil(words / 200))} min`
    const excerpt = stripped.slice(0, 220) + (stripped.length > 220 ? '…' : '')
    const cleanTags = Array.isArray(tags) ? tags.slice(0, 8) : []
    const { rows } = await pool.query(
      `INSERT INTO blog_posts (title, excerpt, content, author_id, category, tags, cover_image, read_time, published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true) RETURNING *`,
      [title.trim().slice(0, 255), excerpt, content, req.user.id,
       category || 'General', cleanTags, cover_image || '', readTime]
    )
    const post = rows[0]
    const userRes = await pool.query('SELECT username, avatar_color, role FROM users WHERE id=$1', [req.user.id])
    res.status(201).json({ post: { ...post, author: userRes.rows[0]?.username, author_avatar_color: userRes.rows[0]?.avatar_color } })
  } catch (err) {
    console.error('Create blog post error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Like a blog post
router.post('/blog/:postId/like', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params
    const { rows } = await pool.query(
      `UPDATE blog_posts SET likes = likes + 1 WHERE id=$1 RETURNING likes`, [postId]
    )
    res.json({ likes: rows[0]?.likes || 0 })
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' })
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

// Forum threads list
router.get('/forum', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT ft.*, u.username as author, u.avatar_color as author_avatar_color FROM forum_threads ft
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

// Get single thread with replies
router.get('/forum/:threadId', async (req, res) => {
  try {
    const { threadId } = req.params
    const threadRes = await pool.query(`
      SELECT ft.*, u.username as author, u.avatar_color as author_avatar_color, u.role as author_role
      FROM forum_threads ft
      LEFT JOIN users u ON ft.author_id = u.id
      WHERE ft.id = $1
    `, [threadId])

    if (threadRes.rows.length === 0) return res.status(404).json({ message: 'Thread not found' })
    const thread = threadRes.rows[0]

    // Increment views
    await pool.query('UPDATE forum_threads SET views = views + 1 WHERE id = $1', [threadId])

    // Get replies (top-level first, then nested)
    const repliesRes = await pool.query(`
      SELECT r.*, u.username as author, u.avatar_color as author_avatar_color, u.role as author_role
      FROM forum_replies r
      LEFT JOIN users u ON r.author_id = u.id
      WHERE r.thread_id = $1
      ORDER BY r.created_at ASC
    `, [threadId])

    res.json({ thread: { ...thread, views: thread.views + 1 }, replies: repliesRes.rows })
  } catch (err) {
    console.error('Thread fetch error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Create new thread
router.post('/forum', authMiddleware, async (req, res) => {
  try {
    const { title, content, category } = req.body
    if (!title?.trim() || !content?.trim()) return res.status(400).json({ message: 'Title and content are required' })

    const excerpt = content.trim().slice(0, 200) + (content.length > 200 ? '...' : '')
    const { rows } = await pool.query(
      `INSERT INTO forum_threads (title, content, excerpt, author_id, category)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title.trim().slice(0, 500), content.trim(), excerpt, req.user.id, category || 'General']
    )
    const thread = rows[0]

    // Fetch author info
    const userRes = await pool.query('SELECT username, avatar_color, role FROM users WHERE id=$1', [req.user.id])
    const result = { ...thread, author: userRes.rows[0]?.username, author_avatar_color: userRes.rows[0]?.avatar_color }

    // Broadcast to WS clients
    try { broadcastForumEvent({ type: 'forum_thread_new', thread: result }) } catch {}

    res.status(201).json(result)
  } catch (err) {
    console.error('Create thread error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Post a reply
router.post('/forum/:threadId/replies', authMiddleware, async (req, res) => {
  try {
    const { threadId } = req.params
    const { content, parent_id } = req.body
    if (!content?.trim()) return res.status(400).json({ message: 'Content is required' })

    // Verify thread exists
    const threadCheck = await pool.query('SELECT id, author_id, title FROM forum_threads WHERE id=$1', [threadId])
    if (threadCheck.rows.length === 0) return res.status(404).json({ message: 'Thread not found' })
    const threadInfo = threadCheck.rows[0]

    const { rows } = await pool.query(
      `INSERT INTO forum_replies (thread_id, parent_id, author_id, content)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [threadId, parent_id || null, req.user.id, content.trim().slice(0, 5000)]
    )
    const reply = rows[0]

    // Increment reply count on thread
    await pool.query('UPDATE forum_threads SET replies = replies + 1 WHERE id=$1', [threadId])

    // Fetch author info
    const userRes = await pool.query('SELECT username, avatar_color, role FROM users WHERE id=$1', [req.user.id])
    const fullReply = { ...reply, author: userRes.rows[0]?.username, author_avatar_color: userRes.rows[0]?.avatar_color, author_role: userRes.rows[0]?.role }

    // Broadcast new reply to all WS clients watching this thread
    try {
      broadcastForumEvent({
        type: 'forum_reply_new',
        threadId: parseInt(threadId),
        threadTitle: threadInfo.title,
        threadAuthorId: threadInfo.author_id,
        reply: fullReply,
      })
    } catch {}

    res.status(201).json(fullReply)
  } catch (err) {
    console.error('Post reply error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Upvote thread
router.post('/forum/:threadId/upvote', authMiddleware, async (req, res) => {
  try {
    const { threadId } = req.params
    const voteRes = await pool.query(
      `INSERT INTO forum_votes (user_id, target_type, target_id) VALUES ($1, 'thread', $2)
       ON CONFLICT (user_id, target_type, target_id) DO NOTHING RETURNING id`,
      [req.user.id, threadId]
    )
    let likesRes
    if (voteRes.rows.length > 0) {
      likesRes = await pool.query(
        `UPDATE forum_threads SET likes = likes + 1 WHERE id=$1 RETURNING likes`,
        [threadId]
      )
    } else {
      likesRes = await pool.query('SELECT likes FROM forum_threads WHERE id=$1', [threadId])
    }
    res.json({ likes: likesRes.rows[0]?.likes || 0 })
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Upvote reply
router.post('/forum/replies/:replyId/upvote', authMiddleware, async (req, res) => {
  try {
    const { replyId } = req.params
    const voteRes = await pool.query(
      `INSERT INTO forum_votes (user_id, target_type, target_id) VALUES ($1, 'reply', $2)
       ON CONFLICT (user_id, target_type, target_id) DO NOTHING RETURNING id`,
      [req.user.id, replyId]
    )
    let likesRes
    if (voteRes.rows.length > 0) {
      likesRes = await pool.query(
        `UPDATE forum_replies SET likes = likes + 1 WHERE id=$1 RETURNING likes`,
        [replyId]
      )
    } else {
      likesRes = await pool.query('SELECT likes FROM forum_replies WHERE id=$1', [replyId])
    }
    res.json({ likes: likesRes.rows[0]?.likes || 0 })
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Dashboard stats
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
