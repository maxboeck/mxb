const timestamp = new Date()

module.exports = {
    env: process.env.ELEVENTY_ENV,
    timestamp: timestamp,
    id: timestamp.valueOf()
}
