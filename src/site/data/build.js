const now = new Date()

module.exports = {
    env: process.env.ELEVENTY_ENV,
    timestamp: now,
    year: now.getFullYear()
}
