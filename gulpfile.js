var gulp = require('gulp')
var shell = require('gulp-shell')

require('require-dir')('./_tasks')

// Run 11ty to build the pages
gulp.task('generate', shell.task('eleventy'))

// Run the asset pipeline
gulp.task('assets', gulp.parallel('styles', 'scripts', 'images', 'icons'))

// Main Build Process
gulp.task('build', gulp.series('clean', 'generate', 'copy', 'assets'))
