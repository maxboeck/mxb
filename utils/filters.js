const { DateTime } = require('luxon')
const sanitizeHTML = require('sanitize-html')
const random = require('lodash/random')

module.exports = {
    readableDate: function (date, format) {
        // default to Europe/Vienna Timezone
        const dt = DateTime.fromJSDate(date, { zone: 'UTC+2' })
        if (!format) {
            format =
                dt.hour + dt.minute > 0 ? 'dd LLL yyyy - HH:mm' : 'dd LLL yyyy'
        }
        return dt.toFormat(format)
    },

    dateToFormat: function (date, format) {
        return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat(
            String(format)
        )
    },

    dateToISO: function (date) {
        return DateTime.fromJSDate(date, { zone: 'utc' }).toISO({
            includeOffset: false,
            suppressMilliseconds: true
        })
    },

    dateFromISO: function (timestamp) {
        return DateTime.fromISO(timestamp, { zone: 'utc' }).toJSDate()
    },

    humanizeNumber: function (num) {
        if (num > 999) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
        }
        return num
    },

    obfuscate: function (str) {
        const chars = []
        for (var i = str.length - 1; i >= 0; i--) {
            chars.unshift(['&#', str[i].charCodeAt(), ';'].join(''))
        }
        return chars.join('')
    },

    slice: function (array, start, end) {
        return end ? array.slice(start, end) : array.slice(start)
    },

    stringify: function (json) {
        return JSON.stringify(json)
    },

    isOwnWebmention: function (webmention) {
        const urls = [
            'https://mxb.at',
            'https://mxb.dev',
            'https://twitter.com/mxbck'
        ]
        const authorUrl = webmention.author ? webmention.author.url : false
        // check if a given URL is part of this site.
        return authorUrl && urls.includes(authorUrl)
    },

    webmentionsByUrl: function (webmentions, url) {
        const allowedTypes = ['mention-of', 'in-reply-to']
        const allowedHTML = {
            allowedTags: ['b', 'i', 'em', 'strong', 'a'],
            allowedAttributes: {
                a: ['href']
            }
        }

        const orderByDate = (a, b) =>
            new Date(a.published) - new Date(b.published)

        const checkRequiredFields = (entry) => {
            const { author, published, content } = entry
            return !!author && !!author.name && !!published && !!content
        }

        const clean = (entry) => {
            const { html, text } = entry.content

            if (html) {
                // really long html mentions, usually newsletters or compilations
                entry.content.value =
                    html.length > 2000
                        ? `mentioned this in <a href="${entry['wm-source']}">${entry['wm-source']}</a>`
                        : sanitizeHTML(html, allowedHTML)
            } else {
                entry.content.value = sanitizeHTML(text, allowedHTML)
            }

            return entry
        }

        return webmentions
            .filter((entry) => entry['wm-target'] === url)
            .filter((entry) => allowedTypes.includes(entry['wm-property']))
            .filter(checkRequiredFields)
            .sort(orderByDate)
            .map(clean)
    },

    webmentionCountByType: function (webmentions, url, ...types) {
        const isUrlMatch = (entry) =>
            entry['wm-target'] === url ||
            entry['wm-target'] === url.replace('mxb.dev', 'mxb.at')

        return String(
            webmentions
                .filter(isUrlMatch)
                .filter((entry) => types.includes(entry['wm-property'])).length
        )
    },

    excludePost: function (allPosts, currentPost) {
        return allPosts.filter(
            (post) => post.inputPath !== currentPost.inputPath
        )
    },

    currentPage: function (allPages, currentPage) {
        const matches = allPages.filter(
            (page) => page.inputPath === currentPage.inputPath
        )
        if (matches && matches.length) {
            return matches[0]
        }
        return null
    },

    excerpt: function (content) {
        const excerptMinimumLength = 80
        const excerptSeparator = '<!--more-->'
        const findExcerptEnd = (content) => {
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

    randomItem: function (arr) {
        return arr[random(arr.length - 1)]
    },

    shuffle: function (arr) {
        let m = arr.length,
            t,
            i

        while (m) {
            i = Math.floor(Math.random() * m--)
            t = arr[m]
            arr[m] = arr[i]
            arr[i] = t
        }

        return arr
    },

    findById: function (array, id) {
        return array.find((i) => i.id === id)
    },

    setExt: function (path, ext) {
        if (!ext) {
            return path
        }
        return path.substr(0, path.lastIndexOf('.')) + `.${ext}`
    }
}
