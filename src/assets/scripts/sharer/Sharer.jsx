import { h, Component } from 'preact'
import SharingForm from './SharingForm'
import NotePreview from './NotePreview'
import Alert from './Alert'

export default class Sharer extends Component {
    constructor() {
        super()
        this.state = {
            _honeyp0t: '',
            title: '',
            url: '',
            via: '',
            body: '',
            username: '',
            token: '',
            syndicate: false,
            isLoading: false,
            status: undefined
        }

        this.update = this.update.bind(this)
        this.post = this.post.bind(this)
        this.handleResponse = this.handleResponse.bind(this)
    }

    componentDidMount() {
        this.getInitialValues()
    }

    handleResponse(response) {
        if (response.ok) {
            this.setState({
                isLoading: false,
                status: {
                    success: true,
                    message: 'Note published!'
                }
            })
        } else {
            response.text().then((text) => {
                this.setState({
                    isLoading: false,
                    status: {
                        success: false,
                        message: `${response.status} ${text}`
                    }
                })
            })
        }
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

        // worakround a quirk in mobile sharing behaviour
        // @see https://www.aaron-gustafson.com/notebook/my-own-personal-pwa/
        if (queryParams.has('text')) {
            const text = queryParams.get('text')
            if (text.includes('http') && !initialValues.url) {
                initialValues.url = text
            }
        }

        this.setState(Object.assign({}, initialValues))
    }

    update(event) {
        const { name, value, type } = event.target
        const nextValue = type === 'checkbox' ? !this.state[name] : value

        this.setState({
            [name]: nextValue
        })
    }

    post() {
        const { action } = this.props
        const { _honeyp0t, isLoading, ...data } = this.state

        if (_honeyp0t.length) {
            return
        }

        this.setState({
            isLoading: true,
            status: undefined
        })
        fetch(action, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(this.handleResponse)
            .catch((err) => {
                console.error(err)
            })
    }

    render(props, state) {
        const { status, ...data } = state
        return (
            <div className="sharer">
                <NotePreview {...data} />
                {!!status ? (
                    <Alert {...status} />
                ) : (
                    <SharingForm
                        {...data}
                        onSubmit={(data) => this.post(data)}
                        onUpdate={this.update}
                    />
                )}
            </div>
        )
    }
}
