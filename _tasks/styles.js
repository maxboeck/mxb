const config = require('./_config.json')
const gulp = require('gulp')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const browserslist = require('../package.json').browserslist

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
        .pipe(
            autoprefixer({
                browsers: browserslist
            })
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
        .pipe(
            autoprefixer({
                browsers: browserslist
            })
        )
        .pipe(cleanCSS())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest(styleConfig.dest))
}

gulp.task('styles', function() {
    if (process.env.NODE_ENV !== 'production') {
        return devStyles()
    } else {
        return prodStyles()
    }
})
