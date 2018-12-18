module.exports = function(value) {
    const date = new Date(value)
    return date.toISOString()
}
