const generators = require('./generators.js')

module.exports = {
    icon: function (iconName, useInline) {
        return generators.icon(iconName, useInline)
    },

    signup: function (content, title = 'Join the Mailing List') {
        const source = this.page.url
        const defaultText = `
        People on the list will be notified first when new posts are published.
        I'll send emails about once a month and you can unsubscribe at any time.`

        const text = content.length ? content.trim() : defaultText.trim()
        return generators.signupSection(title, text, source)
    },

    callout: function (content, type = 'info') {
        return generators.callout(content, type)
    }
}
