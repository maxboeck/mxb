'use strict'

import gulp from 'gulp'
import gutil from 'gulp-util'
import plumber from 'gulp-plumber'
import critical from 'critical'

const rootDir = '_site'

const config = {
    inline: true,
    base: rootDir,
    minify: true,
    width: 1280,
    height: 800,
    ignore: ['@font-face']
}

const topLevelPages = [
    `${rootDir}/index.html`,
    `${rootDir}/blog/index.html`,
    `${rootDir}/about/index.html`,
    `${rootDir}/contact/index.html`
]

gulp.task('critical', () => {
    return gulp
        .src(topLevelPages, { base: rootDir })
        .pipe(
            plumber({
                errorHandler: err => {
                    gutil.log(gutil.colors.red(err))
                    this.emit('end')
                }
            })
        )
        .pipe(critical.stream(config))
        .pipe(gulp.dest(rootDir))
})
