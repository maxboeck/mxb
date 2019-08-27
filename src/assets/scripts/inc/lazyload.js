const SELECTORS = {
    lazyloadImage: 'img[data-src]'
}

function initLazyLoad() {
    if ('connection' in navigator && navigator.connection.saveData === true) {
        return
    }

    const lazyload = changes => {
        changes.forEach(function(change) {
            if (change.isIntersecting) {
                change.target.setAttribute(
                    'src',
                    change.target.getAttribute('data-src')
                )
                observer.unobserve(change.target)
            }
        })
    }
    const observer = new IntersectionObserver(lazyload, {
        rootMargin: '0px 0px 100% 0px'
    })

    document.querySelectorAll(SELECTORS.lazyloadImage).forEach(img => {
        observer.observe(img)
    })
}

if (
    typeof IntersectionObserver !== 'undefined' &&
    'forEach' in NodeList.prototype
) {
    initLazyLoad()
    window.initLazyLoad = initLazyLoad
}
