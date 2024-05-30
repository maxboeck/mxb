import { resolve } from 'path'
import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

export default defineConfig({
    plugins: [preact()],
    css: {
        devSourcemap: true
    },
    build: {
        outDir: resolve(__dirname, 'dist'),
        emptyOutDir: false,
        sourcemap: 'hidden',
        manifest: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/assets/scripts/main.js'),
                sharer: resolve(
                    __dirname,
                    'src/assets/scripts/sharer/index.jsx'
                )
            },
            output: {
                assetFileNames: 'assets/styles/[name].[hash].css',
                chunkFileNames: 'assets/scripts/[name].[hash].js',
                entryFileNames: 'assets/scripts/[name].[hash].js'
            }
        }
    },
    resolve: {
        alias: {
            '@assets': resolve(__dirname, 'src/assets')
        }
    }
})
