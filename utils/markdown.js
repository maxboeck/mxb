const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')

const anchorSlugify = (s) =>
    encodeURIComponent(
        'h-' +
            String(s)
                .trim()
                .toLowerCase()
                .replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, '')
                .replace(/\s+/g, '-')
    )

const markdown = markdownIt({
    html: true,
    breaks: true,
    typographer: true
}).use(markdownItAnchor, {
    permalink: true,
    permalinkSymbol: '#',
    permalinkClass: 'heading-anchor',
    permalinkBefore: true,
    permalinkAttrs: () => ({ 'aria-hidden': true }),
    level: 2,
    slugify: anchorSlugify
})

module.exports = markdown
