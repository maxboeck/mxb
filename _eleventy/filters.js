const { DateTime } = require('luxon')
const sanitizeHTML = require('sanitize-html')

module.exports = {
    format: function(date, format) {
        return DateTime.fromJSDate(date).toFormat(String(format))
    },

    iso: function(date) {
        return DateTime.fromJSDate(date).toISO({
            includeOffset: false,
            suppressMilliseconds: true
        })
    },

    readableDate: function(date) {
        return DateTime.fromJSDate(date).toFormat('dd LLL yyyy')
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

    slice: function(array, limit) {
        return limit > 0 ? array.slice(0, limit) : array.slice(limit)
    },

    webmentionsByUrl: function(webmentions, url) {
        const allowedTypes = ['mention-of', 'in-reply-to']
        const allowedHTML = {
            allowedTags: ['b', 'i', 'em', 'strong', 'a'],
            allowedAttributes: {
                a: ['href']
            }
        }

        const isUrlMatch = entry =>
            entry['wm-target'] === url ||
            entry['wm-target'] === url.replace('mxb.dev', 'mxb.at')

        const orderByDate = (a, b) =>
            new Date(a.published) - new Date(b.published)

        const clean = entry => {
            const { content } = entry
            if (content && content['content-type'] === 'text/html') {
                if (content.value.length > 2000) {
                    // really long html mentions, usually newsletters or compilations
                    entry.content.value = `mentioned this in <a href="${
                        entry.url
                    }">${entry.url}</a>`
                }
                // sanitize HTML
                content.value = sanitizeHTML(content.value, allowedHTML)
            }
            return entry
        }

        return webmentions
            .filter(isUrlMatch)
            .filter(entry => allowedTypes.includes(entry['wm-property']))
            .filter(entry => !!entry.content)
            .sort(orderByDate)
            .map(clean)
    },

    webmentionCountByType: function(webmentions, url, ...types) {
        const isUrlMatch = entry =>
            entry['wm-target'] === url ||
            entry['wm-target'] === url.replace('mxb.dev', 'mxb.at')

        return String(
            webmentions
                .filter(isUrlMatch)
                .filter(entry => types.includes(entry['wm-property'])).length
        )
    },

    excludePost: function(allPosts, currentPost) {
        return allPosts.filter(post => post.inputPath !== currentPost.inputPath)
    },

    currentPage: function(allPages, currentPage) {
        const matches = allPages.filter(
            page => page.inputPath === currentPage.inputPath
        )
        if (matches && matches.length) {
            return matches[0]
        }
        return null
    },

    excerpt: function(content) {
        const excerptMinimumLength = 80
        const excerptSeparator = '<!--more-->'
        const findExcerptEnd = content => {
            if (content === '') {
                return 0
            }

            const paragraphEnd = content.indexOf('</p>', 0) + 4
            if (paragraphEnd < excerptMinimumLength) {
                return (
                    paragraphEnd +
                    findExcerptEnd(
                        content.substring(paragraphEnd),
                        paragraphEnd
                    )
                )
            }

            return paragraphEnd
        }

        if (!content) {
            return
        }

        if (content.includes(excerptSeparator)) {
            return content.substring(0, content.indexOf(excerptSeparator))
        } else if (content.length <= excerptMinimumLength) {
            return content
        }

        const excerptEnd = findExcerptEnd(content)
        return content.substring(0, excerptEnd)
    },

    media: function(filename, page) {
        const path = page.inputPath.split('/')
        if (path.length && path.includes('posts')) {
            const subdir = path[path.length - 2]
            return `/assets/media/${subdir}/${filename}`
        }
        return filename
    }
}
