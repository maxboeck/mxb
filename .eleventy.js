const pluginRss = require('@11ty/eleventy-plugin-rss')
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const htmlmin = require('html-minifier')

const filters = require('./_custom/filters.js')
const shortcodes = require('./_custom/shortcodes.js')

module.exports = function(config) {
    config.addFilter('isoDate', filters.isoDate)
    config.addFilter('obfuscate', filters.obfuscate)

    config.addNunjucksShortcode('icon', shortcodes.icon)

    config.addPlugin(pluginRss)
    config.addPlugin(pluginSyntaxHighlight)

    config.addLayoutAlias('base', 'layouts/base.njk')
    config.addLayoutAlias('page', 'layouts/page.njk')
    config.addLayoutAlias('post', 'layouts/post.njk')

    config.addTransform('htmlmin', function(content, outputPath) {
        if (outputPath.endsWith('.html')) {
            return htmlmin.minify(content, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true
            })
        }
        return content
    })

    return {
        dir: {
            input: 'src/site',
            output: 'dist',
            includes: 'includes',
            data: 'data'
        },
        templateFormats: ['njk', 'md'],
        htmlTemplateEngine: 'njk',
        markdownTemplateEngine: 'njk',
        passthroughFileCopy: true
    }
}
