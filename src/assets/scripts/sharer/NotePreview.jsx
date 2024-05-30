import { h, Component } from 'preact'
import { DateTime } from 'luxon'

export default class NotePreview extends Component {
    previewContent() {
        const { title, url, via, body } = this.props
        const content = []

        const handleLink = (handle) => {
            if (handle.charAt(0) === '@') {
                return (
                    <a href={`https://twitter.com/${handle.substring(1)}`}>
                        {handle}
                    </a>
                )
            }
            return handle
        }
        const viaLink = via.trim().length ? (
            <span> (via {handleLink(via)})</span>
        ) : null

        if (title.trim().length) {
            content.push(
                <h2 key="n-title" className="note__title">
                    {title}
                </h2>
            )
        }

        if (body || via) {
            content.push(
                <p key="n-body">
                    {body}
                    {viaLink}
                </p>
            )
        }

        if (url) {
            content.push(
                <a href={url} key="n-url">
                    {url}
                </a>
            )
        }

        return content
    }

    renderMeta() {
        const date = new Date()
        const dateString = DateTime.fromJSDate(date).toFormat(
            'dd LLL yyyy - HH:mm'
        )

        return (
            <div className="note__meta">
                <p className="note__author">
                    <span className="note__author__link">
                        <img
                            className="note__author__photo"
                            src={assetUrls.avatar}
                        />
                        <strong className="note__author__name">@mxbck</strong>
                    </span>
                </p>
                <span className="note__meta__divider" aria-hidden="true">
                    &sdot;
                </span>
                <time className="note__date">{dateString}</time>
                <div className="note__tags">
                    <span className="note__tag">link</span>
                </div>
            </div>
        )
    }

    render(props) {
        return (
            <div className="note">
                <div className="note__main">
                    {this.renderMeta()}
                    <div className="note__content" style={{ minHeight: 100 }}>
                        <div className="markdown">{this.previewContent()}</div>
                    </div>
                </div>
            </div>
        )
    }
}
