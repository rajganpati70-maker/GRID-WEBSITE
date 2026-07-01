const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

const initDB = async () => {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'Developer',
        bio TEXT DEFAULT '',
        reputation INTEGER DEFAULT 0,
        avatar_url TEXT DEFAULT '',
        avatar_color VARCHAR(20) DEFAULT '',
        skills TEXT[] DEFAULT '{}',
        location VARCHAR(150) DEFAULT '',
        github_url VARCHAR(255) DEFAULT '',
        twitter_url VARCHAR(255) DEFAULT '',
        linkedin_url VARCHAR(255) DEFAULT '',
        website_url VARCHAR(255) DEFAULT '',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        excerpt TEXT,
        content TEXT,
        author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        category VARCHAR(100) DEFAULT 'General',
        tags TEXT[] DEFAULT '{}',
        published BOOLEAN DEFAULT true,
        views INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        read_time VARCHAR(20) DEFAULT '5 min',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        category VARCHAR(100) DEFAULT 'General',
        github_url TEXT DEFAULT '',
        demo_url TEXT DEFAULT '',
        tags TEXT[] DEFAULT '{}',
        stars INTEGER DEFAULT 0,
        forks INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        type VARCHAR(100) DEFAULT 'Event',
        date DATE,
        time VARCHAR(50),
        location VARCHAR(255),
        attendees INTEGER DEFAULT 0,
        tags TEXT[] DEFAULT '{}',
        organizer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS forum_threads (
        id SERIAL PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        excerpt TEXT,
        content TEXT,
        author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        category VARCHAR(100) DEFAULT 'General',
        replies INTEGER DEFAULT 0,
        views INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        pinned BOOLEAN DEFAULT false,
        hot BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS forum_replies (
        id SERIAL PRIMARY KEY,
        thread_id INTEGER REFERENCES forum_threads(id) ON DELETE CASCADE NOT NULL,
        parent_id INTEGER REFERENCES forum_replies(id) ON DELETE CASCADE,
        author_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        content TEXT NOT NULL,
        likes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS forum_votes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        target_type VARCHAR(20) NOT NULL,
        target_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, target_type, target_id)
      );
    `)

    const alterStatements = [
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_color VARCHAR(20) DEFAULT ''`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS location VARCHAR(150) DEFAULT ''`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS github_url VARCHAR(255) DEFAULT ''`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS twitter_url VARCHAR(255) DEFAULT ''`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(255) DEFAULT ''`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS website_url VARCHAR(255) DEFAULT ''`,
      `ALTER TABLE forum_threads ADD COLUMN IF NOT EXISTS content TEXT`,
    ]
    for (const stmt of alterStatements) {
      await client.query(stmt)
    }

    console.log('[DB] Schema initialized successfully')
  } finally {
    client.release()
  }
}

module.exports = { pool, initDB }
