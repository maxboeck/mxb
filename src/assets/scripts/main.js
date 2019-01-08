import 'focus-visible'
import 'svgxuse'
import './polyfills'

import Navigation from './inc/navigation'
import infinitescroll from './inc/infinitescroll'
import responsiveImage from './inc/responsiveImage'
import registerServiceWorker from './inc/register-serviceworker'

function init() {
    new Navigation()
    infinitescroll()
    responsiveImage()
    registerServiceWorker()
}

init()
