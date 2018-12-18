const pluginRss = require('@11ty/eleventy-plugin-rss')
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const htmlmin = require('html-minifier')

module.exports = function(config) {
    // config.addFilter('dateDisplay', require('./_custom/filters/dates.js'))

    config.addPlugin(pluginRss)
    config.addPlugin(pluginSyntaxHighlight)

    config.addLayoutAlias('base', 'layouts/base.njk')
    config.addLayoutAlias('page', 'layouts/page.njk')
    config.addLayoutAlias('post', 'layouts/post.njk')

    config.addNunjucksShortcode('icon', require('./_custom/shortcodes/icon.js'))

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
            includes: 'includes'
        },
        templateFormats: ['njk', 'md'],
        htmlTemplateEngine: 'njk',
        markdownTemplateEngine: 'njk',
        passthroughFileCopy: true
    }
}
