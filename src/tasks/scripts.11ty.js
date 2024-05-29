import fs from 'fs'
import mfs from 'memfs'

import path from 'path'
import webpack from 'webpack'
import webpackConfig from '../../webpack.config.js'

const ENTRY_POINTS = {
    main: 'src/assets/scripts/main.js',
    webmentions: 'src/assets/scripts/webmentions/index.js',
    sharer: 'src/assets/scripts/sharer/index.js'
}

export default class {
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
        const resolveTargets = (targets) =>
            Object.keys(targets).reduce((acc, key) => {
                acc[key] = path.resolve(process.cwd(), '../../', targets[key])
                return acc
            }, {})

        const compiler = webpack({
            ...webpackConfig,
            entry: resolveTargets(ENTRY_POINTS)
        })

        compiler.outputFileSystem = mfs
        compiler.inputFileSystem = fs
        compiler.intermediateFileSystem = mfs

        this.compiledAssets = await new Promise((resolve, reject) => {
            compiler.run((err, stats) => {
                if (err || stats.hasErrors()) {
                    const errors =
                        err ||
                        (stats.compilation ? stats.compilation.errors : null)

                    reject(errors)
                    return
                }

                const assets = stats.compilation.getAssets()
                resolve(assets)
            })
        })
    }

    async getFileContents(file) {
        if (!this.compiledAssets) {
            await this.compile()
        }
        const filePath = `${webpackConfig.output.path}/${file}.js`
        const fileBuffer = mfs.readFileSync(filePath)
        return fileBuffer
    }

    async render({ file }) {
        try {
            return await this.getFileContents(file)
        } catch (err) {
            console.error(err)
            return null
        }
    }
}
