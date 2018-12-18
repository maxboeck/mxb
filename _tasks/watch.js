const config = require('./_config.json')
const gulp = require('gulp')

/*
  Watch folders for changess
*/
gulp.task('watch', function() {
    gulp.watch(config.assetSrc + '/scripts/**/*', gulp.parallel('scripts'))
    gulp.watch(config.assetSrc + '/styles/**/*', gulp.parallel('styles'))
    gulp.watch(config.assetSrc + '/icons/**/*', gulp.parallel('icons'))

    gulp.watch(config.buildSrc + '/site/**/*', gulp.parallel('generate'))
})
