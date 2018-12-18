const config = require('./_config.json')
const gulp = require('gulp')
const serve = require('gulp-serve')

gulp.task(
    'serve',
    serve({
        root: [config.buildDest],
        port: 3000
    })
)
