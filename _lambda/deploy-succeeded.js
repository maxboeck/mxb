import fetch from 'node-fetch'
import dotenv from 'dotenv'
import Twitter from 'twitter'

dotenv.config()

const twitter = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

const publishNote = async note => {
    // extract content for tweet
    const { content } = note
    twitter.post('statuses/update', { status: content })
}

const processNotes = async notes => {
    // check if we have a note that should be published
    if (!notes.length) {
        return {
            statusCode: 404,
            body: 'no notes found'
        }
    }

    // assume the last note is not yet published -
    // check twitter for any tweets containing its URL.
    // if there are, abort the process.
    const latestNote = notes[0]
    twitter.get('search/tweets', { q: latestNote.url }, (err, tweets) => {
        if (tweets.length) {
            return {
                statusCode: 400,
                body: 'last note was already published'
            }
        }
    })

    return {
        statusCode: 200,
        body: `note syndicated to twitter`
    }
}

exports.handler = async (event, context) => {
    // TODO: remove when done
    if (process.env.ELEVENTY_ENV !== 'dev') {
        return {
            statusCode: 403,
            body: 'Forbidden'
        }
    }

    const notesUrl = 'https://mxb.at/notes.json'
    return fetch(notesUrl)
        .then(response => response.json())
        .then(processNotes)
        .catch(err => ({
            statusCode: 422,
            body: String(err)
        }))
}
