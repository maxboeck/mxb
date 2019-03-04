import { h, render } from 'preact'
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
        .then(feed => {
            if (feed.children && feed.children.length) {
                return processMentions(feed.children)
            }
            return []
        })
        .catch(err => console.error(err))
}

const processMentions = webmentions => {
    const allowedTypes = ['in-reply-to', 'mention-of']
    return webmentions
        .filter(entry => allowedTypes.includes(entry['wm-property']))
        .filter(entry => !!entry.content)
        .sort((a, b) => new Date(a.published) - new Date(b.published))
}

const renderMentions = webmentions => {
    if (webmentions.length) {
        render(
            <App webmentions={webmentions} />,
            webmentionsElement,
            replaceElement
        )
    }
}

if (webmentionsElement) {
    fetchMentions()
        .then(renderMentions)
        .catch(err => {
            console.error(err)
        })
}
