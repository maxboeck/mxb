const { DateTime } = require('luxon')

module.exports = {
    year: function(date) {
        return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat('yyyy')
    },

    isoDate: function(date) {
        return DateTime.fromJSDate(date, { zone: 'utc' }).toISODate({
            includeOffset: true,
            suppressMilliseconds: true
        })
    },

    readableDate: function(date) {
        return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat(
            'dd LLL yyyy'
        )
    },

    fromIso: function(timestamp) {
        return DateTime.fromISO(timestamp, { zone: 'utc' }).toJSDate()
    },

    obfuscate: function(str) {
        const chars = []
        for (var i = str.length - 1; i >= 0; i--) {
            chars.unshift(['&#', str[i].charCodeAt(), ';'].join(''))
        }
        return chars.join('')
    },

    webmentionsByUrl: function(webmentions, url) {
        const types = ['mention-of', 'in-reply-to']
        return webmentions
            .filter(entry => entry['wm-target'] === url)
            .filter(entry => types.includes(entry['wm-property']))
            .filter(entry => !!entry.content)
    },

    otherPosts: function(posts, currentPostTitle) {
        return posts
            .filter(post => post.data.title !== currentPostTitle)
            .slice(-10)
    }
}
