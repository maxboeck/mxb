import { h } from 'preact'

const SpinnerLayer = ({ children, ...props }) => {
    const layerClassName = `spinner__layer spinner__layer--${props.index}`
    return (
        <div className={layerClassName}>
            <div className="spinner__circle-clipper spinner__left">
                <div className="spinner__circle" />
            </div>
            <div className="spinner__gap-patch">
                <div className="spinner__circle" />
            </div>
            <div className="spinner__circle-clipper spinner__right">
                <div className="spinner__circle" />
            </div>
        </div>
    )
}

const Spinner = () => {
    const layers = []
    for (let i = 1; i <= 4; i++) {
        layers.push(<SpinnerLayer key={i} index={i} />)
    }
    return (
        <div className="spinner">
            <div className="spinner__layercontainer">{layers}</div>
        </div>
    )
}

export default Spinner
