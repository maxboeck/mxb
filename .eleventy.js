const pluginRss = require('@11ty/eleventy-plugin-rss')
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const htmlmin = require('html-minifier')

const filters = require('./_custom/filters.js')
const shortcodes = require('./_custom/shortcodes.js')

const env = process.env.ELEVENTY_ENV

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
    config.addPassthroughCopy('src/site.webmanifest')
    config.addPassthroughCopy('src/robots.txt')

    // Collections: Navigation
    config.addCollection('nav', function(collection) {
        return collection.getFilteredByTag('nav').sort(function(a, b) {
            return a.data.navorder - b.data.navorder
        })
    })

    // Collections: Posts
    config.addCollection('posts', function(collection) {
        return collection
            .getAllSorted()
            .filter(item => item.inputPath.match(/\/posts\//) !== null)
            .filter(item => item.data.permalink !== false)
            .filter(item => !(item.data.draft && env === 'prod'))
    })

    // Collections: Notes
    config.addCollection('notes', function(collection) {
        return collection
            .getAllSorted()
            .filter(item => item.inputPath.match(/\/notes\//) !== null)
            .reverse()
    })

    // Minify HTML Output
    config.addTransform('htmlmin', function(content, outputPath) {
        if (env === 'prod' && outputPath.endsWith('.html')) {
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
            input: 'src',
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
