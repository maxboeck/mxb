import { h, Component } from 'preact'
import SharingForm from './SharingForm'
import NotePreview from './NotePreview'

export default class Sharer extends Component {
    constructor() {
        super()
        this.state = {
            title: '',
            url: '',
            via: '',
            text: '',
            token: undefined,
            syndicate: false
        }

        this.update = this.update.bind(this)
        this.post = this.post.bind(this)
    }

    componentDidMount() {
        this.getInitialValues()
    }

    getInitialValues() {
        const queryParams = new URLSearchParams(window.location.search)
        const initialValues = {}
        for (let param of queryParams) {
            const [key, value] = param
            if (this.state.hasOwnProperty(key)) {
                initialValues[key] = value
            }
        }
        this.setState(Object.assign({}, initialValues))
    }

    update(event) {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    }

    post() {
        console.log(this.state)
    }

    render(props, state) {
        return (
            <div>
                <SharingForm
                    {...state}
                    onSubmit={data => this.post(data)}
                    onUpdate={this.update}
                />
                <NotePreview {...state} />
            </div>
        )
    }
}
