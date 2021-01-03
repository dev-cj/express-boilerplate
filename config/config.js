const env_vars = process.env

const MONGODB_URL = env_vars.MONGODB_URL
const port = env_vars.PORT
const env = env_vars.NODE_ENV
const COOKIE = env_vars.COOKIE
const JWT_SECRET = env_vars.JWT_SECRET
module.exports = { MONGODB_URL, port, env, COOKIE, JWT_SECRET }
