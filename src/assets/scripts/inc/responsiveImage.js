import { detectIE } from '../utils'

const SELECTORS = {
    responsiveImage: '.js-responsive-image'
}

const transformImagesForIE = image => {
    const bg = document.createElement('div')

    bg.classList.add('responsive-image')
    bg.classList.add('responsive-image--fallback')
    bg.style.backgroundImage = `url(${image.src})`

    image.parentNode.replaceChild(bg, image)
}

export default function responsiveImage() {
    if (detectIE()) {
        const allImages = document.querySelectorAll(SELECTORS.responsiveImage)
        Array.from(allImages, transformImagesForIE)
    }
}
