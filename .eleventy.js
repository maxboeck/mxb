const pluginRss = require('@11ty/eleventy-plugin-rss')
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const htmlmin = require('html-minifier')
const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')

const filters = require('./_eleventy/filters.js')
const shortcodes = require('./_eleventy/shortcodes.js')

require('dotenv').config()
const env = process.env.NODE_ENV

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
    config.addPassthroughCopy('src/keybase.txt')
    config.addPassthroughCopy('src/robots.txt')

    // Markdown Parsing
    config.setLibrary(
        'md',
        markdownIt({
            html: true,
            breaks: true,
            typographer: true
        }).use(markdownItAnchor, {
            permalink: true,
            permalinkSymbol: '#',
            permalinkClass: 'heading-anchor',
            level: 2,
            slugify: s =>
                encodeURIComponent(
                    'h-' +
                        String(s)
                            .trim()
                            .toLowerCase()
                            .replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, '')
                            .replace(/\s+/g, '-')
                )
        })
    )

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
