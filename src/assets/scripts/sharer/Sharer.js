import { h, Component } from 'preact'
import SharingForm from './SharingForm'
import NotePreview from './NotePreview'

export default class Sharer extends Component {
    constructor() {
        super()
        this.state = {
            _honeyp0t: '',
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
        const { action } = this.props
        const { _honeyp0t, ...data } = this.state

        if (_honeyp0t.length) {
            return
        }

        const makeFormdata = obj => {
            const fd = new FormData()
            for (let key in obj) {
                fd.append(key, obj[key])
            }
            return fd
        }

        fetch(action, {
            method: 'post',
            body: makeFormdata(data)
        })
            .then(response => {
                console.log(response)
            })
            .catch(err => {
                console.error(err)
            })
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
