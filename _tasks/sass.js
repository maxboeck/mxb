'use strict'

import gulp from 'gulp'
import gutil from 'gulp-util'
import plumber from 'gulp-plumber'
import browserSync from 'browser-sync'
import gulpLoadPlugins from 'gulp-load-plugins'

const $ = gulpLoadPlugins()
const reload = browserSync.reload
const AUTOPREFIXER_BROWSERS = [
    '> 1%',
    'last 3 versions',
    'Firefox ESR',
    'Opera 12.1',
    'Explorer 8'
]

const sourcefiles = ['_assets/styles/main.scss', '_projects/**/*.scss']

gulp.task('sass', () => {
    return gulp
        .src(sourcefiles)
        .pipe($.flatten())
        .pipe(
            plumber({
                errorHandler: err => {
                    gutil.log(gutil.colors.red(err))
                    this.emit('end')
                }
            })
        )
        .pipe($.sourcemaps.init())
        .pipe(
            $.sass({
                precision: 10,
                onError: browserSync.notify
            })
        )
        .pipe($.autoprefixer({ browsers: AUTOPREFIXER_BROWSERS }))
        .pipe($.sourcemaps.write())
        .pipe($.rename({ extname: '.css' }))
        .pipe(gulp.dest('_site/assets/css'))
        .pipe(reload({ stream: true }))
})

gulp.task('sass:prod', () => {
    return gulp
        .src(sourcefiles)
        .pipe($.flatten())
        .pipe(
            plumber({
                handleError: err => {
                    gutil.log(gutil.colors.red(err))
                    this.emit('end')
                }
            })
        )
        .pipe(
            $.sass({
                precision: 10,
                onError: browserSync.notify
            })
        )
        .pipe($.autoprefixer({ browsers: AUTOPREFIXER_BROWSERS }))
        .pipe(
            $.cleanCss({
                keepBreaks: false,
                keepSpecialComments: true
            })
        )
        .pipe($.rename({ extname: '.min.css' }))
        .pipe(gulp.dest('_site/assets/css'))
})
