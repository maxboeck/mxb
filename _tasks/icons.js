'use strict'

import gulp from 'gulp'
import gutil from 'gulp-util'
import svgSprite from 'gulp-svg-sprite'
import plumber from 'gulp-plumber'

const config = {
    mode: {
        inline: true,
        symbol: {
            // symbol mode to build the SVG
            dest: 'icons', // destination foldeer
            sprite: 'sprite.svg', //sprite name
            example: false // Build sample page
        }
    },
    svg: {
        xmlDeclaration: false, // strip out the XML attribute
        doctypeDeclaration: false // don't include the !DOCTYPE declaration
    }
}

gulp.task('icons', () => {
    return gulp
        .src('_assets/icons/*.svg')
        .pipe(
            plumber({
                errorHandler: function(err) {
                    gutil.log(gutil.colors.red(err))
                    this.emit('end')
                }
            })
        )
        .pipe(svgSprite(config))
        .pipe(gulp.dest('_site/assets'))
})
