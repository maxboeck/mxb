const fs = require('fs')
const fetch = require('node-fetch')
const unionBy = require('lodash/unionBy')
const CACHE_FILE_PATH = '_cache/webmentions.json'

async function fetchWebmentions(since) {
    const api = 'https://webmention.io/api'
    const domain = 'mxb.at'
    const token = 'YeVnV9N0sG0W59gLboityA'

    let url = `${api}/mentions.jf2?domain=${domain}&token=${token}&per-page=100`
    if (since) {
        url += `&since=${since}`
    }

    const response = await fetch(url)
    const feed = await response.json()

    console.log(`${feed.children.length} webmentions fetched from ${api}`)
    return feed
}

function mergeWebmentions(a, b) {
    return unionBy(a.children, b.children, 'wm-id')
}

function writeToCache(data) {
    const fileContent = JSON.stringify(data, null, 2)
    fs.writeFile(CACHE_FILE_PATH, fileContent, err => {
        if (err) throw err
        console.log(`webmentions cached to ${CACHE_FILE_PATH}`)
    })
}

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

    if (process.env.ELEVENTY_ENV === 'prod') {
        const feed = await fetchWebmentions(cache.lastFetched)
        const webmentions = {
            lastFetched: new Date().toISOString(),
            children: mergeWebmentions(cache, feed)
        }

        writeToCache(webmentions)
        return webmentions
    }

    console.log(`${cache.children.length} webmentions loaded from cache`)
    return cache
}
