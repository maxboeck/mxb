import { h, Component } from 'preact'

const readableDate = iso => {
    const date = new Date(iso)
    const year = date.getFullYear()
    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ]

    let month = monthNames[date.getMonth()]
    let dt = date.getDate()

    if (dt < 10) {
        dt = '0' + dt
    }

    return `${dt} ${month} ${year}`
}

export default class Webmention extends Component {
    renderAuthor() {
        const { author, url } = this.props
        const defaultAvatarSrc = '/assets/images/avatar-default.jpg'
        const avatar = author.photo ? (
            <img
                className="webmention__author__photo u-photo"
                src={author.photo}
                alt={author.name}
            />
        ) : (
            <img
                className="webmention__author__photo"
                src={defaultAvatarSrc}
                alt=""
            />
        )

        if (author) {
            return (
                <a
                    className="webmention__author h-card u-url"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
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
        if (author.url === 'https://mxb.at') {
            classNames.push('webmention--own')
        }
        return (
            <div className={classNames.join(' ')} id={`webmention-${id}`}>
                <div className="webmention__meta">
                    {this.renderAuthor()}
                    <span className="webmention__meta__divider">&sdot;</span>
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
