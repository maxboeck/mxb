module.exports = {
    cacheId: 'mxb',
    globDirectory: './dist',
    globPatterns: ['**/*.{css,js,woff2}'],
    swDest: './dist/sw.js',
    sourcemap: false,
    cleanupOutdatedCaches: true,
    clientsClaim: true,
    skipWaiting: true,
    runtimeCaching: [
        {
            urlPattern: /\.(?:png|jpg|jpeg|gif|webp|svg)$/,
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'images',
                expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 60 * 60 * 24 * 365
                }
            }
        }
    ]
}
