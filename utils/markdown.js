import markdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'

const anchorSlugify = (s) =>
    encodeURIComponent(
        'h-' +
            String(s)
                .trim()
                .toLowerCase()
                .replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, '')
                .replace(/\s+/g, '-')
    )

const anchorOpts = {
    symbol: '#',
    class: 'heading-anchor',
    visuallyHiddenClass: 'sr-only',
    style: 'visually-hidden',
    assistiveText: (title) => `Permalink to “${title}”`,
    renderHref: anchorSlugify
}

export default markdownIt({
    html: true,
    breaks: true,
    typographer: true
}).use(anchor, {
    permalink: anchor.permalink.linkAfterHeader(anchorOpts)
})
