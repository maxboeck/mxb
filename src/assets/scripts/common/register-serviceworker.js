// Register Service Worker

if ('serviceWorker' in navigator) {
    if (process.env.ELEVENTY_ENV !== 'production') {
        console.info('skipping service worker registration in development.')
    } else {
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('/sw.js')
                .catch((registrationError) => {
                    console.error('SW registration failed: ', registrationError)
                })
        })
    }
}

// disable PWA install prompt
window.addEventListener('beforeinstallprompt', (e) => e.preventDefault())
