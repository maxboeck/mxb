import querystring from 'querystring'

// Main Lambda Function Handler
exports.handler = async (event, context, callback) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' }
    }
    const params = querystring.parse(event.body)

    callback(null, {
        statusCode: 200,
        body: `Publish: ${params.title}`
    })
}
