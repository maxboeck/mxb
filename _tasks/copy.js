const config = require('./config.json')
const gulp = require('gulp')

const passThroughGlobs = [config.assetSrc + '/fonts/**']

gulp.task('copy', function() {
    return gulp
        .src(passThroughGlobs, { base: 'assets' })
        .pipe(gulp.dest(config.assetDest))
})
