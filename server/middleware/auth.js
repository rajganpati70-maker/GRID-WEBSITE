const jwt = require('jsonwebtoken')

if (!process.env.JWT_SECRET) {
  console.warn('[GRID] WARNING: JWT_SECRET is not set — using insecure default. Set a strong secret in production.')
}
const JWT_SECRET = process.env.JWT_SECRET || 'grid_community_secret_2025'

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' })
  }
  const token = header.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

module.exports = { authMiddleware, JWT_SECRET }
