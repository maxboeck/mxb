'use strict'

import gulp from 'gulp'
import gutil from 'gulp-util'
import plumber from 'gulp-plumber'
import browserSync from 'browser-sync'
import gulpLoadPlugins from 'gulp-load-plugins'
import webpack from 'webpack-stream'

const $ = gulpLoadPlugins()
const reload = browserSync.reload
const srcfiles = ['_assets/js/main.js']

const webpackConfig = {
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/',
                query: {
                    compact: false
                }
            }
        ]
    }
}

gulp.task('scripts', () => {
    return gulp
        .src(srcfiles)
        .pipe(
            plumber({
                errorHandler: err => {
                    gutil.log(gutil.colors.red(err))
                    this.emit('end')
                }
            })
        )
        .pipe(webpack(webpackConfig))
        .pipe($.rename('bundle.js'))
        .pipe(gulp.dest('_site/assets/js'))
        .pipe(reload({ stream: true }))
})

gulp.task('scripts:prod', () => {
    return gulp
        .src(srcfiles)
        .pipe(
            plumber({
                errorHandler: err => {
                    gutil.log(gutil.colors.red(err))
                    this.emit('end')
                }
            })
        )
        .pipe(webpack(webpackConfig))
        .pipe($.uglify())
        .pipe($.rename('bundle.min.js'))
        .pipe(gulp.dest('_site/assets/js'))
})
