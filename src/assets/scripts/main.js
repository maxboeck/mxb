import 'focus-visible'
import 'svgxuse'
import './inc/polyfills'

import Navigation from './inc/navigation'
import DarkMode from './inc/darkmode'
import infinitescroll from './inc/infinitescroll'
import responsiveImage from './inc/responsiveImage'
import registerServiceWorker from './inc/register-serviceworker'

function init() {
    new Navigation()
    new DarkMode()

    infinitescroll()
    responsiveImage()
    registerServiceWorker()
}

init()
