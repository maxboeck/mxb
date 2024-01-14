const fs = require('fs')
const fetch = require('node-fetch')
const unionBy = require('lodash/unionBy')
const domain = require('./site.json').domain

// Load .env variables with dotenv
require('dotenv').config()

// Define Cache Location and API Endpoint
const CACHE_DIR = 'cache'
const API = 'https://webmention.io/api'
const TOKEN = process.env.WEBMENTION_IO_TOKEN

async function fetchWebmentions(since, perPage = 100000) {
    if (!domain) {
        // If we dont have a domain name, abort
        console.warn(
            '>>> unable to fetch webmentions: no domain name specified in site.json'
        )
        return false
    }

    if (!TOKEN) {
        // If we dont have a domain access token, abort
        console.warn(
            '>>> unable to fetch webmentions: no access token specified in environment.'
        )
        return false
    }

    let url = `${API}/mentions.jf2?domain=${domain}&token=${TOKEN}&per-page=${perPage}`
    if (since) url += `&since=${since}`

    const response = await fetch(url)
    if (response.ok) {
        const feed = await response.json()
        console.log(
            `>>> ${feed.children.length} new webmentions fetched from ${API}`
        )
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
    const filePath = `${CACHE_DIR}/webmentions.json`
    const fileContent = JSON.stringify(data, null, 2)
    // create cache folder if it doesnt exist already
    if (!fs.existsSync(CACHE_DIR)) {
        fs.mkdirSync(CACHE_DIR)
    }
    // write data to cache json file
    fs.writeFile(filePath, fileContent, (err) => {
        if (err) throw err
        console.log(`>>> webmentions saved to ${filePath}`)
    })
}

// get cache contents from json file
function readFromCache() {
    const filePath = `${CACHE_DIR}/webmentions.json`

    if (fs.existsSync(filePath)) {
        const cacheFile = fs.readFileSync(filePath)
        return JSON.parse(cacheFile)
    }

    // no cache found.
    return {
        lastFetched: null,
        children: []
    }
}

module.exports = async function () {
    const cache = readFromCache()

    if (cache.children.length) {
        console.log(
            `>>> ${cache.children.length} webmentions loaded from cache`
        )
    }

    // Only fetch new mentions in production
    if (process.env.ELEVENTY_ENV === 'production') {
        const feed = await fetchWebmentions(cache.lastFetched)
        if (feed) {
            const webmentions = {
                lastFetched: new Date().toISOString(),
                children: mergeWebmentions(cache, feed)
            }

            writeToCache(webmentions)
            return webmentions
        }
    }

    return cache
}
