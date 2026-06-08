import jwt from "jsonwebtoken"

import crypto from "crypto"

if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("FATAL: JWT_SECRET environment variable is required in production")
  }
  console.warn("WARNING: JWT_SECRET not set — using random secret, tokens invalidated on restart")
}
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString("hex")

export function generateToken(username) {
  return jwt.sign({ username }, JWT_SECRET, { expiresIn: "7d" })
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" })
  }

  const token = header.split(" ")[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" })
  }
}

export default { generateToken, requireAuth }
