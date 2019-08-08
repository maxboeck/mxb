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
            body: '',
            username: '',
            token: '',
            syndicate: false,
            isLoading: false
        }

        this.update = this.update.bind(this)
        this.post = this.post.bind(this)
    }

    componentDidMount() {
        this.getInitialValues()
    }

    handleResponse(response) {
        if (response.ok) {
            alert('Note posted!')
        } else {
            response
                .text()
                .then(text => {
                    alert(`Error ${response.status}: ${text}`)
                })
                .catch(err => {
                    console.error(err)
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

        const buildQuery = obj => {
            const params = new URLSearchParams()
            for (let key in obj) {
                params.append(key, obj[key])
            }
            return params
        }

        this.setState({ isLoading: true })

        fetch(action, {
            method: 'post',
            body: buildQuery(data)
        })
            .then(response => {
                this.setState({ isLoading: false })
                this.handleResponse(response)
            })
            .catch(err => {
                console.error(err)
            })
    }

    render(props, state) {
        return (
            <div class="u-mt2 u-mb2">
                <NotePreview {...state} />
                <SharingForm
                    {...state}
                    onSubmit={data => this.post(data)}
                    onUpdate={this.update}
                />
            </div>
        )
    }
}
