const fs = require('fs')
const fetch = require('node-fetch')
const unionBy = require('lodash/unionBy')

// Load .env variables with dotenv
require('dotenv').config()

// Define Cache Location and API Endpoint
const CACHE_FILE_PATH = '_cache/webmentions.json'
const API = 'https://webmention.io/api'
const DOMAIN = 'adellecharles.com'

async function fetchWebmentions(since, perPage = 100) {
    const token = process.env.WEBMENTION_IO_TOKEN
    if (!token) {
        // If we dont have a domain access token, abort
        console.warn(
            'unable to fetch webmentions: no access token specified in environment.'
        )
        return false
    }

    let url = `${API}/mentions.jf2?domain=${DOMAIN}&token=${token}&per-page=${perPage}`
    if (since) url += `&since=${since}`

    const response = await fetch(url)
    if (response.ok) {
        const feed = await response.json()
        console.log(`${feed.children.length} webmentions fetched from ${API}`)
        return feed
    }

    return null
}

// Merge fresh webmentions with cached entries, unique per id
function mergeWebmentions(a, b) {
    return unionBy(a.children, b.children, 'wm-id')
}

// save combined webmentions in cache file
function writeToCache(data) {
    const dir = '_cache'
    const fileContent = JSON.stringify(data, null, 2)
    // create cache folder if it doesnt exist already
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }
    // write data to cache json file
    fs.writeFile(CACHE_FILE_PATH, fileContent, err => {
        if (err) throw err
        console.log(`webmentions cached to ${CACHE_FILE_PATH}`)
    })
}

// get cache contents from json file
function readFromCache() {
    if (fs.existsSync(CACHE_FILE_PATH)) {
        const cacheFile = fs.readFileSync(CACHE_FILE_PATH)
        return JSON.parse(cacheFile)
    }
    return {
        lastFetched: null,
        children: []
    }
}

module.exports = async function() {
    const cache = readFromCache()

    // Only fetch new mentions in production
    if (process.env.NODE_ENV === 'prod') {
        const limit = cache.children.length ? 100 : 1000
        const feed = await fetchWebmentions(cache.lastFetched, limit)
        if (feed) {
            const webmentions = {
                lastFetched: new Date().toISOString(),
                children: mergeWebmentions(cache, feed)
            }

            writeToCache(webmentions)
            return webmentions
        }
    }

    console.log(`${cache.children.length} webmentions loaded from cache`)
    return cache
}
