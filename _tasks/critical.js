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

gulp.task('critical', function() {
    return gulp
        .src(config.buildDest + '/index.html')
        .pipe(critical(criticalConfig))
        .on('error', function(err) {
            console.error(err.message)
        })
        .pipe(gulp.dest(config.buildDest))
})
