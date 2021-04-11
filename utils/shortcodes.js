const components = require('./components.js')
const { Icon, SignupSection, Callout } = components

module.exports = {
    icon: Icon,

    callout: Callout,

    signup: function (content, title = 'Join the Mailing List') {
        const source = this.page.url
        const defaultText = `
        People on the list will be notified first when new posts are published.
        I'll send emails about once a month and you can unsubscribe at any time.`

        const text = content.length ? content.trim() : defaultText.trim()
        return SignupSection(title, text, source)
    }
}
