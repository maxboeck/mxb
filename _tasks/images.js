const config = require('./_config.json')
const gulp = require('gulp')
const imagemin = require('gulp-imagemin')

gulp.task('images', function() {
    return gulp
        .src(config.assetSrc + '/images/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest(config.assetDest + '/images'))
})
