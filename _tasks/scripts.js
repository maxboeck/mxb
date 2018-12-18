const config = require('./_config.json')
const gulp = require('gulp')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const webpack = require('webpack-stream')

const webpackConfig = {
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    compact: false
                }
            }
        ]
    }
}

gulp.task('scripts', function() {
    return gulp
        .src(config.assetSrc + '/scripts/main.js')
        .pipe(webpack(webpackConfig))
        .pipe(uglify())
        .pipe(rename('bundle.js'))
        .pipe(gulp.dest(config.assetDest + '/js'))
})
