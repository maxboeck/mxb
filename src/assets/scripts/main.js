import 'focus-visible'
import 'svgxuse'
import './inc/polyfills'

import Navigation from './inc/navigation'
import infinitescroll from './inc/infinitescroll'
import responsiveImage from './inc/responsiveImage'
import darkmode from './inc/darkmode'
import registerServiceWorker from './inc/register-serviceworker'

function init() {
    new Navigation()
    infinitescroll()
    responsiveImage()
    darkmode()
    registerServiceWorker()
}

init()
