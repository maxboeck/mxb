const timestamp = new Date()

function isCSSNakedDay() {
    const now = Date.now()
    const currentYear = new Date().getFullYear()
    const startEpoch = new Date(`${currentYear}-04-09T00:00:00+1400`).getTime()
    const endEpoch = new Date(`${currentYear}-04-09T23:59:59-1200`).getTime()
    return startEpoch <= now && now <= endEpoch
}

module.exports = {
    env: process.env.ELEVENTY_ENV,
    timestamp: timestamp,
    id: timestamp.valueOf(),
    naked: isCSSNakedDay()
}
