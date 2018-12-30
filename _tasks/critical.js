const config = require('./_config.json')
const gulp = require('gulp')
const critical = require('critical').stream

const criticalConfig = {
    inline: true,
    base: config.buildDest + '/',
    minify: true,
    width: 1280,
    height: 800,
    ignore: ['@font-face']
}

const optimizedPages = ['/', '/blog/', '/about/'].map(
    slug => config.buildDest + slug + 'index.html'
)

gulp.task('critical', function() {
    return gulp
        .src(optimizedPages)
        .pipe(critical(criticalConfig))
        .pipe(gulp.dest(config.buildDest))
})
