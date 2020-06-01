const generators = require('./generators.js')

module.exports = {
    icon: function (iconName, useInline) {
        return generators.icon(iconName, useInline)
    },

    signup: function (content, title = 'Join the Email List') {
        const source = this.page.url
        const defaultText = `
        Join the email list to be notified first when new posts are published!
        I'll send emails once a month tops, and you can unsubscribe at any time. 
        No corporate bullshit here.`

        const text = content.length ? content.trim() : defaultText.trim()
        return generators.signupSection(title, text, source)
    },

    callout: function (content, type = 'info') {
        return generators.callout(content, type)
    }
}
