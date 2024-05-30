import htmlMinifier from 'html-minifier'

const shouldTransformHTML = (outputPath) =>
    outputPath &&
    outputPath.endsWith('.html') &&
    process.env.NODE_ENV === 'production'

process.setMaxListeners(Infinity)

export default {
    htmlmin: function (rawContent, outputPath) {
        let content = rawContent
        if (shouldTransformHTML(outputPath)) {
            content = htmlMinifier.minify(content, {
                collapseBooleanAttributes: true,
                collapseWhitespace: true,
                removeComments: true,
                sortClassName: true,
                sortAttributes: true,
                html5: true,
                decodeEntities: true,
                removeOptionalTags: true
            })
        }
        return content
    }
}
