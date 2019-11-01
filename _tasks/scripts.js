const config = require('./_config.json')
const gulp = require('gulp')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
require('dotenv').config()

const babelConfig = {
    test: /\.m?js$/,
    exclude: /(node_modules|bower_components)/,
    use: {
        loader: 'babel-loader',
        options: {
            presets: ['@babel/preset-env'],
            plugins: [['@babel/plugin-transform-react-jsx', { pragma: 'h' }]]
        }
    }
}
const webpackConfig = {
    entry: {
        main: `./${config.assetSrc}/scripts/main.js`,
        webmentions: `./${config.assetSrc}/scripts/webmentions/index.js`,
        sharer: `./${config.assetSrc}/scripts/sharer/index.js`,
        map: `./${config.assetSrc}/scripts/map/index.js`
    },
    output: { filename: '[name].js' },
    module: {
        rules: [babelConfig]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        })
    ]
}

gulp.task('scripts', function() {
    return gulp
        .src(config.assetSrc + '/scripts/main.js')
        .pipe(webpackStream(webpackConfig))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(config.assetDest + '/js'))
})
