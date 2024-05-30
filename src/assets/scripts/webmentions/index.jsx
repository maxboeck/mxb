import { h, render } from 'preact'
import { DateTime } from 'luxon'
import DOMPurify from 'dompurify'
import App from './App'

const API_ORIGIN = 'https://webmention.io/api/mentions.jf2'
const BASE_URL = 'https://mxb.dev'

const webmentionsElement = document.getElementById('webmentions')
const replaceElement = webmentionsElement.querySelector('[data-render-root]')
const lastFetchedTimestamp = webmentionsElement.dataset.lastFetched

const fetchMentions = () => {
    const target = BASE_URL + window.location.pathname
    const url = `${API_ORIGIN}?per-page=1000&target=${target}`

    return fetch(url)
        .then((response) => response.json())
        .then((feed) => feed.children || [])
        .catch((err) => console.error(err))
}

const processMentions = (webmentions) => {
    const allowedTypes = ['in-reply-to', 'mention-of']
    const checkRequiredFields = (entry) => {
        const { author, published, content } = entry
        return !!author && !!author.name && !!published && !!content
    }
    return webmentions
        .filter((entry) => allowedTypes.includes(entry['wm-property']))
        .filter(checkRequiredFields)
        .sort((a, b) => new Date(a.published) - new Date(b.published))
        .map(cleanMentions)
}

const cleanMentions = (entry) => {
    const { html, text } = entry.content
    const allowedHTML = {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
        ALLOWED_ATTR: ['href']
    }

    if (html) {
        // really long html mentions, usually newsletters or compilations
        entry.content.value =
            html.length > 2000
                ? `mentioned this in <a href="${entry['wm-source']}">${entry['wm-source']}</a>`
                : DOMPurify.sanitize(html, allowedHTML)
    } else {
        entry.content.value = DOMPurify.sanitize(text, allowedHTML)
    }

    return entry
}

// initialize webmentions
;(function () {
    // if there's no root node on the page, abort
    if (!webmentionsElement) {
        return false
    }

    // if it's been less than 24 hours since the serverside fetch, abort
    if (lastFetchedTimestamp) {
        const now = DateTime.utc()
        const lastFetched = DateTime.fromISO(lastFetchedTimestamp, {
            zone: 'utc'
        })
        if (lastFetched.plus({ hours: 24 }) > now) {
            return false
        }
    }

    fetchMentions()
        .then((data) => {
            const webmentions = processMentions(data)

            if (data.length) {
                render(
                    <App webmentions={webmentions} />,
                    webmentionsElement,
                    replaceElement
                )
            }
        })
        .catch((err) => {
            console.error(err)
        })
})()
