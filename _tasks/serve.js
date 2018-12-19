const config = require('./_config.json')
const gulp = require('gulp')
const browserSync = require('browser-sync')
const server = browserSync.create()

function reload(done) {
    server.reload()
    done()
}

/*
  BrowserSync Dev Server
*/
gulp.task('browsersync', function(done) {
    server.init({
        server: { baseDir: config.buildDest }
    })
    done()
})

/*
  Watch folders for changess
*/
gulp.task('watch', function() {
    gulp.watch(
        config.assetSrc + '/scripts/**/*',
        gulp.series('scripts', reload)
    )
    gulp.watch(config.assetSrc + '/styles/**/*', gulp.series('styles', reload))
    gulp.watch(config.assetSrc + '/icons/**/*', gulp.parallel('icons'))

    gulp.watch(config.buildSrc + '/site/**/*', gulp.series('generate', reload))
})

gulp.task('serve', gulp.parallel('browsersync', 'watch'))
