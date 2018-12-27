// Register Service Worker

export default function() {
    if (window.env && window.env === 'dev') {
        console.log('skipping service worker registration in development.')
        return false
    }

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('/sw.js')
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError)
                })
        })
    }
}
