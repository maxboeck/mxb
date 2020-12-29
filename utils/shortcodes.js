module.exports = {
    icon: function (name) {
        const spritePath = '/assets/icons/sprite.svg'
        return `<svg class="icon icon--${name}" role="img" aria-hidden="true" width="24" height="24">
                    <use xlink:href="${spritePath}#icon-${name}"></use>
                </svg>`
    },

    signup: function (content, title = 'Join the Mailing List') {
        return ''
        // const source = this.page.url
        // const defaultText = `
        // People on the list will be notified first when new posts are published.
        // I'll send emails about once a month and you can unsubscribe at any time.`

        // const text = content.length ? content.trim() : defaultText.trim()
        // return generators.signupSection(title, text, source)
    },

    callout: function (content, type = 'info') {
        return ''
        // return generators.callout(content, type)
    }
}
