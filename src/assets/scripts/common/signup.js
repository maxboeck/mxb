const SELECTORS = {
    widget: '.js-signup-widget',
    feedback: '.js-signup-widget-feedback',
    backside: '.js-signup-backside'
}
const CLASSES = {
    loading: 'signup--loading',
    success: 'signup--success'
}
const SIGNUP_STORAGE_KEY = 'signedup'

class SignupWidget {
    constructor(el) {
        this.element = el

        this.id = 'mcsignup'
        this.form = el.querySelector('form')
        this.backside = el.querySelector(SELECTORS.backside)
        this.feedbackContainer = el.querySelector(SELECTORS.feedback)

        this.isLoading = false
        this.callbackName = 'signup_cb'
    }

    init() {
        this.url = this.form.action.replace('/post', '/post-json')
        this.form.addEventListener('submit', (event) => this.submit(event))
    }

    submit(event) {
        event.preventDefault()
        const data = this.serialize(this.form)

        if (this.isLoading) {
            return false
        }

        this.isLoading = true
        this.loadingTimeout = window.setTimeout(() => this.setLoading(), 1000)

        this.setCallback()
        this.setScript(data)
    }

    serialize(form) {
        const formData = new FormData(form)
        const queryString = new URLSearchParams(Array.from(formData)).toString()
        return queryString + `&c=${this.callbackName}`
    }

    setScript(data) {
        const requestUrl = this.url + '?' + data
        const script = document.getElementById(this.id)
        if (script) {
            script.src = requestUrl
        } else {
            const s = document.createElement('script')
            s.setAttribute('id', this.id)
            s.setAttribute('src', requestUrl)
            document.body.appendChild(s)
        }
    }

    setCallback() {
        const onCallback = (response) => {
            try {
                delete window[this.callbackName]
            } catch (err) {
                window[this.callbackName] = undefined
            }

            const script = document.getElementById(this.id)
            script && script.parentElement.removeChild(script)

            this.onResponse(response)
        }

        window[this.callbackName] = onCallback
    }

    setLoading() {
        this.element.classList.toggle(CLASSES.loading, this.isLoading)
    }

    buildConfirmationMessage() {
        const container = document.createElement('div')
        container.innerHTML = `
            <h3 class="signup__title">Hooray, Thank You!</h3>
            <div class="signup__desc">
                <p>You're almost there - To complete the process, 
                I just need to <strong>confirm your email address.</strong></p> 
                <p>To get on the list, you’ll need to 
                click the link in the email I just sent you. If 
                you don't see it, maybe also check your 
                spam folder - you know how this works.</p>
            </div>
        `
        return container
    }

    onResponse(response) {
        if (this.isLoading) {
            this.isLoading = false
            window.clearTimeout(this.loadingTimeout)
            this.setLoading()
        }

        this.feedbackContainer.innerHTML = ''
        this.feedbackContainer.setAttribute('hidden', true)

        const msg = response.msg.includes(' - ')
            ? response.msg.substring(3).trim()
            : response.msg.trim()

        switch (response.result) {
            case 'success':
                this.onSuccess(msg)
                break

            case 'error':
                this.onError(msg)
                break

            default:
                return
        }
    }

    onSuccess(msg) {
        const confirmation = this.buildConfirmationMessage()
        this.backside.appendChild(confirmation)

        window.setTimeout(() => {
            this.element.classList.add(CLASSES.success)
        }, 100)

        if (typeof Storage !== 'undefined') {
            localStorage.setItem(SIGNUP_STORAGE_KEY, true)
        }
    }

    onError(msg) {
        const alert = document.createElement('div')
        alert.classList.add('alert', 'alert--error')
        alert.innerHTML = msg
        this.feedbackContainer.appendChild(alert)
        this.feedbackContainer.removeAttribute('hidden')
    }
}

const container = document.querySelector(SELECTORS.widget)
if (container) {
    const signupWidget = new SignupWidget(container)
    signupWidget.init()
}
