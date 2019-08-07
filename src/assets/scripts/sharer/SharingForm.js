import { h, Component } from 'preact'

export default class SharingForm extends Component {
    constructor() {
        super()
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(event) {
        event.preventDefault()
        this.props.onSubmit()
    }

    render(props) {
        return (
            <form onSubmit={this.handleSubmit}>
                <fieldset>
                    <legend>Link Info</legend>
                    <ul>
                        <li>
                            <label for="sharing-title">Title</label>
                            <input
                                type="text"
                                id="sharing-title"
                                name="title"
                                value={props.title}
                                onInput={props.onUpdate}
                            />
                        </li>
                        <li>
                            <label for="sharing-url">URL</label>
                            <input
                                type="url"
                                id="sharing-url"
                                name="url"
                                value={props.url}
                                onInput={props.onUpdate}
                                required
                            />
                        </li>
                        <li>
                            <label for="sharing-via">via</label>
                            <input
                                type="text"
                                id="sharing-via"
                                name="via"
                                value={props.via}
                                onInput={props.onUpdate}
                            />
                        </li>
                        <li>
                            <label for="sharing-text">
                                Note Body (without link)
                            </label>
                            <textarea
                                id="sharing-text"
                                maxlength="200"
                                name="text"
                                value={props.text}
                                onInput={props.onUpdate}
                            />
                        </li>
                        <li>
                            <label for="sharing-syndicate">
                                <input
                                    type="checkbox"
                                    id="sharing-syndicate"
                                    name="syndicate"
                                    value={props.syndicate}
                                    onInput={props.onUpdate}
                                />
                                Syndicate to Twitter
                            </label>
                        </li>
                    </ul>
                </fieldset>
                <div>
                    <button type="submit">Publish</button>
                </div>
            </form>
        )
    }
}
