const jwt = require('jsonwebtoken')

if (!process.env.JWT_SECRET) {
  console.error('[GRID] FATAL: JWT_SECRET environment variable is not set. Refusing to start.')
  process.exit(1)
}
const JWT_SECRET = process.env.JWT_SECRET

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
