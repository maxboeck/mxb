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
    let msg

    if (!notes.length) {
        msg = 'No notes found to process.'
        console.log(msg)
        return {
            statusCode: 404,
            body: msg
        }
    }

    // assume the last note is not yet syndicated
    const latestNote = notes[0]

    // Check the syndicate flag first to override publishing
    if (!latestNote.syndicate) {
        msg = 'Latest note has disabled syndication. No action taken.'
        console.log(msg)
        return {
            statusCode: 400,
            body: msg
        }
    }

    try {
        // check twitter for any tweets containing note URL.
        // if there are none, publish it.
        const q = await twitter.get('search/tweets', { q: latestNote.url })
        if (q.statuses && q.statuses.length === 0) {
            return publishNote(latestNote)
        } else {
            msg = 'Latest note was already syndicated. No action taken.'
            console.log(msg)
            return {
                statusCode: 400,
                body: msg
            }
        }
    } catch (err) {
        return handleError(err)
    }
}

// Prepare the content string for tweet format
const prepareStatusText = note => {
    const maxLength =
        280 - // max tweet size
        3 - //...
        1 - // space
        23 - // t.co link
        20 // safety padding

    let text = note.content.trim().replace(/<[^>]+>/g, '')

    // start all notes with emoji
    text = '🗒' + text

    // truncate note text if its too long for a tweet.
    if (text.length > maxLength) {
        text = text.substring(0, maxLength) + '...'
    }

    // include the note url at the end;
    text = text + ' ' + note.url
    return text
}

// Push a new note to Twitter
const publishNote = async note => {
    const statusText = prepareStatusText(note)
    console.log(statusText)

    try {
        // Actually Post to Twitter API (disabled)
        // const tweet = await twitter.post('statuses/update', { status: statusText })
        const msg = `Note ${note.date} successfully posted to twitter`
        console.log(msg)
        return {
            statusCode: 200,
            body: msg
        }
    } catch (err) {
        return handleError(err)
    }
}

// Main Lambda Function Handler
exports.handler = async () => {
    // Fetch the list of published notes to work on
    return fetch(NOTES_URL)
        .then(response => response.json())
        .then(processNotes)
        .catch(handleError)
}
