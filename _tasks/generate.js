const gulp = require('gulp')
const shell = require('gulp-shell')

require('dotenv').config()
gulp.task(
    'generate',
    shell.task('eleventy', {
        env: { ELEVENTY_ENV: process.env.ELEVENTY_ENV }
    })
)
