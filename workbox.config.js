export default {
    cacheId: 'mxb',
    globDirectory: './dist',
    globPatterns: ['**/*.woff2'],
    swDest: './dist/sw.js',
    sourcemap: false,
    cleanupOutdatedCaches: true,
    clientsClaim: true,
    skipWaiting: true,
    runtimeCaching: [
        {
            urlPattern: /\.(?:png|jpg|jpeg|gif|webp|avif)$/,
            handler: 'CacheFirst',
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
