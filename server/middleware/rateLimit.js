const attempts = new Map()

const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 5

setInterval(() => {
  const now = Date.now()
  for (const [key, data] of attempts) {
    if (now - data.start > WINDOW_MS) attempts.delete(key)
  }
}, 60 * 1000)

export function loginRateLimit(req, res, next) {
  const ip = req.ip || req.connection?.remoteAddress || "unknown"
  const key = `login:${ip}`

  const now = Date.now()
  let data = attempts.get(key)

  if (!data || now - data.start > WINDOW_MS) {
    data = { count: 0, start: now }
    attempts.set(key, data)
  }

  data.count++

  if (data.count > MAX_ATTEMPTS) {
    const remaining = Math.ceil((WINDOW_MS - (now - data.start)) / 1000)
    return res.status(429).json({
      error: `Too many login attempts. Try again in ${remaining} seconds.`,
    })
  }

  next()
}

export default { loginRateLimit }
