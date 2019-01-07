import { h, Component } from 'preact'

export default class Icon extends Component {
    render({ name }) {
        const href = `/assets/icons/icons.sprite.svg#icon-${name}`
        return (
            <svg
                className={`icon icon--${name}`}
                role="img"
                aria-hidden="true"
                width={24}
                height={24}
            >
                <use
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    xlinkHref={href}
                />
            </svg>
        )
    }
}
