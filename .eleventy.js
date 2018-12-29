const pluginRss = require('@11ty/eleventy-plugin-rss')
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const htmlmin = require('html-minifier')

const filters = require('./_custom/filters.js')
const shortcodes = require('./_custom/shortcodes.js')

module.exports = function(config) {
    // Filters
    Object.keys(filters).forEach(filterName => {
        config.addFilter(filterName, filters[filterName])
    })

    // Shortcodes
    Object.keys(shortcodes).forEach(shortCodeName => {
        config.addShortcode(shortCodeName, shortcodes[shortCodeName])
    })

    // Plugins
    config.addPlugin(pluginRss)
    config.addPlugin(pluginSyntaxHighlight)

    // Layouts
    config.addLayoutAlias('base', 'layouts/base.njk')
    config.addLayoutAlias('page', 'layouts/page.njk')
    config.addLayoutAlias('post', 'layouts/post.njk')
    config.addLayoutAlias('note', 'layouts/note.njk')

    // Pass-through files
    config.addPassthroughCopy('src/site/site.webmanifest')
    config.addPassthroughCopy('src/site/robots.txt')

    // Collections: Navigation
    config.addCollection('nav', function(collection) {
        return collection.getFilteredByTag('nav').sort(function(a, b) {
            return a.data.navorder - b.data.navorder
        })
    })

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
