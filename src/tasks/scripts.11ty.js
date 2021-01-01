const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const webpackConfig = require('../../webpack.config')
const MemoryFileSystem = require('memory-fs')

const ENTRY_POINTS = {
    main: 'src/assets/scripts/main.js',
    webmentions: 'src/assets/scripts/webmentions/index.js',
    sharer: 'src/assets/scripts/sharer/index.js'
}

module.exports = class {
    async data() {
        return {
            targets: ENTRY_POINTS,
            permalink: (data) => `/assets/scripts/${data.file}.js`,
            eleventyExcludeFromCollections: true,
            pagination: {
                data: 'targets',
                size: 1,
                alias: 'file'
            }
        }
    }

    async compile() {
        const mfs = new MemoryFileSystem()
        const resolveTargets = (targets) =>
            Object.keys(targets).reduce((acc, key) => {
                acc[key] = path.resolve(__dirname, '../../', targets[key])
                return acc
            }, {})

        const compiler = webpack({
            ...webpackConfig,
            entry: resolveTargets(ENTRY_POINTS)
        })

        compiler.outputFileSystem = mfs
        compiler.inputFileSystem = fs
        compiler.resolvers.normal.fileSystem = mfs

        this.compiledAssets = await new Promise((resolve, reject) => {
            compiler.run((err, stats) => {
                if (err || stats.hasErrors()) {
                    const errors =
                        err ||
                        (stats.compilation ? stats.compilation.errors : null)

                    reject(errors)
                    return
                }

                const { assets } = stats.compilation
                resolve(assets)
            })
        })
    }

    async getSource(file) {
        if (!this.compiledAssets) {
            await this.compile()
        }
        const fileName = `${file}.js`
        return this.compiledAssets[fileName].source()
    }

    async render({ file }) {
        try {
            return await this.getSource(file)
        } catch (err) {
            console.error(err)
            return null
        }
    }
}
