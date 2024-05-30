import { h, Component } from 'preact'
import Spinner from './Spinner'

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
            <form
                className="form"
                onSubmit={this.handleSubmit}
                accept-charset="UTF-8"
            >
                <div class="form__body">
                    <ul className="form__fields">
                        <li className="form__field">
                            <label className="form__label" for="sharing-title">
                                Title
                            </label>
                            <input
                                className="form__input"
                                type="text"
                                id="sharing-title"
                                name="title"
                                value={props.title}
                                onInput={props.onUpdate}
                            />
                        </li>
                        <li className="form__field">
                            <label className="form__label" for="sharing-url">
                                URL
                            </label>
                            <input
                                className="form__input"
                                type="url"
                                id="sharing-url"
                                name="url"
                                value={props.url}
                                onInput={props.onUpdate}
                                required
                            />
                        </li>
                        <li className="form__field form__field--full">
                            <label className="form__label" for="sharing-body">
                                Note Body
                            </label>
                            <textarea
                                className="form__input"
                                id="sharing-body"
                                maxlength="200"
                                name="body"
                                value={props.body}
                                onInput={props.onUpdate}
                            />
                        </li>
                        <li className="form__field">
                            <label className="form__label" for="sharing-via">
                                Via
                            </label>
                            <input
                                className="form__input"
                                type="text"
                                id="sharing-via"
                                name="via"
                                value={props.via}
                                onInput={props.onUpdate}
                            />
                        </li>
                        <li className="form__field">
                            <label
                                className="form__label"
                                for="sharing-syndicate"
                            >
                                <input
                                    className="form__checkbox"
                                    type="checkbox"
                                    id="sharing-syndicate"
                                    name="syndicate"
                                    checked={props.syndicate}
                                    onChange={props.onUpdate}
                                />
                                &nbsp;Syndicate to Twitter
                            </label>
                        </li>
                    </ul>
                    <details className="form__settings">
                        <summary>
                            ⚙️<span className="sr-only">Config</span>
                        </summary>
                        <ul className="form__fields">
                            <li>
                                <label
                                    className="form__label"
                                    for="sharing-username"
                                >
                                    User Name
                                </label>
                                <input
                                    className="form__input"
                                    type="text"
                                    id="sharing-username"
                                    name="username"
                                    autoComplete="username"
                                    value={props.username}
                                    onInput={props.onUpdate}
                                />
                            </li>
                            <li>
                                <label
                                    className="form__label"
                                    for="sharing-token"
                                >
                                    Access Token
                                </label>
                                <input
                                    className="form__input"
                                    type="password"
                                    id="sharing-token"
                                    name="token"
                                    autoComplete="current-password"
                                    value={props.token}
                                    onInput={props.onUpdate}
                                />
                            </li>
                        </ul>
                    </details>
                    <div
                        className="sr-only"
                        style={{ visibility: 'hidden' }}
                        aria-hidden="true"
                    >
                        <label className="form__label" for="sharing-hp">
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
                </div>
                <div className="form__actions">
                    {props.isLoading ? (
                        <Spinner />
                    ) : (
                        <button type="submit" className="btn btn--primary">
                            Publish Note
                        </button>
                    )}
                </div>
            </form>
        )
    }
}
