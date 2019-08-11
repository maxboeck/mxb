import { h } from 'preact'

const Alert = ({ children, ...props }) => {
    const { success, message } = props
    const alertType = success ? 'alert--success' : 'alert--error'

    return <div className={`alert ${alertType}`}>{message}</div>
}

export default Alert
