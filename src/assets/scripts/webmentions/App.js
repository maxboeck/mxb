import { h, Component } from 'preact'

import Webmention from './Webmention'
import Icon from './Icon'

export default class App extends Component {
    componentDidMount() {
        if (window.initLazyLoad && typeof window.initLazyLoad === 'function') {
            window.initLazyLoad()
        }
    }

    renderMentionsList(webmentions) {
        return (
            <ol className="webmentions__list">
                {webmentions.map((item) => {
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

    expandList(e) {
        e.preventDefault()
        const section = document.getElementById('webmentions')

        if (section) {
            section.classList.remove('webmentions--truncated')
            section.classList.add('webmentions--expanded')
        }
    }

    render({ webmentions }) {
        if (!webmentions.length) {
            return <p className="webmentions__empty">No webmentions yet.</p>
        }

        const isTruncated = Boolean(webmentions.length > 5)
        return (
            <div data-rendered>
                <div className="webmentions__preview">
                    {this.renderMentionsList(webmentions.slice(0, 5))}
                </div>
                {isTruncated && (
                    <div>
                        <a
                            className="webmentions__showall"
                            href="#webmentions"
                            onClick={this.expandList}
                        >
                            <Icon name="message" />
                            Show All Webmentions ({webmentions.length})
                        </a>
                        <div className="webmentions__content">
                            {this.renderMentionsList(webmentions.slice(5))}
                        </div>
                    </div>
                )}
            </div>
        )
    }
}
