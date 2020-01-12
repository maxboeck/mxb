const timestamp = new Date()

module.exports = {
    env: process.env.NODE_ENV,
    timestamp: timestamp,
    id: timestamp.valueOf()
}
