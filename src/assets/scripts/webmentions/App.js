import { h, Component } from 'preact'
import sanitizeHTML from 'sanitize-html'

import Webmention from './Webmention'
import Icon from './Icon'

export default class App extends Component {
    clean(webmentions) {
        const options = {
            allowedTags: ['b', 'i', 'em', 'strong', 'a'],
            allowedAttributes: {
                a: ['href']
            }
        }

        return webmentions.map(entry => {
            const { content } = entry
            if (content['content-type'] === 'text/html') {
                if (content.value.length > 2000) {
                    // really long html mentions, usually newsletters or compilations
                    entry.content.value = `mentioned this in <a href="${
                        entry.url
                    }">${entry.url}</a>`
                }
                // sanitize HTML
                content.value = sanitizeHTML(content.value, options)
            }
            return entry
        })
    }

    renderMentionsHeader(webmentions) {
        const faces = webmentions.slice(0, 5).map(entry => {
            const imgSrc =
                entry.author.photo || '/assets/images/avatar-default.jpg'
            return (
                <img
                    key={entry['wm-id']}
                    className="webmentions__faces__img"
                    src={imgSrc}
                    title={entry.author.name}
                    alt=""
                />
            )
        })
        if (webmentions.length > 5) {
            faces.push(
                <span className="webmentions__faces__more">
                    +{webmentions.length - 5}
                </span>
            )
        }
        return (
            <div className="webmentions__header">
                <a href="#webmentions" class="webmentions__toggle">
                    <Icon name="message" /> Show All ({webmentions.length})
                </a>
                <div className="webmentions__faces">{faces}</div>
                <a
                    href="https://indieweb.org/Webmention"
                    className="webmentions__info"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Icon name="question" />
                    What’s this?
                </a>
            </div>
        )
    }

    renderMentionsList(webmentions) {
        return (
            <ol className="webmentions__list">
                {webmentions.map(item => {
                    const {
                        'wm-id': id,
                        url,
                        author,
                        published,
                        content
                    } = item
                    return (
                        <li className="webmentions__item" key={id}>
                            <Webmention
                                id={id}
                                url={url}
                                author={author}
                                content={content}
                                published={published}
                            />
                        </li>
                    )
                })}
            </ol>
        )
    }

    render({ webmentions }) {
        if (!webmentions.length) {
            return <p>No webmentions yet.</p>
        }

        webmentions = this.clean(webmentions)
        return (
            <div data-rendered>
                {this.renderMentionsHeader(webmentions)}
                <div className="webmentions__content">
                    {this.renderMentionsList(webmentions)}
                </div>
            </div>
        )
    }
}
