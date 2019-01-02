import InfiniteScroll from 'infinite-scroll'

const SELECTORS = {
    container: '.js-infinitescroll-container',
    item: '.js-infinitescroll-item',
    pagination: '.js-infinitescroll-pagination',
    nextLink: '.js-infinitescroll-next'
}

export default function() {
    const container = document.querySelector(SELECTORS.container)
    if (container) {
        const infinite = new InfiniteScroll(container, {
            path: SELECTORS.nextLink,
            append: SELECTORS.item,
            hideNav: SELECTORS.pagination
        })
        console.log(infinite)
    }
}
