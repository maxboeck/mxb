const config = require('./_config.json')
const gulp = require('gulp')
const workbox = require('workbox-build')

const workboxConfig = {
    globDirectory: config.buildDest,
    globPatterns: [
        'index.html',
        '{404,about,blog,notes}/*.html',
        'assets/{css,icons}/*',
        'assets/fonts/noe-display*',
        'assets/images/avatar-default.jpg',
        'assets/js/main.js',
        'assets/js/webmentions.js'
    ],
    swDest: `${config.buildDest}/sw.js`,
    clientsClaim: true,
    skipWaiting: true
}

gulp.task('workbox', function () {
    return workbox
        .generateSW(workboxConfig)
        .then(({ warnings }) => {
            // In case there are any warnings from workbox-build, log them.
            for (const warning of warnings) {
                console.warn(warning)
            }
            console.info('Service worker generation completed.')
        })
        .catch((error) => {
            console.warn('Service worker generation failed:', error)
        })
})
