require('dotenv').config()

const path = require('path')
const webpack = require('webpack')

const OUTPUT_PATH = path.resolve(__dirname, './memory-fs/js/')
const IS_PRODUCTION = process.env.ELEVENTY_ENV === 'production'
const ENV_PLUGIN = new webpack.EnvironmentPlugin({
    ELEVENTY_ENV: process.env.ELEVENTY_ENV
})

module.exports = {
    mode: IS_PRODUCTION ? 'production' : 'development',
    output: { path: OUTPUT_PATH },
    plugins: [ENV_PLUGIN],
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            '@babel/plugin-transform-runtime',
                            [
                                '@babel/plugin-transform-react-jsx',
                                { pragma: 'h' }
                            ]
                        ]
                    }
                }
            }
        ]
    }
}
