const pluginRss = require('@11ty/eleventy-plugin-rss')
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const htmlmin = require('html-minifier')

const filters = require('./_custom/filters.js')
const shortcodes = require('./_custom/shortcodes.js')

module.exports = function(config) {
    // Filters
    config.addFilter('isoDate', filters.isoDate)
    config.addFilter('readableDate', filters.readableDate)
    config.addFilter('obfuscate', filters.obfuscate)

    // Shortcodes
    config.addNunjucksShortcode('icon', shortcodes.icon)
    config.addNunjucksShortcode('excerpt', shortcodes.excerpt)

    // Plugins
    config.addPlugin(pluginRss)
    config.addPlugin(pluginSyntaxHighlight)

    // Layouts
    config.addLayoutAlias('base', 'layouts/base.njk')
    config.addLayoutAlias('page', 'layouts/page.njk')
    config.addLayoutAlias('post', 'layouts/post.njk')

    // Collections: Navigation
    config.addCollection('nav', function(collection) {
        return collection.getFilteredByTag('nav').sort(function(a, b) {
            return a.data.navorder - b.data.navorder
        })
    })

    // Collections: Post
    // config.addCollection('posts', function(collection) {
    //     return collection.getAllSorted().filter(function(item) {
    //         return item.inputPath.match(/^\/posts\//) !== null
    //     })
    // })

    // Minify HTML Output
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

    // Base Config
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
