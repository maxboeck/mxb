import 'focus-visible'
import 'svgxuse'

import Navigation from './inc/navigation'
import infinitescroll from './inc/infinitescroll'
import registerServiceWorker from './inc/register-serviceworker'

function init() {
    new Navigation()
    infinitescroll()
    registerServiceWorker()
}

init()
