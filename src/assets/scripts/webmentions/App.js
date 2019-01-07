import { h, Component } from 'preact'

const API_ORIGIN = 'https://webmention.io/api'

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            webmentions: []
        }
    }

    loadItems() {
        const currentUrl = window.location.href
        let url = `${API_ORIGIN}/mentions.jf2?target=${currentUrl}`
        if (this.props.lastFetched) {
            url += `&since=${this.props.lastFetched}`
        }
        fetch(url)
            .then(response => response.json())
            .then(feed => {
                if (feed.children && feed.children.length) {
                    this.setState({
                        webmentions: feed.children
                    })
                }
            })
            .catch(err => console.error(err))
    }

    componentDidMount() {
        this.loadItems()
    }

    render({}, { webmentions }) {
        return (
            <div className="webmentions" id="webmentions">
                Webmentions: Preact
            </div>
        )
    }
}
