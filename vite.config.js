import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
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
                main: resolve(__dirname, 'src/assets/scripts/main.js')
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
            '@': resolve(__dirname, 'src/assets/scripts')
        }
    }
})
