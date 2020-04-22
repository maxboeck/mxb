const config = require('./_config.json')
const gulp = require('gulp')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const cleanCSS = require('gulp-clean-css')

require('dotenv').config()

const styleConfig = {
    src: config.assetSrc + '/styles/main.scss',
    dest: config.assetDest + '/css'
}

function devStyles() {
    return gulp
        .src(styleConfig.src)
        .pipe(sourcemaps.init())
        .pipe(
            sass({
                precision: 10,
                outputStyle: 'expanded'
            }).on('error', sass.logError)
        )
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(styleConfig.dest))
}

function prodStyles() {
    return gulp
        .src(styleConfig.src)
        .pipe(
            sass({
                precision: 10,
                outputStyle: 'expanded'
            }).on('error', sass.logError)
        )
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(gulp.dest(styleConfig.dest))
}

gulp.task('styles', function () {
    if (process.env.NODE_ENV !== 'production') {
        return devStyles()
    } else {
        return prodStyles()
    }
})
