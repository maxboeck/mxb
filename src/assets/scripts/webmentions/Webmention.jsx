import { h, Component } from 'preact'
import { DateTime } from 'luxon'

const readableDate = (iso) => {
    const date = new Date(iso)
    return DateTime.fromJSDate(date).toFormat('dd LLL yyyy')
}

export default class Webmention extends Component {
    renderAuthor() {
        const { author, url } = this.props
        const defaultAvatarSrc = '/assets/images/avatar-default.jpg'
        const avatar = author.photo ? (
            <img
                className="webmention__author__photo u-photo"
                src={defaultAvatarSrc}
                data-src={author.photo}
                alt={author.name}
                width={48}
                height={48}
                loading="lazy"
            />
        ) : (
            <img
                className="webmention__author__photo"
                src={defaultAvatarSrc}
                width={48}
                height={48}
                alt=""
            />
        )

        if (author) {
            return (
                <a
                    className="webmention__author h-card u-url"
                    href={url}
                    target="_blank"
                    rel="ugc nofollow"
                >
                    {avatar}
                    <strong className="p-name">{author.name}</strong>
                </a>
            )
        }

        return (
            <span className="webmention__author">
                {avatar}
                <strong>Anonymous</strong>
            </span>
        )
    }

    render({ id, author, published, content }) {
        const classNames = ['webmention']
        const ownDomains = [
            'https://mxb.at',
            'https://mxb.dev',
            'https://twitter.com/mxbck'
        ]
        if (ownDomains.includes(author.url)) {
            classNames.push('webmention--own')
        }
        return (
            <div className={classNames.join(' ')} id={`webmention-${id}`}>
                <div className="webmention__meta">
                    {this.renderAuthor()}
                    <span
                        className="webmention__meta__divider"
                        aria-hidden="true"
                    >
                        &sdot;
                    </span>
                    <time
                        className="webmention__pubdate dt-published"
                        datetime={published}
                    >
                        {readableDate(published)}
                    </time>
                </div>
                <div
                    className="webmention__content p-content"
                    dangerouslySetInnerHTML={{ __html: content.value }}
                />
            </div>
        )
    }
}
