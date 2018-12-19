const config = require('./_config.json')
const gulp = require('gulp')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const browserSync = require('browser-sync')

/*
  Compile SCSS files to CSS
*/
gulp.task('styles', function() {
    return gulp
        .src(config.assetSrc + '/styles/main.scss')
        .pipe(sourcemaps.init())
        .pipe(
            sass({
                precision: 10,
                outputStyle: 'expanded'
            }).on('error', sass.logError)
        )
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.assetDest + '/css'))
})
