import { h, render } from 'preact'
import sanitizeHTML from 'sanitize-html'
import App from './App'

const API_ORIGIN = 'https://webmention.io/api/mentions.jf2'
const BASE_URLS = ['https://mxb.at', 'https://mxb.dev']

const webmentionsElement = document.getElementById('webmentions')
const replaceElement = webmentionsElement.querySelector('[data-render-root]')

const fetchMentions = () => {
    const targetUrls = BASE_URLS.map(
        domain => `target[]=${domain + window.location.pathname}`
    ).join('&')
    let url = `${API_ORIGIN}?per-page=1000&${targetUrls}`

    return fetch(url)
        .then(response => response.json())
        .then(feed => feed.children || [])
        .catch(err => console.error(err))
}

const processMentions = webmentions => {
    const allowedTypes = ['in-reply-to', 'mention-of']
    const checkRequiredFields = entry => {
        const { author, published, content } = entry
        return !!author && !!author.name && !!published && !!content
    }
    return webmentions
        .filter(entry => allowedTypes.includes(entry['wm-property']))
        .filter(checkRequiredFields)
        .sort((a, b) => new Date(a.published) - new Date(b.published))
        .map(cleanMentions)
}

const cleanMentions = entry => {
    const { html, text } = entry.content
    const allowedHTML = {
        allowedTags: ['b', 'i', 'em', 'strong', 'a'],
        allowedAttributes: {
            a: ['href']
        }
    }

    if (html) {
        // really long html mentions, usually newsletters or compilations
        entry.content.value =
            html.length > 2000
                ? `mentioned this in <a href="${entry['wm-source']}">${entry['wm-source']}</a>`
                : sanitizeHTML(html, allowedHTML)
    } else {
        entry.content.value = sanitizeHTML(text, allowedHTML)
    }

    return entry
}

const getLikeCount = webmentions => {
    return webmentions.filter(entry => entry['wm-property'] === 'like-of')
        .length
}

if (webmentionsElement) {
    fetchMentions()
        .then(data => {
            const likeCount = getLikeCount(data)
            const webmentions = processMentions(data)

            if (data.length) {
                render(
                    <App webmentions={webmentions} likeCount={likeCount} />,
                    webmentionsElement,
                    replaceElement
                )
            }
        })
        .catch(err => {
            console.error(err)
        })
}
