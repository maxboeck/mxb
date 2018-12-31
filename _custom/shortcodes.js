module.exports = {
    icon: function(iconName) {
        const spriteUrl = '/assets/icons/icons.sprite.svg'
        return `<svg class="icon icon--${iconName}" role="img" aria-hidden="true" width="24" height="24">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="${spriteUrl}#icon-${iconName}"></use>
                </svg>`
    },

    excerpt: function(post) {
        const excerptMinimumLength = 80
        const excerptSeparator = '<!--more-->'
        const findExcerptEnd = (content, skipLength = 0) => {
            if (content === '') {
                return 0
            }

            const paragraphEnd = content.indexOf('</p>', skipLength) + 4
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
        const clean = str => str.trim().replace(/<[^>]+>/g, '')

        if (!post.hasOwnProperty('templateContent')) {
            return
        }

        const content = post.templateContent

        if (content.includes(excerptSeparator)) {
            return clean(
                content.substring(0, content.indexOf(excerptSeparator))
            )
        } else if (content.length <= excerptMinimumLength) {
            return clean(content)
        }

        const excerptEnd = findExcerptEnd(content)
        return clean(content.substring(0, excerptEnd))
    },

    media: function(filename, page) {
        const path = page.inputPath.split('/')
        const subdir = path[path.length - 2]
        return `/assets/media/${subdir}/${filename}`
    }
}
