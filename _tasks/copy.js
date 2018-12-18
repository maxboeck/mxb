const config = require('./_config.json')
const gulp = require('gulp')

const passThroughGlobs = [config.assetSrc + '/fonts/**']

gulp.task('copy', function() {
    return gulp
        .src(passThroughGlobs, { base: config.assetSrc })
        .pipe(gulp.dest(config.assetDest))
})
