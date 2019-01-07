const config = require('./_config.json')
const gulp = require('gulp')

gulp.task('copy:assets', function() {
    const assetGlobs = [
        config.assetSrc + '/fonts/**/*',
        config.assetSrc + '/images/**/*'
    ]

    return gulp
        .src(assetGlobs, { base: config.assetSrc })
        .pipe(gulp.dest(config.assetDest))
})

gulp.task('copy:media', function() {
    const postDir = config.buildSrc + '/posts'
    const postMediaGlobs = [
        postDir + '/**/*.{jpg,jpeg,png,gif,webp,mp3,mp4,webm,ogg}'
    ]

    return gulp
        .src(postMediaGlobs, { base: postDir })
        .pipe(gulp.dest(config.assetDest + '/media'))
})

gulp.task('copy', gulp.parallel(['copy:assets', 'copy:media']))
