const fs = require('fs')
const path = require('path')
const util = require('util')
const glob = require('glob')
const File = require('vinyl')
const SVGSpriter = require('svg-sprite')

module.exports = class {
    async data() {
        const config = {
            mode: {
                inline: true,
                symbol: {
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

        return {
            permalink: '/assets/icons/icons.sprite.svg',
            eleventyExcludeFromCollections: true,
            config
        }
    }

    async compile(dir, config) {
        // Make a new SVGSpriter instance w/ configuration
        const spriter = new SVGSpriter(config)

        // Wrap spriter compile function in a Promise
        const compileSprite = async (args) => {
            return new Promise((resolve, reject) => {
                spriter.compile(args, (error, result) => {
                    if (error) {
                        return reject(error)
                    }
                    resolve(result.symbol.sprite)
                })
            })
        }

        // Get all SVG icon files in working directory
        const getFiles = util.promisify(glob)
        const files = await getFiles('**/*.svg', { cwd: dir })

        // Add them all to the spriter
        files.forEach(function (file) {
            const filePath = path.join(dir, file)
            spriter.add(
                new File({
                    path: filePath,
                    base: dir,
                    contents: fs.readFileSync(filePath)
                })
            )
        })

        // Compile the sprite file and return it as a string
        const sprite = await compileSprite(config.mode)
        const spriteContent = sprite.contents.toString('utf8')
        return spriteContent
    }

    async render({ config }) {
        try {
            const cwd = path.resolve('src/assets/icons')
            const sprite = await this.compile(cwd, config)
            return sprite
        } catch (err) {
            console.error(err)
        }
    }
}
