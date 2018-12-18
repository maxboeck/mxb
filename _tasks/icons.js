const config = require('./config.json')
const gulp = require('gulp')
const svgSprite = require('gulp-svg-sprite')

const svgSpriteConfig = {
    mode: {
        inline: true,
        symbol: {
            dest: 'icons',
            sprite: 'icons.sprite.svg',
            example: false
        }
    },
    svg: {
        xmlDeclaration: false, // strip out the XML attribute
        doctypeDeclaration: false // don't include the !DOCTYPE declaration
    }
}

gulp.task('icons', function() {
    return gulp
        .src(config.assetSrc + '/icons/*.svg')
        .pipe(svgSprite(svgSpriteConfig))
        .pipe(gulp.dest(config.assetDest))
})
