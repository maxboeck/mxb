const config = require('./_config.json')
const gulp = require('gulp')
const del = require('del')

gulp.task('clean', del.bind(null, [config.buildDest], { dot: true }))
