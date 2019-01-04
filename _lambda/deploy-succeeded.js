import fetch from 'node-fetch'
import dotenv from 'dotenv'
import Twitter from 'twitter'

dotenv.config()

// URL of notes JSON feed
const NOTES_URL = 'https://mxb.at/notes.json'

// Configure Twitter API Client
const twitter = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

// Helper Function to return unknown errors
const handleError = err => ({
    statusCode: 422,
    body: String(err)
})

// Check exisiting notes if there's one to tweet
const processNotes = async notes => {
    if (!notes.length) {
        return {
            statusCode: 404,
            body: 'No notes found'
        }
    }

    // assume the last note is not yet syndicated -
    // check twitter for any tweets containing its URL.
    // if there are, abort the process.
    const latestNote = notes[0]

    try {
        const q = await twitter.get('search/tweets', { q: latestNote.url })
        if (q.statuses && q.statuses.length === 0) {
            return publishNote(latestNote)
        } else {
            return {
                statusCode: 400,
                body: 'Latest note was already syndicated to twitter'
            }
        }
    } catch (err) {
        return handleError(err)
    }
}

// TODO: prepare content string for tweet format
const prepareStatusText = content => {
    return content.trim().replace(/<[^>]+>/g, '')
}

// Push a new note to Twitter
const publishNote = async note => {
    const { content, date } = note
    const statusText = prepareStatusText(content)

    try {
        // Actually Post to Twitter API (disabled)
        // const tweet = await twitter.post('statuses/update', { status: statusText })
        return {
            statusCode: 200,
            body: `Note ${date} successfully syndicated on twitter`
        }
    } catch (err) {
        return handleError(err)
    }
}

// Main Lambda Function Handler
exports.handler = async event => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed'
        }
    }

    // Fetch the list of published notes to work on
    return fetch(NOTES_URL)
        .then(response => response.json())
        .then(processNotes)
        .catch(handleError)
}
