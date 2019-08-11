import { h } from 'preact'

const Icon = ({ children, ...props }) => {
    const { name } = props
    const spriteUrl = '/assets/icons/icons.sprite.svg'
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
                xlinkHref={`${spriteUrl}#icon-${name}`}
            />
        </svg>
    )
}

const Alert = ({ children, ...props }) => {
    const { success, message } = props
    const alertType = success ? 'alert--success' : 'alert--error'
    const iconType = success ? 'check' : 'warning'

    return (
        <div className={`alert ${alertType}`}>
            <Icon name={iconType} />
            {message}
        </div>
    )
}

export default Alert
