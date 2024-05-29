import markdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'

const anchorSlugify = (s) =>
    encodeURIComponent(
        'h-' +
            String(s)
                .trim()
                .toLowerCase()
                .replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, '')
                .replace(/\s+/g, '-')
    )

export default markdownIt({
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
