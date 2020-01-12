const gulp = require('gulp')

require('require-dir')('./_tasks')

// Run the asset pipeline
gulp.task('assets', gulp.parallel('styles', 'scripts', 'icons', 'copy'))

// Run the Dev Server and Watcher
gulp.task('dev', gulp.parallel('serve', 'watch'))

// Development Build Process
gulp.task('build:dev', gulp.series('clean', 'generate', 'assets', 'dev'))

// Production Build Process
gulp.task(
    'build',
    gulp.series('clean', 'generate', 'assets', 'critical', 'workbox')
)
