const config = require('./_config.json')
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
    shape: {
        transform: ['svgo'],
        id: {
            generator: 'icon-%s'
        }
    },
    svg: {
        xmlDeclaration: false,
        doctypeDeclaration: false
    }
}

gulp.task('icons', function () {
    return gulp
        .src(config.assetSrc + '/icons/*.svg')
        .pipe(svgSprite(svgSpriteConfig))
        .pipe(gulp.dest(config.assetDest))
})
