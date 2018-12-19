const gulp = require('gulp')
const shell = require('gulp-shell')

gulp.task(
    'generate',
    shell.task('eleventy', {
        env: { ELEVENTY_ENV: process.env.NODE_ENV }
    })
)
