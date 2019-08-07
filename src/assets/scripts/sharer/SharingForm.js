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
            <form onSubmit={this.handleSubmit} accept-charset="UTF-8">
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
                                name="body"
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
                <div
                    className="sr-only"
                    style={{ visibility: 'hidden' }}
                    aria-hidden="true"
                >
                    <label for="sharing-hp">
                        Don’t fill this out if you're human:
                    </label>
                    <input
                        type="text"
                        name="_honeyp0t"
                        id="sharing-hp"
                        tabindex="-1"
                        value={props._honeyp0t}
                        onInput={props.onUpdate}
                    />
                </div>
                <details>
                    <summary>Config</summary>
                    <ul>
                        <li>
                            <label for="sharing-username">User Name</label>
                            <input
                                type="text"
                                id="sharing-username"
                                name="username"
                                value={props.username}
                                onInput={props.onUpdate}
                            />
                        </li>
                        <li>
                            <label for="sharing-token">Access Token</label>
                            <input
                                type="password"
                                id="sharing-token"
                                name="token"
                                value={props.token}
                                onInput={props.onUpdate}
                            />
                        </li>
                    </ul>
                </details>
                <div>
                    <button type="submit" disabled={props.isLoading}>
                        Publish
                    </button>
                </div>
            </form>
        )
    }
}
