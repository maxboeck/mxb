const gulp = require('gulp')
const exec = require('child_process').exec

require('dotenv').config()

const eleventy = cb => {
    const cmd = `NODE_ENV=${process.env.NODE_ENV} eleventy`
    exec(cmd, err => {
        cb(err)
    })
}

gulp.task('generate', eleventy)
