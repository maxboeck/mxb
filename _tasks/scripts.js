require('dotenv').config()

const config = require('./_config.json')
const gulp = require('gulp')
const uglify = require('gulp-uglify')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const mapValues = require('lodash/mapValues')

// Define Script Entrypoints Here
const SCRIPTS = {
    main: `main.js`,
    webmentions: `webmentions/index.js`,
    sharer: `sharer/index.js`,
    map: `map/index.js`
}

// Provide JS build with current env
const envPlugin = new webpack.DefinePlugin({
    'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
})

// Babel Transforms for Preact
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

gulp.task('scripts', function() {
    const entryPaths = mapValues(
        SCRIPTS,
        file => `./${config.assetSrc}/scripts/${file}`
    )
    return gulp
        .src(config.assetSrc + '/scripts/main.js')
        .pipe(
            webpackStream({
                entry: entryPaths,
                output: { filename: '[name].js' },
                module: { rules: [babelConfig] },
                plugins: [envPlugin]
            })
        )
        .pipe(uglify())
        .pipe(gulp.dest(config.assetDest + '/js'))
})
