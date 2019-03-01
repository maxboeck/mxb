// Register Service Worker

if ('serviceWorker' in navigator) {
    if (window.env && window.env === 'dev') {
        console.info('skipping service worker registration in development.')
    } else {
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('/sw.js')
                .catch(registrationError => {
                    console.error('SW registration failed: ', registrationError)
                })
        })
    }
}
