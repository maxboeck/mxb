// Main Lambda Function Handler
exports.handler = async (event, context, callback) => {
    callback(null, {
        statusCode: 200,
        body: 'Publish Function'
    })
}
