const config = require('./_config.json')
const gulp = require('gulp')

gulp.task('copy', function() {
    const postDir = config.buildSrc + '/posts'
    const postMediaGlobs = [
        postDir + '/**/*.{jpg,jpeg,png,gif,webp,mp3,mp4,webm,ogg}'
    ]

    return gulp
        .src(postMediaGlobs, { base: postDir })
        .pipe(gulp.dest(config.assetDest + '/media'))
})
